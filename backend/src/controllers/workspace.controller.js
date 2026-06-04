import workspaceRepository from '../repositories/workspace.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import ServerError from '../helpers/serverError.helper.js';
import { MEMBER_WORKSPACE_ROLES } from '../constants/memberRoles.constant.js';

class WorkspaceController {
    async create(request, response) {
        try {
            const { nombre, descripcion } = request.body;

            const user_id = request.user.id;

            if (!nombre || nombre.trim() === '') {
                throw new ServerError("El nombre del espacio de trabajo es obligatorio", 400);
            }

            const newWorkspace = await workspaceRepository.create(
                nombre,
                descripcion || ''
            );

            await workspaceMemberRepository.create({
                fk_workspace_id: newWorkspace._id,
                fk_user_id: user_id,
                rol: MEMBER_WORKSPACE_ROLES.OWNER
            });

            return response.status(201).json({
                ok: true,
                message: "Espacio de trabajo creado con éxito",
                data: {
                    workspace: newWorkspace
                }
            });

        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message
                });
            } else {
                console.error("Error en WorkspaceController:", error);
                return response.status(500).json({
                    ok: false,
                    message: "Error interno del servidor"
                });
            }
        }
    }

    async getAllByUser(req, res) {
        try {
            const user_id = req.user.id;
            const workspaces = await workspaceMemberRepository.getByUserId(user_id);

            return res.status(200).json({
                ok: true,
                message: "Espacios de trabajo obtenidos",
                data: { workspaces }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(500).json({ ok: false, message: "Error interno" });
            }
            console.error(error);
        }
    }

    async deleteById(req, res) {
        try {
            const { workspace_id } = req.params;
            const user_role = req.member.rol;

            if (user_role !== MEMBER_WORKSPACE_ROLES.OWNER) {
                throw new ServerError("No tienes permisos para eliminar este espacio. Solo el dueño puede hacerlo.", 403);
            }

            await workspaceRepository.softDeleteById(workspace_id);

            return res.status(200).json({
                ok: true,
                message: "Espacio de trabajo eliminado correctamente"
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json({ ok: false, message: error.message });
            }
            console.error(error);
            return res.status(500).json({ ok: false, message: "Error interno" });
        }
    }

    async updateById(req, res) {
        try {
            const { workspace_id } = req.params;
            const { nombre, descripcion } = req.body;
            const user_role = req.member.rol;

            if (user_role !== MEMBER_WORKSPACE_ROLES.OWNER && user_role !== MEMBER_WORKSPACE_ROLES.ADMIN) {
                throw new ServerError("No tienes permisos suficientes para editar este espacio.", 403);
            }

            const updateData = {};
            if (nombre) updateData.nombre = nombre;
            if (descripcion !== undefined) updateData.descripcion = descripcion;

            const updatedWorkspace = await workspaceRepository.updateById(workspace_id, updateData);

            return res.status(200).json({
                ok: true,
                message: "Espacio actualizado",
                data: { workspace: updatedWorkspace }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json({ ok: false, message: error.message });
            }
            console.error(error);
            return res.status(500).json({ ok: false, message: "Error interno" });
        }
    }

    async inviteUser(request, response) {
        try {
            const { workspace_id } = request.params;
            const { invited_email, role } = request.body;

            if (!invited_email || !role) throw new ServerError("Faltan datos obligatorios (email y rol)", 400);

            const userToInvite = await userRepository.getByEmail(invited_email);
            if (!userToInvite) throw new ServerError("El usuario ingresado no existe en el sistema", 404);

            const isMember = await workspaceMemberRepository.getMemberByWorkspaceAndUserId(workspace_id, userToInvite._id);
            if (isMember) throw new ServerError("El usuario ya es un miembro del espacio de trabajo", 400);

            const existingInvitation = await workspaceInvitationRepository.getLatestInvitation(workspace_id, userToInvite._id);

            if (existingInvitation) {
                const ahora = new Date();

                if (existingInvitation.status === 'PENDIENTE') {
                    if (existingInvitation.expires_at < ahora) {
                        await workspaceInvitationRepository.deleteById(existingInvitation._id);
                    } else {
                        throw new ServerError("Ya has invitado a este usuario y la invitación sigue pendiente", 400);
                    }
                } else if (existingInvitation.status === 'RECHAZADA') {
                    const diasDesdeRechazo = (ahora - existingInvitation.updatedAt) / (1000 * 60 * 60 * 24);

                    if (diasDesdeRechazo < 7) {
                        throw new ServerError("El usuario rechazó tu invitación recientemente. Intenta de nuevo la próxima semana.", 400);
                    } else {
                        await workspaceInvitationRepository.deleteById(existingInvitation._id);
                    }
                }
            }

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7);

            const newInvitation = await workspaceInvitationRepository.create({
                workspace_id,
                user_id: userToInvite._id,
                rol: role,
                status: 'PENDIENTE',
                expires_at: expirationDate
            });

            const token = jwt.sign(
                { invitation_id: newInvitation._id },
                ENVIRONMENT.JWT_SECRET,
                { expiresIn: "7d" }
            );

            const urlAceptar = `http://localhost:${ENVIRONMENT.PORT}/api/workspace/${workspace_id}/members/accept?token=${token}`;
            const urlRechazar = `http://localhost:${ENVIRONMENT.PORT}/api/workspace/${workspace_id}/members/reject?token=${token}`;

            await sendInvitationEmail(invited_email, role, urlAceptar, urlRechazar);

            return response.status(200).json({ ok: true, message: "Invitación enviada con éxito" });

        } catch (error) {
            if (error instanceof ServerError) return response.status(error.status).json({ ok: false, message: error.message });
            return response.status(500).json({ ok: false, message: "Error interno del servidor", detail: error.message });
        }
    }

    async processInvitation(request, response) {
        try {
            const { decision } = request.params;
            const { token } = request.query;

            if (!token) throw new ServerError("Falta token de seguridad", 400);
            if (decision !== 'accept' && decision !== 'reject') throw new ServerError("Decisión no válida", 400);

            const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET);

            const invitation = await workspaceInvitationRepository.getById(decoded.invitation_id);
            if (!invitation) throw new ServerError("Invitación no encontrada o eliminada", 404);

            if (invitation.status !== 'PENDIENTE') {
                throw new ServerError("Esta invitación ya fue procesada anteriormente", 400);
            }

            if (invitation.expires_at < new Date()) {
                throw new ServerError("Esta invitación ha expirado", 400);
            }

            if (decision === 'accept') {
                await workspaceInvitationRepository.updateById(invitation._id, { status: 'ACEPTADA' });

                await workspaceMemberRepository.create({
                    fk_workspace_id: invitation.workspace_id,
                    fk_user_id: invitation.user_id,
                    rol: invitation.rol
                });

                return response.send("<h1 style='color: green;'>¡Invitación Aceptada! Ya eres miembro del espacio de trabajo.</h1>");
            }

            if (decision === 'reject') {
                await workspaceInvitationRepository.updateById(invitation._id, { status: 'RECHAZADA' });
                return response.send("<h1 style='color: red;'>Invitación Rechazada. No fuiste añadido al espacio de trabajo.</h1>");
            }

        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
                return response.status(401).send("<h1>El enlace es inválido o la invitación ha expirado</h1>");
            }
            if (error instanceof ServerError) return response.status(error.status).send(`<h1>${error.message}</h1>`);
            return response.status(500).send("<h1>Error interno</h1>");
        }
    }
}

const workspaceController = new WorkspaceController();
export default workspaceController;