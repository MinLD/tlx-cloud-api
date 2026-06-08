/*
  Warnings:

  - You are about to drop the column `roleId` on the `workspace_members` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "workspace_members" DROP CONSTRAINT "workspace_members_roleId_fkey";

-- AlterTable
ALTER TABLE "workspace_members" DROP COLUMN "roleId";

-- CreateTable
CREATE TABLE "workspace_member_roles" (
    "id" UUID NOT NULL,
    "workspaceMemberId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_member_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspace_member_roles_workspaceMemberId_roleId_key" ON "workspace_member_roles"("workspaceMemberId", "roleId");

-- AddForeignKey
ALTER TABLE "workspace_member_roles" ADD CONSTRAINT "workspace_member_roles_workspaceMemberId_fkey" FOREIGN KEY ("workspaceMemberId") REFERENCES "workspace_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_member_roles" ADD CONSTRAINT "workspace_member_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
