import MEMBER_INVITATION_STATUS from "../constants/memberInvitationStatus.constant.js";
import ServerError from "../helpers/serverError.helper.js";
import userRepository from "../repositories/user.repository.js";
import workspaceMemberRepository from "../repositories/workspaceMember.repository.js";
import memberWorkspaceService from "../services/memberWorkspace.service.js";

class MemberWorkspaceController {
    async inviteUser(request, response) {
        try {
            const { workspace_id } = request.params;
            const { invited_email, role } = request.body;
            const { id: client_id } = request.user;


            if (!invited_email || !role) {
                throw new ServerError("Faltan datos obligatorios (email y rol)", 400);
            }

            await memberWorkspaceService.inviteUser(
                client_id,
                invited_email,
                workspace_id,
                role
            )

            return response.status(200).json({
                ok: true,
                message: "Invitación enviada con éxito"
            });

        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message
                });
            }
            return response.status(500).json({ ok: false, message: "Error interno del servidor", detail: error.message });
        }
    }

    /*  async processInvitation(request, response) {
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
     } */
}

const memberWorkspaceController = new MemberWorkspaceController()
export default memberWorkspaceController