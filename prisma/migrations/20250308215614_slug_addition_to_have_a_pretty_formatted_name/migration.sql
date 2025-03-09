/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ModelProvider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ModelProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModelProvider" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ModelProvider_slug_key" ON "ModelProvider"("slug");
