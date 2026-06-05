export const PERMISSIONS = {
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
  API_MONITOR_MANAGE: "api_monitor.manage"
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_LIST: Array<{
  key: PermissionKey;
  description: string;
}> = [
  {
    key: PERMISSIONS.WORKSPACE_READ,
    description: "View workspace information"
  },
  {
    key: PERMISSIONS.WORKSPACE_UPDATE,
    description: "Update workspace information"
  },
  {
    key: PERMISSIONS.WORKSPACE_DELETE,
    description: "Delete workspace"
  },

  {
    key: PERMISSIONS.MEMBER_INVITE,
    description: "Invite workspace members"
  },
  {
    key: PERMISSIONS.MEMBER_READ,
    description: "View workspace members"
  },
  {
    key: PERMISSIONS.MEMBER_UPDATE_ROLE,
    description: "Update member roles"
  },
  {
    key: PERMISSIONS.MEMBER_REMOVE,
    description: "Remove workspace members"
  },

  {
    key: PERMISSIONS.ROLE_CREATE,
    description: "Create custom roles"
  },
  {
    key: PERMISSIONS.ROLE_READ,
    description: "View roles and permissions"
  },
  {
    key: PERMISSIONS.ROLE_UPDATE,
    description: "Update custom roles"
  },
  {
    key: PERMISSIONS.ROLE_DELETE,
    description: "Delete custom roles"
  },
  {
    key: PERMISSIONS.ROLE_ASSIGN_PERMISSION,
    description: "Assign permissions to roles"
  },

  {
    key: PERMISSIONS.PROJECT_CREATE,
    description: "Create projects"
  },
  {
    key: PERMISSIONS.PROJECT_READ,
    description: "View projects"
  },
  {
    key: PERMISSIONS.PROJECT_UPDATE,
    description: "Update projects"
  },
  {
    key: PERMISSIONS.PROJECT_DELETE,
    description: "Delete projects"
  },

  {
    key: PERMISSIONS.SCAN_CREATE,
    description: "Create scan runs"
  },
  {
    key: PERMISSIONS.SCAN_READ,
    description: "View scan runs"
  },
  {
    key: PERMISSIONS.SCAN_IMPORT,
    description: "Import scan results"
  },

  {
    key: PERMISSIONS.ISSUE_READ,
    description: "View scan issues"
  },
  {
    key: PERMISSIONS.ISSUE_UPDATE_STATUS,
    description: "Update issue status"
  },
  {
    key: PERMISSIONS.ISSUE_COMMENT,
    description: "Comment on issues"
  },

  {
    key: PERMISSIONS.ARTIFACT_READ,
    description: "View artifacts"
  },
  {
    key: PERMISSIONS.ARTIFACT_UPLOAD,
    description: "Upload artifacts"
  },
  {
    key: PERMISSIONS.ARTIFACT_DELETE,
    description: "Delete artifacts"
  },

  {
    key: PERMISSIONS.AI_ANALYZE,
    description: "Use AI UX Consultant"
  },

  {
    key: PERMISSIONS.BILLING_READ,
    description: "View billing information"
  },
  {
    key: PERMISSIONS.BILLING_MANAGE,
    description: "Manage billing and subscriptions"
  },

  {
    key: PERMISSIONS.API_MONITOR_READ,
    description: "View API monitoring"
  },
  {
    key: PERMISSIONS.API_MONITOR_MANAGE,
    description: "Manage API monitoring targets"
  }
];
