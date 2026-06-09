import ServerError from "../helpers/serverError.helper.js";
import workspaceService from "../services/workspace.service.js";

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
}
export default new WorkspaceController();