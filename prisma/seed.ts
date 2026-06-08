import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import {
  DEFAULT_SYSTEM_ROLE_NAMES,
  DEFAULT_SYSTEM_ROLE_PERMISSIONS,
  DEFAULT_WORKSPACE_ROLE_NAMES,
  DEFAULT_WORKSPACE_ROLE_PERMISSIONS,
} from "../src/shared/permissions/default-roles.js";
import { PERMISSION_LIST, PERMISSION_SCOPE } from "../src/shared/permissions/permission.keys.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({
  connectionString
});

const prisma = new PrismaClient({
  adapter
});

const seedPermissions = async () => {
  for (const permission of PERMISSION_LIST) {
    await prisma.permission.upsert({
      where: {
        key: permission.key
      },
      update: {
        description: permission.description,
        scope:
          permission.scope === PERMISSION_SCOPE.SYSTEM ? "SYSTEM" : "WORKSPACE"
      },
      create: {
        key: permission.key,
        description: permission.description,
        scope:
          permission.scope === PERMISSION_SCOPE.SYSTEM ? "SYSTEM" : "WORKSPACE"
      }
    });
  }
};

const seedSystemRoles = async () => {
  for (const roleName of Object.values(DEFAULT_SYSTEM_ROLE_NAMES)) {
    const role =
      (await prisma.role.findFirst({
        where: {
          workspaceId: null,
          name: roleName
        }
      })) ??
      (await prisma.role.create({
        data: {
          name: roleName,
          description: `System ${roleName} role`,
          isSystem: true,
          scope: "SYSTEM"
        }
      }));

    await prisma.role.update({
      where: {
        id: role.id
      },
      data: {
        description: `System ${roleName} role`,
        isSystem: true,
        scope: "SYSTEM"
      }
    });

    const permissionKeys = DEFAULT_SYSTEM_ROLE_PERMISSIONS[roleName];

    for (const permissionKey of permissionKeys) {
      const permission = await prisma.permission.findUnique({
        where: {
          key: permissionKey
        }
      });

      if (!permission) {
        throw new Error(`Permission not found: ${permissionKey}`);
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id
        }
      });
    }
  }
};

const seedWorkspaceRoles = async () => {
  for (const roleName of Object.values(DEFAULT_WORKSPACE_ROLE_NAMES)) {
    const existing = await prisma.role.findFirst({
      where: {
        workspaceId: null,
        name: roleName,
      },
    });

    if (existing) {
      const permissionKeys = DEFAULT_WORKSPACE_ROLE_PERMISSIONS[roleName];

      await prisma.role.update({
        where: {
          id: existing.id,
        },
        data: {
          description: `Workspace ${roleName} role`,
          isSystem: true,
          scope: "WORKSPACE",
        },
      });

      for (const permissionKey of permissionKeys) {
        const permission = await prisma.permission.findUnique({
          where: {
            key: permissionKey,
          },
        });

        if (!permission) {
          throw new Error(`Permission not found: ${permissionKey}`);
        }

        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: existing.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: existing.id,
            permissionId: permission.id,
          },
        });
      }

      continue;
    }

    const role = await prisma.role.create({
      data: {
        name: roleName,
        description: `Workspace ${roleName} role`,
        isSystem: true,
        scope: "WORKSPACE",
      },
    });

    const permissionKeys = DEFAULT_WORKSPACE_ROLE_PERMISSIONS[roleName];

    for (const permissionKey of permissionKeys) {
      const permission = await prisma.permission.findUnique({
        where: {
          key: permissionKey,
        },
      });

      if (!permission) {
        throw new Error(`Permission not found: ${permissionKey}`);
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
};

const main = async () => {
  await seedPermissions();
  await seedSystemRoles();
  await seedWorkspaceRoles();

  console.log("RBAC seed completed");
};

main()
  .catch((error) => {
    console.error("RBAC seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });