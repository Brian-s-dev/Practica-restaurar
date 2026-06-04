import WorkspaceInvitation from "../models/workspaceInvitation.model.js";

class WorkspaceInvitationRepository {
    async create(invitationData) {
        return await WorkspaceInvitation.create(invitationData);
    }

    async getById(invitation_id) {
        return await WorkspaceInvitation.findById(invitation_id);
    }

    async getLatestInvitation(workspace_id, user_id) {
        return await WorkspaceInvitation.findOne({ workspace_id, user_id }).sort({ createdAt: -1 });
    }

    async updateById(invitation_id, updateData) {
        return await WorkspaceInvitation.findByIdAndUpdate(invitation_id, updateData, { returnDocument: 'after' });
    }

    async deleteById(invitation_id) {
        return await WorkspaceInvitation.findByIdAndDelete(invitation_id);
    }
}

export default new WorkspaceInvitationRepository();