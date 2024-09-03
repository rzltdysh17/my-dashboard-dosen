/*
  Warnings:

  - You are about to drop the column `id_dosen` on the `Seminar` table. All the data in the column will be lost.
  - You are about to drop the column `peran` on the `Seminar` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Seminar" DROP CONSTRAINT "Seminar_id_dosen_fkey";

-- AlterTable
ALTER TABLE "Seminar" DROP COLUMN "id_dosen",
DROP COLUMN "peran";

-- CreateTable
CREATE TABLE "PesertaSeminar" (
    "id" SERIAL NOT NULL,
    "id_seminar" INTEGER NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "peran" TEXT NOT NULL,

    CONSTRAINT "PesertaSeminar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PesertaSeminar" ADD CONSTRAINT "PesertaSeminar_id_seminar_fkey" FOREIGN KEY ("id_seminar") REFERENCES "Seminar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesertaSeminar" ADD CONSTRAINT "PesertaSeminar_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
