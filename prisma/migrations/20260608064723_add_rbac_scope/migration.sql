-- CreateEnum
CREATE TYPE "PermissionScope" AS ENUM ('SYSTEM', 'WORKSPACE');

-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('SYSTEM', 'WORKSPACE');

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "scope" "PermissionScope" NOT NULL DEFAULT 'WORKSPACE';

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "scope" "RoleScope" NOT NULL DEFAULT 'WORKSPACE';
