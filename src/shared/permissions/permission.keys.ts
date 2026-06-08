export const PERMISSION_SCOPE = {
  SYSTEM: "system",
  WORKSPACE: "workspace",
} as const;

export type PermissionScope =
  (typeof PERMISSION_SCOPE)[keyof typeof PERMISSION_SCOPE];

export const PERMISSIONS = {
  // System scope
  PERMISSION_READ: "permission.read",
  PERMISSION_UPDATE: "permission.update",
  PERMISSION_DELETE: "permission.delete",
  USER_READ: "user.read",
  USER_UPDATE: "user.update",
  USER_DELETE: "user.delete",
  SYSTEM_ROLE_READ: "system_role.read",
  SYSTEM_ROLE_UPDATE: "system_role.update",
  SYSTEM_ROLE_DELETE: "system_role.delete",
  SYSTEM_STATS_READ: "system_stats.read",

  // Workspace scope
  WORKSPACE_READ: "workspace.read",
  WORKSPACE_UPDATE: "workspace.update",
  WORKSPACE_DELETE: "workspace.delete",

  MEMBER_INVITE: "member.invite",
  MEMBER_READ: "member.read",
  MEMBER_UPDATE_ROLE: "member.update_role",
  MEMBER_REMOVE: "member.remove",

  ROLE_CREATE: "role.create",
  ROLE_READ: "role.read",
  ROLE_UPDATE: "role.update",
  ROLE_DELETE: "role.delete",
  ROLE_ASSIGN_PERMISSION: "role.assign_permission",

  PROJECT_CREATE: "project.create",
  PROJECT_READ: "project.read",
  PROJECT_UPDATE: "project.update",
  PROJECT_DELETE: "project.delete",

  SCAN_CREATE: "scan.create",
  SCAN_READ: "scan.read",
  SCAN_IMPORT: "scan.import",

  ISSUE_READ: "issue.read",
  ISSUE_UPDATE_STATUS: "issue.update_status",
  ISSUE_COMMENT: "issue.comment",

  ARTIFACT_READ: "artifact.read",
  ARTIFACT_UPLOAD: "artifact.upload",
  ARTIFACT_DELETE: "artifact.delete",

  AI_ANALYZE: "ai.analyze",

  BILLING_READ: "billing.read",
  BILLING_MANAGE: "billing.manage",

  API_MONITOR_READ: "api_monitor.read",
  API_MONITOR_MANAGE: "api_monitor.manage",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_LIST: Array<{
  key: PermissionKey;
  description: string;
  scope: PermissionScope;
}> = [
  {
    key: PERMISSIONS.PERMISSION_READ,
    description: "View permissions",
    scope: PERMISSION_SCOPE.SYSTEM,
  },
  {
    key: PERMISSIONS.PERMISSION_UPDATE,
    description: "Update permissions",
    scope: PERMISSION_SCOPE.SYSTEM,
  },
  {
    key: PERMISSIONS.PERMISSION_DELETE,
    description: "Delete permissions",
    scope: PERMISSION_SCOPE.SYSTEM,
  },
  {
    key: PERMISSIONS.USER_READ,
    description: "View system users",
    scope: PERMISSION_SCOPE.SYSTEM,
  },
  {
    key: PERMISSIONS.USER_UPDATE,
    description: "Update system users",
    scope: PERMISSION_SCOPE.SYSTEM,
  },
  {
    key: PERMISSIONS.USER_DELETE,
    description: "Delete system users",
    scope: PERMISSION_SCOPE.SYSTEM,
  },
  {
    key: PERMISSIONS.SYSTEM_ROLE_READ,
    description: "View system roles",
    scope: PERMISSION_SCOPE.SYSTEM,
  },
  {
    key: PERMISSIONS.SYSTEM_ROLE_UPDATE,
    description: "Update system roles",
    scope: PERMISSION_SCOPE.SYSTEM,
  },
  {
    key: PERMISSIONS.SYSTEM_ROLE_DELETE,
    description: "Delete system roles",
    scope: PERMISSION_SCOPE.SYSTEM,
  },
  {
    key: PERMISSIONS.SYSTEM_STATS_READ,
    description: "View system statistics",
    scope: PERMISSION_SCOPE.SYSTEM,
  },

  {
    key: PERMISSIONS.WORKSPACE_READ,
    description: "View workspace information",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.WORKSPACE_UPDATE,
    description: "Update workspace information",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.WORKSPACE_DELETE,
    description: "Delete workspace",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },

  {
    key: PERMISSIONS.MEMBER_INVITE,
    description: "Invite workspace members",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.MEMBER_READ,
    description: "View workspace members",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.MEMBER_UPDATE_ROLE,
    description: "Update member roles",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.MEMBER_REMOVE,
    description: "Remove workspace members",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },

  {
    key: PERMISSIONS.ROLE_CREATE,
    description: "Create custom roles",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.ROLE_READ,
    description: "View roles and permissions",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.ROLE_UPDATE,
    description: "Update custom roles",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.ROLE_DELETE,
    description: "Delete custom roles",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.ROLE_ASSIGN_PERMISSION,
    description: "Assign permissions to roles",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },

  {
    key: PERMISSIONS.PROJECT_CREATE,
    description: "Create projects",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.PROJECT_READ,
    description: "View projects",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.PROJECT_UPDATE,
    description: "Update projects",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.PROJECT_DELETE,
    description: "Delete projects",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },

  {
    key: PERMISSIONS.SCAN_CREATE,
    description: "Create scan runs",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.SCAN_READ,
    description: "View scan runs",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.SCAN_IMPORT,
    description: "Import scan results",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },

  {
    key: PERMISSIONS.ISSUE_READ,
    description: "View scan issues",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.ISSUE_UPDATE_STATUS,
    description: "Update issue status",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.ISSUE_COMMENT,
    description: "Comment on issues",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },

  {
    key: PERMISSIONS.ARTIFACT_READ,
    description: "View artifacts",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.ARTIFACT_UPLOAD,
    description: "Upload artifacts",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.ARTIFACT_DELETE,
    description: "Delete artifacts",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },

  {
    key: PERMISSIONS.AI_ANALYZE,
    description: "Use AI UX Consultant",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },

  {
    key: PERMISSIONS.BILLING_READ,
    description: "View billing information",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.BILLING_MANAGE,
    description: "Manage billing and subscriptions",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },

  {
    key: PERMISSIONS.API_MONITOR_READ,
    description: "View API monitoring",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
  {
    key: PERMISSIONS.API_MONITOR_MANAGE,
    description: "Manage API monitoring targets",
    scope: PERMISSION_SCOPE.WORKSPACE,
  },
];
