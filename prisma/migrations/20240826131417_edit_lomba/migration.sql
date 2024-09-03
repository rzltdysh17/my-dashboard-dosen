/*
  Warnings:

  - You are about to drop the column `jenis_Lomba` on the `Lomba` table. All the data in the column will be lost.
  - You are about to drop the column `juara` on the `Lomba` table. All the data in the column will be lost.
  - You are about to drop the column `nama_Lomba` on the `Lomba` table. All the data in the column will be lost.
  - You are about to drop the column `nim` on the `Lomba` table. All the data in the column will be lost.
  - Added the required column `jenis_lomba` to the `Lomba` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_lomba` to the `Lomba` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lomba" DROP CONSTRAINT "Lomba_nim_fkey";

-- AlterTable
ALTER TABLE "Lomba" DROP COLUMN "jenis_Lomba",
DROP COLUMN "juara",
DROP COLUMN "nama_Lomba",
DROP COLUMN "nim",
ADD COLUMN     "jenis_lomba" TEXT NOT NULL,
ADD COLUMN     "nama_lomba" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PesertaLomba" (
    "id" SERIAL NOT NULL,
    "id_lomba" INTEGER NOT NULL,
    "nim" INTEGER NOT NULL,
    "juara" TEXT NOT NULL,

    CONSTRAINT "PesertaLomba_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PesertaLomba" ADD CONSTRAINT "PesertaLomba_id_lomba_fkey" FOREIGN KEY ("id_lomba") REFERENCES "Lomba"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesertaLomba" ADD CONSTRAINT "PesertaLomba_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;
