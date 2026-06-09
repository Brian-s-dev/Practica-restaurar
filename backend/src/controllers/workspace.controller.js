import ServerError from "../helpers/serverError.helper.js";
import workspaceService from "../services/workspace.service.js";
import workspaceRepository from "../repositories/workspace.repository.js";

class WorkspaceController {

    async create(request, response) {
        const { nombre, descripcion } = request.body;
        const user_id = request.user.id;

        if (!nombre || nombre.trim() === '') {
            throw new ServerError("El nombre del espacio de trabajo es obligatorio", 400);
        }

        const newWorkspace = await workspaceService.createWorkspace(nombre, descripcion, user_id);

        return response.status(201).json({
            ok: true,
            message: "Espacio de trabajo creado con éxito",
            data: { workspace: newWorkspace }
        });
    }

    async getAllByUser(request, response) {
        const user_id = request.user.id;
        const workspaces = await workspaceRepository.getAllWorkspacesByUserId(user_id);

        return response.status(200).json({
            ok: true,
            message: "Espacios de trabajo obtenidos",
            data: { workspaces }
        });
    }

    async deleteById(request, response) {
        const { workspace_id } = request.params;

        await workspaceRepository.deleteById(workspace_id);

        return response.status(200).json({
            ok: true,
            message: "Espacio de trabajo eliminado"
        });
    }

    async updateById(request, response) {
        const { workspace_id } = request.params;
        const { nombre, descripcion } = request.body;

        const updatedWorkspace = await workspaceRepository.updateById(workspace_id, { nombre, descripcion });

        return response.status(200).json({
            ok: true,
            message: "Espacio de trabajo actualizado",
            data: { workspace: updatedWorkspace }
        });
    }
}

export default new WorkspaceController();