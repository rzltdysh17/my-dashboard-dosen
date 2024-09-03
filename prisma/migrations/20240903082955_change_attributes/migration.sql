/*
  Warnings:

  - You are about to drop the `KKNMahasiswa` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `produk` on the `Penelitian` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `produk` on the `Pengabdian` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "KKNMahasiswa" DROP CONSTRAINT "KKNMahasiswa_id_kkn_fkey";

-- DropForeignKey
ALTER TABLE "KKNMahasiswa" DROP CONSTRAINT "KKNMahasiswa_id_mahasiswa_fkey";

-- AlterTable
ALTER TABLE "Penelitian" DROP COLUMN "produk",
ADD COLUMN     "produk" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Pengabdian" DROP COLUMN "produk",
ADD COLUMN     "produk" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "KKNMahasiswa";

-- CreateTable
CREATE TABLE "PesertaKKN" (
    "id" SERIAL NOT NULL,
    "id_mahasiswa" INTEGER NOT NULL,
    "id_kkn" INTEGER NOT NULL,

    CONSTRAINT "PesertaKKN_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PesertaKKN_id_mahasiswa_key" ON "PesertaKKN"("id_mahasiswa");

-- AddForeignKey
ALTER TABLE "PesertaKKN" ADD CONSTRAINT "PesertaKKN_id_mahasiswa_fkey" FOREIGN KEY ("id_mahasiswa") REFERENCES "Mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesertaKKN" ADD CONSTRAINT "PesertaKKN_id_kkn_fkey" FOREIGN KEY ("id_kkn") REFERENCES "KKN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
