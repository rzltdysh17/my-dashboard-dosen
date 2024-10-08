-- CreateTable
CREATE TABLE "Dosen" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nidn" TEXT NOT NULL,
    "jenjang_terakhir" TEXT NOT NULL,
    "bidang_keahlian" TEXT NOT NULL,
    "jabatan_akademik" TEXT NOT NULL,

    CONSTRAINT "Dosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mahasiswa" (
    "nim" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "tahun_angkatan" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Mahasiswa_pkey" PRIMARY KEY ("nim")
);

-- CreateTable
CREATE TABLE "BimbinganAkademik" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "nim" INTEGER NOT NULL,
    "tahun_masuk" INTEGER NOT NULL,
    "tahun_selesai" INTEGER,
    "status" TEXT NOT NULL,

    CONSTRAINT "BimbinganAkademik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skripsi" (
    "id" SERIAL NOT NULL,
    "nim" INTEGER NOT NULL,
    "judul_skripsi" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Skripsi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BimbinganSkripsi" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "id_skripsi" INTEGER NOT NULL,
    "pembimbing" INTEGER NOT NULL,

    CONSTRAINT "BimbinganSkripsi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengujiSkripsi" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "id_skripsi" INTEGER NOT NULL,
    "penguji" INTEGER NOT NULL,

    CONSTRAINT "PengujiSkripsi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KKN" (
    "id" SERIAL NOT NULL,
    "id_dosen1" INTEGER NOT NULL,
    "id_dosen2" INTEGER NOT NULL,
    "judul_kkn" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "durasi" TEXT NOT NULL,
    "tahun" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "KKN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KKNMahasiswa" (
    "id" SERIAL NOT NULL,
    "id_mahasiswa" INTEGER NOT NULL,
    "id_kkn" INTEGER NOT NULL,

    CONSTRAINT "KKNMahasiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lomba" (
    "id" SERIAL NOT NULL,
    "nim" INTEGER NOT NULL,
    "nama_Lomba" TEXT NOT NULL,
    "jenis_Lomba" TEXT NOT NULL,
    "tingkat_lomba" TEXT NOT NULL,
    "lembaga" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "juara" TEXT NOT NULL,

    CONSTRAINT "Lomba_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BimbinganLomba" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "id_lomba" INTEGER NOT NULL,
    "pembimbing" INTEGER NOT NULL,

    CONSTRAINT "BimbinganLomba_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kurikulum" (
    "kode_matkul" TEXT NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "nama_matkul" TEXT NOT NULL,
    "sks" INTEGER NOT NULL,
    "metode_pembelajaran" TEXT NOT NULL,

    CONSTRAINT "Kurikulum_pkey" PRIMARY KEY ("kode_matkul")
);

-- CreateTable
CREATE TABLE "Seminar" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "peran" TEXT NOT NULL,
    "jenis_seminar" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Seminar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublikasiJurnal" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "jenis_jurnal" TEXT NOT NULL,
    "penerbit" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "jumlah_sitasi" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "PublikasiJurnal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penelitian" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "judul_penelitian" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "sumber_dana" TEXT NOT NULL,
    "jumlah_dana" INTEGER NOT NULL,
    "rekoginisi" TEXT NOT NULL,
    "penerapan" BOOLEAN NOT NULL,
    "pengajuan_hki" BOOLEAN NOT NULL,
    "produk" TEXT NOT NULL,

    CONSTRAINT "Penelitian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengabdian" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "judul_pengabdian" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "rekoginisi" TEXT NOT NULL,
    "penerapan" BOOLEAN NOT NULL,
    "produk" TEXT NOT NULL,

    CONSTRAINT "Pengabdian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KegiatanLuar" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "judul_kegiatan" TEXT NOT NULL,
    "jenis_kegiatan" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KegiatanLuar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penghargaan" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "nama_penghargaan" TEXT NOT NULL,
    "jenis_penghargaan" TEXT NOT NULL,
    "lembaga" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "tanggal_penghargaan" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penghargaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sertifikat" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "nama_sertifikat" TEXT NOT NULL,
    "jenis_sertifikat" TEXT NOT NULL,
    "lembaga" TEXT NOT NULL,
    "bidang_kompetensi" TEXT NOT NULL,
    "tanggal_terbit" TIMESTAMP(3) NOT NULL,
    "tanggal_kadaluarsa" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sertifikat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BukuBahanAjar" (
    "id" SERIAL NOT NULL,
    "id_dosen" INTEGER NOT NULL,
    "judul_buku" TEXT NOT NULL,
    "jenis_buku" TEXT NOT NULL,
    "penerbit" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "BukuBahanAjar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dosen_nidn_key" ON "Dosen"("nidn");

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_nim_key" ON "Mahasiswa"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "BimbinganAkademik_nim_key" ON "BimbinganAkademik"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "KKN_id_dosen1_id_dosen2_key" ON "KKN"("id_dosen1", "id_dosen2");

-- CreateIndex
CREATE UNIQUE INDEX "KKNMahasiswa_id_mahasiswa_key" ON "KKNMahasiswa"("id_mahasiswa");

-- CreateIndex
CREATE UNIQUE INDEX "Kurikulum_kode_matkul_key" ON "Kurikulum"("kode_matkul");

-- AddForeignKey
ALTER TABLE "BimbinganAkademik" ADD CONSTRAINT "BimbinganAkademik_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BimbinganAkademik" ADD CONSTRAINT "BimbinganAkademik_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skripsi" ADD CONSTRAINT "Skripsi_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BimbinganSkripsi" ADD CONSTRAINT "BimbinganSkripsi_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BimbinganSkripsi" ADD CONSTRAINT "BimbinganSkripsi_id_skripsi_fkey" FOREIGN KEY ("id_skripsi") REFERENCES "Skripsi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengujiSkripsi" ADD CONSTRAINT "PengujiSkripsi_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengujiSkripsi" ADD CONSTRAINT "PengujiSkripsi_id_skripsi_fkey" FOREIGN KEY ("id_skripsi") REFERENCES "Skripsi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KKN" ADD CONSTRAINT "KKN_id_dosen1_fkey" FOREIGN KEY ("id_dosen1") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KKN" ADD CONSTRAINT "KKN_id_dosen2_fkey" FOREIGN KEY ("id_dosen2") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KKNMahasiswa" ADD CONSTRAINT "KKNMahasiswa_id_mahasiswa_fkey" FOREIGN KEY ("id_mahasiswa") REFERENCES "Mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KKNMahasiswa" ADD CONSTRAINT "KKNMahasiswa_id_kkn_fkey" FOREIGN KEY ("id_kkn") REFERENCES "KKN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lomba" ADD CONSTRAINT "Lomba_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BimbinganLomba" ADD CONSTRAINT "BimbinganLomba_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BimbinganLomba" ADD CONSTRAINT "BimbinganLomba_id_lomba_fkey" FOREIGN KEY ("id_lomba") REFERENCES "Lomba"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kurikulum" ADD CONSTRAINT "Kurikulum_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seminar" ADD CONSTRAINT "Seminar_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublikasiJurnal" ADD CONSTRAINT "PublikasiJurnal_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penelitian" ADD CONSTRAINT "Penelitian_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengabdian" ADD CONSTRAINT "Pengabdian_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KegiatanLuar" ADD CONSTRAINT "KegiatanLuar_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penghargaan" ADD CONSTRAINT "Penghargaan_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sertifikat" ADD CONSTRAINT "Sertifikat_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BukuBahanAjar" ADD CONSTRAINT "BukuBahanAjar_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
