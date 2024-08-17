import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const createDummyData = async () => {
  for (let i = 0; i < 500; i++) {
    const jenjang_terakhir = faker.helpers.arrayElement(['S2', 'S3']);
    const jabatan_akademik = faker.helpers.arrayElement(['Guru Besar', 'Lektor', 'Lektor Kepala']);
    const tahun_angkatan = faker.helpers.arrayElement([2019, 2020, 2021, 2022, 2023]);
    const nim = `${tahun_angkatan}${faker.number.int({ min: 10000, max: 99999 })}`;
    const status = tahun_angkatan <= 2020 
        ? faker.helpers.arrayElement(['Aktif', 'Tidak Aktif']) 
        : 'Aktif';

    // Pastikan data Mahasiswa sudah ada
    const mahasiswa = await prisma.mahasiswa.create({
      data: {
        nim: parseInt(nim),
        nama: faker.person.fullName(),
        tahun_angkatan,
        status,
      }
    });

    // Membuat data Dosen dan relasi yang terkait
    await prisma.dosen.create({
      data: {
        nama: faker.person.fullName(),
        nidn: faker.string.uuid(),
        jenjang_terakhir,
        bidang_keahlian: faker.person.jobArea(),
        jabatan_akademik,
        akademik: {
          create: [{
            nim: mahasiswa.nim,
            tahun_masuk: tahun_angkatan,
            status
          }]
        },
        skripsi: {
          create: [{
            nim: mahasiswa.nim,
            pembimbing: faker.number.int({ min: 1, max: 5 }),
            judul_skripsi: faker.lorem.sentence(),
            status: 'Selesai'
          }]
        },
        ujiSkripsi: {
          create: [{
            nim: mahasiswa.nim,
            penguji: faker.number.int({ min: 1, max: 5 }),
            judul_skripsi: faker.lorem.sentence(),
            status: 'Lulus'
          }]
        },
        kkn: faker.datatype.boolean() ? {
          create: [{
            nim: mahasiswa.nim,
            pembimbing: faker.number.int({ min: 1, max: 5 }),
            judul_kkn: faker.lorem.sentence(),
            lokasi: faker.location.city(),
            durasi: `${faker.number.int({ min: 1, max: 3 })} bulan`,
            status: 'Selesai'
          }]
        } : undefined,
        lomba: faker.datatype.boolean() ? {
          create: [{
            nim: mahasiswa.nim,
            pembimbing: faker.number.int({ min: 1, max: 5 }),
            nama_Lomba: faker.lorem.words(3),
            jenis_Lomba: 'Nasional',
            tingkat_lomba: 'Universitas',
            lembaga: faker.company.name(),
            tahun: faker.number.int({ min: 2019, max: 2023 }),
            juara: 'Juara 1'
          }]
        } : undefined,
        kurikulum: faker.datatype.boolean() ? {
          create: [{
            kode_matkul: faker.string.uuid(),
            semester: faker.number.int({ min: 1, max: 8 }),
            nama_matkul: faker.lorem.words(3),
            sks: faker.number.int({ min: 2, max: 4 }),
            metode_pembelajaran: faker.lorem.word()
          }]
        } : undefined,
        seminar: faker.datatype.boolean() ? {
          create: [{
            judul: faker.lorem.sentence(),
            peran: faker.person.jobTitle(),
            jenis_seminar: faker.lorem.word(),
            lokasi: faker.location.city(),
            tanggal: faker.date.past({ years: 2 }),
            status: faker.helpers.arrayElement(['Terdaftar', 'Selesai'])
          }]
        } : undefined,
        publikasi: faker.datatype.boolean() ? {
          create: [{
            judul: faker.lorem.sentence(),
            jenis_jurnal: faker.lorem.word(),
            penerbit: faker.company.name(),
            tahun: faker.number.int({ min: 2019, max: 2023 }),
            jumlah_sitasi: faker.number.int({ min: 0, max: 100 }),
            status: faker.helpers.arrayElement(['Terbit', 'Menunggu'])
          }]
        } : undefined,
        penelitian: faker.datatype.boolean() ? {
          create: [{
            judul_penelitian: faker.lorem.sentence(),
            tahun: faker.number.int({ min: 2019, max: 2023 }),
            sumber_dana: faker.company.name(),
            jumlah_dana: faker.number.int({ min: 1000000, max: 100000000 }),
            rekoginisi: faker.lorem.word(),
            penerapan: faker.datatype.boolean(),
            pengajuan_hki: faker.datatype.boolean(),
            produk: faker.commerce.productName()
          }]
        } : undefined,
        pengabdian: faker.datatype.boolean() ? {
          create: [{
            judul_pengabdian: faker.lorem.sentence(),
            lokasi: faker.location.city(),
            tahun: faker.number.int({ min: 2019, max: 2023 }),
            rekoginisi: faker.lorem.word(),
            penerapan: faker.datatype.boolean(),
            produk: faker.commerce.productName()
          }]
        } : undefined,
        kegiatanLuar: faker.datatype.boolean() ? {
          create: [{
            judul_kegiatan: faker.lorem.sentence(),
            jenis_kegiatan: faker.lorem.word(),
            lokasi: faker.location.city(),
            tanggal: faker.date.past({ years: 2 })
          }]
        } : undefined,
        penghargaan: faker.datatype.boolean() ? {
          create: [{
            nama_penghargaan: faker.lorem.words(2),
            jenis_penghargaan: faker.lorem.word(),
            lembaga: faker.company.name(),
            tahun: faker.number.int({ min: 2019, max: 2023 }),
            tanggal_penghargaan: faker.date.past({ years: 2 })
          }]
        } : undefined,
        sertifikat: faker.datatype.boolean() ? {
          create: [{
            nama_sertifikat: faker.lorem.words(2),
            jenis_sertifikat: faker.lorem.word(),
            lembaga: faker.company.name(),
            bidang_kompetensi: faker.person.jobType(),
            tanggal_terbit: faker.date.past({ years: 2 }),
            tanggal_kadaluarsa: faker.date.future({ years: 2 })
          }]
        } : undefined,
        buku: faker.datatype.boolean() ? {
          create: [{
            judul_buku: faker.lorem.words(3),
            jenis_buku: faker.lorem.word(),
            penerbit: faker.company.name(),
            tahun: faker.number.int({ min: 2019, max: 2023 }),
            status: faker.helpers.arrayElement(['Terbit', 'Menunggu'])
          }]
        } : undefined,
      },
    });

    console.log(`Created record ${i + 1}`);
  }
};

createDummyData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
