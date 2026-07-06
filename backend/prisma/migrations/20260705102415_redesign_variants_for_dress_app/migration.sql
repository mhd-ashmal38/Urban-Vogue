/*
  Warnings:

  - You are about to drop the column `colors` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sizes` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `ProductVariant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,color]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sizeStock` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Made the column `color` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "ProductVariant_productId_size_color_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "colors",
DROP COLUMN "images",
DROP COLUMN "sizes",
DROP COLUMN "stock";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "size",
DROP COLUMN "stock",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "sizeStock" JSONB NOT NULL,
ALTER COLUMN "color" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_color_key" ON "ProductVariant"("productId", "color");
