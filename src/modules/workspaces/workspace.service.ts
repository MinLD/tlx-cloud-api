import { DEFAULT_WORKSPACE_ROLE_NAMES } from "../../shared/permissions/default-roles.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { HttpError } from "../../shared/errors/http.error.js";
import type {
  CreateWorkspaceInputDto,
  DeleteWorkspaceResponseDto,
  GetWorkspaceResponseDto,
  GetWorkspacesResponseDto,
  UpdateWorkspaceInputDto,
} from "./workspace.dto.js";
import { toWorkspaceDto } from "./workspace.mapper.js";
import { workspaceRepository } from "./workspace.repository.js";
import { rbacRepository } from "../rbac/rbac.repository.js";

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureWorkspaceAccess = async (userId: string, workspaceId: string) => {
  const membership = await workspaceRepository.findMembership(userId, workspaceId);

  if (!membership) {
    throw new HttpError(403, "FORBIDDEN", "You do not have access to this workspace");
  }

  return membership;
};

const ensureSlugUnique = async (slug: string, workspaceId?: string) => {
  const existed = await workspaceRepository.findBySlug(slug);

  if (existed && existed.id !== workspaceId) {
    throw new HttpError(409, "CONFLICT", "Workspace slug already exists");
  }
};


export const workspaceService = {
  async getWorkspaces(userId: string): Promise<GetWorkspacesResponseDto> {
    const workspaces = await workspaceRepository.findManyByUserId(userId);
    return {
      workspaces: workspaces.map(toWorkspaceDto),
    };
  },

  async getWorkspaceById(
    userId: string,
    workspaceId: string
  ): Promise<GetWorkspaceResponseDto> {
    await ensureWorkspaceAccess(userId, workspaceId);

    const workspace = await workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new HttpError(404, "NOT_FOUND", "Workspace not found");
    }

    return {
      workspace: toWorkspaceDto(workspace),
    };
  },

  async createWorkspace(
    userId: string,
    input: CreateWorkspaceInputDto
  ): Promise<GetWorkspaceResponseDto> {
    const slug = slugify(input.slug ?? input.name);

    await ensureSlugUnique(slug);

    const ownerRole = await rbacRepository.findRoleByName(
      null,
      DEFAULT_WORKSPACE_ROLE_NAMES.OWNER,
    );

    if (!ownerRole) {
      throw new HttpError(500, "INTERNAL_SERVER_ERROR", "Owner role not found");
    }

    const workspace = await workspaceRepository.create(
      {
        name: input.name,
        slug,
      },
      userId,
      ownerRole.id
    );

    return {
      workspace: toWorkspaceDto(workspace),
    };
  },

  async updateWorkspace(
    userId: string,
    workspaceId: string,
    input: UpdateWorkspaceInputDto
  ): Promise<GetWorkspaceResponseDto> {
    await ensureWorkspaceAccess(userId, workspaceId);

    const existing = await workspaceRepository.findById(workspaceId);

    if (!existing) {
      throw new HttpError(404, "NOT_FOUND", "Workspace not found");
    }

    const data: { name?: string; slug?: string } = {};

    if (input.name !== undefined) {
      data.name = input.name;
    }

    if (input.slug !== undefined) {
      data.slug = slugify(input.slug);
      await ensureSlugUnique(data.slug, workspaceId);
    }

    const workspace = await workspaceRepository.update(workspaceId, data);

    return {
      workspace: toWorkspaceDto(workspace),
    };
  },

  async deleteWorkspace(
    userId: string,
    workspaceId: string
  ): Promise<DeleteWorkspaceResponseDto> {
    await ensureWorkspaceAccess(userId, workspaceId);

    const existing = await workspaceRepository.findById(workspaceId);

    if (!existing) {
      throw new HttpError(404, "NOT_FOUND", "Workspace not found");
    }

    await workspaceRepository.delete(workspaceId);

    return {
      success: true,
    };
  },
};