/*
  Warnings:

  - A unique constraint covering the columns `[nim]` on the table `Skripsi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Skripsi_nim_key" ON "Skripsi"("nim");
