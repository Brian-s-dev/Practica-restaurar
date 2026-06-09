import workspaceRepository from "../repositories/workspace.repository.js";
import workspaceMemberRepository from "../repositories/workspaceMember.repository.js";
import { MEMBER_WORKSPACE_ROLES } from "../constants/memberRoles.constant.js";
import ServerError from "../helpers/serverError.helper.js";

class WorkspaceService {
    async createWorkspace(nombre, descripcion, user_id) {
        const newWorkspace = await workspaceRepository.create(nombre, descripcion || '');

        await workspaceMemberRepository.create({
            fk_workspace_id: newWorkspace._id,
            fk_user_id: user_id,
            rol: MEMBER_WORKSPACE_ROLES.OWNER
        });

        return newWorkspace;
    }
}

export default new WorkspaceService();