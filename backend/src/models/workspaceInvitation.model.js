import mongoose from "mongoose";
import { WORKSPACE_COLLECTION_NAME } from "./workspace.model.js";
import { USER_COLLECTION_NAME } from "./user.model.js";
import { MEMBER_WORKSPACE_ROLES } from "../constants/memberRoles.constant.js";

export const INVITATION_STATUS = {
    PENDING: 'PENDIENTE',
    ACCEPTED: 'ACEPTADA',
    REJECTED: 'RECHAZADA'
};

const workspaceInvitationSchema = new mongoose.Schema({
    workspace_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: WORKSPACE_COLLECTION_NAME
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: USER_COLLECTION_NAME
    },
    rol: {
        type: String,
        enum: [MEMBER_WORKSPACE_ROLES.ADMIN, MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.USER],
        required: true
    },
    status: {
        type: String,
        enum: [INVITATION_STATUS.PENDING, INVITATION_STATUS.ACCEPTED, INVITATION_STATUS.REJECTED],
        default: INVITATION_STATUS.PENDING
    },
    expires_at: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

export const WORKSPACE_INVITATION_MODEL_NAME = 'WorkspaceInvitation';
const WorkspaceInvitation = mongoose.model(WORKSPACE_INVITATION_MODEL_NAME, workspaceInvitationSchema);

export default WorkspaceInvitation;