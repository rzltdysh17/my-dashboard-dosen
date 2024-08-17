import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const generateUniqueNIDN = async (): Promise<string> => {
  let nidn: string = ""; // Initialize nidn with an empty string
  let isUnique = false;

  while (!isUnique) {
    nidn = `${faker.number.int({ min: 10000, max: 99999 })}`;
    const existingDosen = await prisma.dosen.findUnique({ where: { nidn } });
    if (!existingDosen) {
      isUnique = true;
    }
  }

  return nidn;
};
const createDummyData = async () => {
  for (let i = 0; i < 500; i++) {
    const jenjang_terakhir = faker.helpers.arrayElement(["S2", "S3"]);
    const jabatan_akademik = faker.helpers.arrayElement([
      "Guru Besar",
      "Lektor",
      "Lektor Kepala",
    ]);
    const tahun_angkatan = faker.helpers.arrayElement([
      2019, 2020, 2021, 2022, 2023,
    ]);
    const nim = `${tahun_angkatan}${faker.number.int({
      min: 10000,
      max: 99999,
    })}`;
    const status =
      tahun_angkatan <= 2020
        ? faker.helpers.arrayElement(["Aktif", "Tidak Aktif"])
        : "Aktif";

    // Create Mahasiswa
    const mahasiswa = await prisma.mahasiswa.create({
      data: {
        nim: parseInt(nim),
        nama: faker.person.fullName(),
        tahun_angkatan,
        status,
      },
    });
    const nidn = await generateUniqueNIDN();
    // Create Dosen
    const dosen = await prisma.dosen.create({
      data: {
        nama: faker.person.fullName(),
        nidn,
        jenjang_terakhir,
        bidang_keahlian: faker.person.jobArea(),
        jabatan_akademik,
        akademik: {
          create: [
            {
              nim: mahasiswa.nim,
              tahun_masuk: tahun_angkatan,
              status,
            },
          ],
        },
        skripsi: {
          create: [
            {
              nim: mahasiswa.nim,
              pembimbing: faker.number.int({ min: 1, max: 2 }),
              judul_skripsi: faker.lorem.sentence(),
              status: faker.helpers.arrayElement(["Progress", "Selesai"]),
            },
          ],
        },
      },
    });

    // Ensure unique Penguji for each Mahasiswa
    const pengujiSkripsiData = [];
    const pengujiIds = new Set<number>(); // Track assigned Penguji IDs

    while (pengujiSkripsiData.length < 3) {
      const pengujiDosen = await prisma.dosen.findFirst({
        where: {
          id: {
            notIn: Array.from(pengujiIds),
          },
        },
        orderBy: {
          id: "asc", // Ensuring we get a unique Dosen
        },
      });

      if (!pengujiDosen) break;

      pengujiIds.add(pengujiDosen.id);

      pengujiSkripsiData.push({
        nim: mahasiswa.nim,
        penguji: pengujiDosen.id,
        judul_skripsi: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(["Dijadwalkan", "Selesai"]),
      });

      if (pengujiSkripsiData.length >= 3) break;
    }

    // Final creation with unique PengujiSkripsi
    await prisma.dosen.update({
      where: { id: dosen.id },
      data: {
        ujiSkripsi: {
          create: pengujiSkripsiData,
        },
        // Continue with other related entities...
        kkn: faker.datatype.boolean()
          ? {
              create: [
                {
                  nim: mahasiswa.nim,
                  pembimbing: faker.number.int({ min: 1, max: 2 }),
                  judul_kkn: faker.lorem.sentence(),
                  lokasi: faker.location.city(),
                  durasi: `${faker.number.int({ min: 1, max: 3 })} bulan`,
                  status: faker.helpers.arrayElement(["Progress", "Selesai"]),
                },
              ],
            }
          : undefined,
        lomba: faker.datatype.boolean()
          ? {
              create: [
                {
                  nim: mahasiswa.nim,
                  pembimbing: faker.number.int({ min: 1, max: 5 }),
                  nama_Lomba: faker.lorem.words(3),
                  jenis_Lomba: faker.helpers.arrayElement([
                    "Non Akademik ",
                    "Akademik",
                  ]),
                  tingkat_lomba: faker.helpers.arrayElement([
                    "Nasional",
                    "Internasional",
                  ]),
                  lembaga: faker.company.name(),
                  tahun: faker.number.int({ min: 2019, max: 2023 }),
                  juara: faker.helpers.arrayElement(["1", "2", "3"]),
                },
              ],
            }
          : undefined,
        seminar: faker.datatype.boolean()
          ? {
              create: [
                {
                  judul: faker.lorem.sentence(),
                  peran: faker.helpers.arrayElement(["Peserta", "Pemateri"]),
                  jenis_seminar: faker.helpers.arrayElement([
                    "Nasional",
                    "Internasional",
                  ]),
                  lokasi: faker.location.city(),
                  tanggal: faker.date.past({ years: 2 }),
                  status: faker.helpers.arrayElement(["Progress", "Selesai"]),
                },
              ],
            }
          : undefined,
        publikasi: faker.datatype.boolean()
          ? {
              create: [
                {
                  judul: faker.lorem.sentence(),
                  jenis_jurnal: faker.helpers.arrayElement([
                    "Terakreditasi",
                    "Tidak Terakreditasi",
                  ]),
                  penerbit: faker.company.name(),
                  tahun: faker.number.int({ min: 2019, max: 2023 }),
                  jumlah_sitasi: faker.number.int({ min: 0, max: 100 }),
                  status: faker.helpers.arrayElement(["Terbit", "Menunggu"]),
                },
              ],
            }
          : undefined,
        penelitian: faker.datatype.boolean()
          ? {
              create: [
                {
                  judul_penelitian: faker.lorem.sentence(),
                  tahun: faker.number.int({ min: 2019, max: 2023 }),
                  sumber_dana: faker.company.name(),
                  jumlah_dana: faker.number.int({
                    min: 1000000,
                    max: 100000000,
                  }),
                  rekoginisi: faker.lorem.word(),
                  penerapan: faker.datatype.boolean(),
                  pengajuan_hki: faker.datatype.boolean(),
                  produk: faker.commerce.productName(),
                },
              ],
            }
          : undefined,
        pengabdian: faker.datatype.boolean()
          ? {
              create: [
                {
                  judul_pengabdian: faker.lorem.sentence(),
                  lokasi: faker.location.city(),
                  tahun: faker.number.int({ min: 2019, max: 2023 }),
                  rekoginisi: faker.lorem.word(),
                  penerapan: faker.datatype.boolean(),
                  produk: faker.commerce.productName(),
                },
              ],
            }
          : undefined,
        kegiatanLuar: faker.datatype.boolean()
          ? {
              create: [
                {
                  judul_kegiatan: faker.lorem.sentence(),
                  jenis_kegiatan: faker.lorem.word(),
                  lokasi: faker.location.city(),
                  tanggal: faker.date.past({ years: 2 }),
                },
              ],
            }
          : undefined,
        penghargaan: faker.datatype.boolean()
          ? {
              create: [
                {
                  nama_penghargaan: faker.lorem.words(2),
                  jenis_penghargaan: faker.lorem.word(),
                  lembaga: faker.company.name(),
                  tahun: faker.number.int({ min: 2019, max: 2023 }),
                  tanggal_penghargaan: faker.date.past({ years: 2 }),
                },
              ],
            }
          : undefined,
        sertifikat: faker.datatype.boolean()
          ? {
              create: [
                {
                  nama_sertifikat: faker.lorem.words(2),
                  jenis_sertifikat: faker.lorem.word(),
                  lembaga: faker.company.name(),
                  bidang_kompetensi: faker.person.jobType(),
                  tanggal_terbit: faker.date.past({ years: 2 }),
                  tanggal_kadaluarsa: faker.date.future({ years: 2 }),
                },
              ],
            }
          : undefined,
        buku: faker.datatype.boolean()
          ? {
              create: [
                {
                  judul_buku: faker.lorem.words(3),
                  jenis_buku: faker.lorem.word(),
                  penerbit: faker.company.name(),
                  tahun: faker.number.int({ min: 2019, max: 2023 }),
                  status: faker.helpers.arrayElement(["Terbit", "Menunggu"]),
                },
              ],
            }
          : undefined,
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
