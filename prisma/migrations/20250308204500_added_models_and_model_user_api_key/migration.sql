/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "ModelProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelProviderUserKey" (
    "id" TEXT NOT NULL,
    "modelProviderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apiKey" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelProviderUserKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ModelProvider_name_idx" ON "ModelProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ModelProviderUserKey_modelProviderId_userId_key" ON "ModelProviderUserKey"("modelProviderId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ModelProviderUserKey" ADD CONSTRAINT "ModelProviderUserKey_modelProviderId_fkey" FOREIGN KEY ("modelProviderId") REFERENCES "ModelProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelProviderUserKey" ADD CONSTRAINT "ModelProviderUserKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
