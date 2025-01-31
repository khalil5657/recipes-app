/*
  Warnings:

  - Added the required column `category` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `nutvalue` on the `Recipe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "category" TEXT NOT NULL,
DROP COLUMN "nutvalue",
ADD COLUMN     "nutvalue" INTEGER NOT NULL;
