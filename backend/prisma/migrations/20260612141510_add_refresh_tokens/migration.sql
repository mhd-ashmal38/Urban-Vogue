-- AlterTable
ALTER TABLE "User" ADD COLUMN "refreshToken" TEXT,
ADD COLUMN "refreshTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshToken_key" ON "User"("refreshToken");
