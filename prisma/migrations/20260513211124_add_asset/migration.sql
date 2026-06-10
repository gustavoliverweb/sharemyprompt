-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('PROMPT', 'FLUJO', 'AGENTE');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OutputFormat" AS ENUM ('JSON', 'MARKDOWN', 'TABLA', 'CODIGO');

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "AssetType" NOT NULL DEFAULT 'PROMPT',
    "status" "AssetStatus" NOT NULL DEFAULT 'DRAFT',
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "roleDefinition" TEXT,
    "contentScope" TEXT,
    "taskDefinition" TEXT,
    "outputFormat" "OutputFormat" NOT NULL DEFAULT 'JSON',
    "restrictions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "promptContent" TEXT,
    "recommendedModel" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_slug_key" ON "Asset"("slug");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
