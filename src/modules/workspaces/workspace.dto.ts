export type WorkspaceDto = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateWorkspaceInputDto = {
  name: string;
  slug?: string;
};
export type UpdateWorkspaceInputDto = {
  name?: string;
  slug?: string;
};

export type GetWorkspacesResponseDto = {
  workspaces: WorkspaceDto[];
};

export type GetWorkspaceResponseDto = {
  workspace: WorkspaceDto;
};

export type DeleteWorkspaceResponseDto = {
  success: boolean;
};
