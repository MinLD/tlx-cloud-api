import type { Workspace } from "../../generated/prisma/client.js";
import type { WorkspaceDto } from "./workspace.dto.js";

const toWorkspaceDto = (ws: Workspace): WorkspaceDto => ({
  id: ws.id,
  name: ws.name,
  slug: ws.slug,
  createdAt: ws.createdAt.toISOString(),
  updatedAt: ws.updatedAt.toISOString(),
});

export { toWorkspaceDto };
