import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { DEFAULT_ROLE_NAMES, DEFAULT_ROLE_PERMISSIONS } from "../src/shared/permissions/default-roles.js";
import { PERMISSION_LIST } from "../src/shared/permissions/permission.keys.js";

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
        description: permission.description
      },
      create: {
        key: permission.key,
        description: permission.description
      }
    });
  }
};

const seedSystemRoles = async () => {
  for (const roleName of Object.values(DEFAULT_ROLE_NAMES)) {
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
          isSystem: true
        }
      }));

    await prisma.role.update({
      where: {
        id: role.id
      },
      data: {
        description: `System ${roleName} role`,
        isSystem: true
      }
    });

    const permissionKeys = DEFAULT_ROLE_PERMISSIONS[roleName];

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

const main = async () => {
  await seedPermissions();
  await seedSystemRoles();

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