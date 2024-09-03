/*
  Warnings:

  - Added the required column `pengajuan_hki` to the `Pengabdian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pengabdian" ADD COLUMN     "pengajuan_hki" BOOLEAN NOT NULL;
