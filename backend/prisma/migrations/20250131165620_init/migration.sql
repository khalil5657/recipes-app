/*
  Warnings:

  - You are about to drop the column `savedRecipes` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "userswhosaved" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "savedRecipes";
