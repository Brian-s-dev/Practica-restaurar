import express from 'express';
import workspaceController from '../controllers/workspace.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import workspaceMiddleware from '../middleware/workspace.middleware.js';
import { MEMBER_WORKSPACE_ROLES } from '../constants/memberRoles.constant.js';

const workspaceRouter = express.Router();
workspaceRouter.use(authMiddleware);

workspaceRouter.post(
    '/',
    workspaceController.create
);

workspaceRouter.get(
    '/',
    workspaceController.getAllByUser
);

workspaceRouter.put(
    '/:workspace_id',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.ADMIN, MEMBER_WORKSPACE_ROLES.OWNER]),
    workspaceController.updateById
);

workspaceRouter.delete(
    '/:workspace_id',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    workspaceController.deleteById);

workspaceRouter.post(
    '/:workspace_id/members',
    authMiddleware,
    workspaceMiddleware(['owner', 'admin']),
    workspaceController.inviteUser
);

workspaceRouter.get(
    '/:workspace_id/members/:decision',
    workspaceController.processInvitation
);

export default workspaceRouter;