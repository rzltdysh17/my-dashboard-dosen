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
const dummyDosen = async () => {
  for (let i = 0; i < 15; i++) {
    const jenjang_terakhir = faker.helpers.arrayElement(["S2", "S3"]);
    const jabatan_akademik = faker.helpers.arrayElement([
      "Guru Besar",
      "Lektor",
      "Lektor Kepala",
    ]);
    const nidn = await generateUniqueNIDN();
    await prisma.dosen.create({
      data: {
        nama: faker.person.fullName(),
        nidn,
        jenjang_terakhir,
        bidang_keahlian: faker.person.jobArea(),
        jabatan_akademik,
      },
    });
  }
};

const dummyMahasiswa = async () => {
  for (let i = 0; i < 50; i++) {
    const tahun_angkatan = faker.helpers.arrayElement([
      2019, 2020, 2021, 2022, 2023,
    ]);
    const status =
      tahun_angkatan <= 2020
        ? faker.helpers.arrayElement(["Aktif", "Tidak Aktif"])
        : "Aktif";
    const nim = `${tahun_angkatan}${faker.number.int({
      min: 10000,
      max: 99999,
    })}`;
    await prisma.mahasiswa.create({
      data: {
        nim: parseInt(nim),
        nama: faker.person.fullName(),
        tahun_angkatan,
        status,
      },
    });
  }
};

const dummyKKN = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length < 2) {
    throw new Error("Not enough Dosen found to create unique KKN entries");
  }

  let availableDosen = [...allDosen];

  const totalKKNEntries = Math.floor(availableDosen.length / 2); // Calculate how many unique pairs can be made

  for (let i = 0; i < totalKKNEntries; i++) {
    // Ensure there are at least two dosen left
    if (availableDosen.length < 2) {
      throw new Error(
        "Not enough Dosen left to create another unique KKN entry"
      );
    }

    // Randomly select the first dosen and remove it from the available list
    const randomIndex1 = faker.number.int({
      min: 0,
      max: availableDosen.length - 1,
    });
    const randomDosen1 = availableDosen.splice(randomIndex1, 1)[0];

    // Randomly select the second dosen and remove it from the available list
    const randomIndex2 = faker.number.int({
      min: 0,
      max: availableDosen.length - 1,
    });
    const randomDosen2 = availableDosen.splice(randomIndex2, 1)[0];

    await prisma.kKN.create({
      data: {
        lokasi: faker.location.city(),
        durasi: `${faker.number.int({ min: 1, max: 3 })} bulan`,
        status: faker.helpers.arrayElement(["Progress", "Selesai"]),
        judul_kkn: faker.lorem.sentence(),
        tahun: `${faker.number.int({ min: 2019, max: 2023 })}`,
        id_dosen1: randomDosen1.id,
        id_dosen2: randomDosen2.id,
      },
    });
  }
};

const dummyMahasiswaKKN = async () => {
  // Fetch all mahasiswa records
  const allMahasiswa = await prisma.mahasiswa.findMany({
    select: {
      nim: true,
    },
    where: {
      tahun_angkatan: {
        lte: 2020,
      },
    },
  });

  if (allMahasiswa.length === 0) {
    throw new Error("No Mahasiswa found");
  }

  // Fetch all KKN records
  const allKKN = await prisma.kKN.findMany({
    select: {
      id: true,
    },
  });

  if (allKKN.length === 0) {
    throw new Error("No KKN found");
  }

  // Shuffle mahasiswa list
  const shuffledMahasiswa = faker.helpers.shuffle(allMahasiswa);

  // Loop through all mahasiswa
  for (let i = 0; i < shuffledMahasiswa.length; i++) {
    const randomKKN = faker.helpers.arrayElement(allKKN);

    // Check if the mahasiswa is already assigned to a KKN
    const existingKKNMahasiswa = await prisma.kKNMahasiswa.findUnique({
      where: { id_mahasiswa: shuffledMahasiswa[i].nim },
    });

    // If the mahasiswa is not assigned to a KKN, create a new record
    if (!existingKKNMahasiswa) {
      await prisma.kKNMahasiswa.create({
        data: {
          id_kkn: randomKKN.id,
          id_mahasiswa: shuffledMahasiswa[i].nim,
        },
      });
    }
  }
};

const dummyBimbinganAkademik = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length === 0) {
    throw new Error("No Dosen found to create Bimbingan Akademik entries");
  }

  const allMahasiswa = await prisma.mahasiswa.findMany({
    select: {
      nim: true,
    },
  });

  if (allMahasiswa.length === 0) {
    throw new Error("No Mahasiswa found to create Bimbingan Akademik entries");
  }

  for (let i = 0; i < allMahasiswa.length; i++) {
    const randomDosen = faker.helpers.arrayElement(allDosen);
    const tahunMasuk = faker.helpers.arrayElement([
      2019, 2020, 2021, 2022, 2023,
    ]);
    const status = faker.helpers.arrayElement(["Progress", "Selesai"]);
    const existingRecord = await prisma.bimbinganAkademik.findUnique({
      where: { nim: allMahasiswa[i].nim },
    });

    if (!existingRecord) {
      if (status === "Selesai") {
        await prisma.bimbinganAkademik.create({
          data: {
            id_dosen: randomDosen.id,
            nim: allMahasiswa[i].nim,
            tahun_masuk: tahunMasuk,
            tahun_selesai: tahunMasuk + 1,
            status: "Selesai",
          },
        });
      } else {
        await prisma.bimbinganAkademik.create({
          data: {
            id_dosen: randomDosen.id,
            nim: allMahasiswa[i].nim,
            tahun_masuk: tahunMasuk,
            status: "Progress",
          },
        });
      }
    }
  }
};

const dummySkripsi = async () => {
  const allMahasiswa = await prisma.mahasiswa.findMany({
    select: {
      nim: true,
    },
    where: {
      tahun_angkatan: {
        lte: 2020,
      },
    },
  });

  if (allMahasiswa.length === 0) {
    throw new Error("No Mahasiswa found to create Skripsi entries");
  }

  for (let i = 0; i < allMahasiswa.length; i++) {
    const existingMahasiswa = await prisma.skripsi.findUnique({
      where: { nim: allMahasiswa[i].nim },
    });

    if (!existingMahasiswa) {
      await prisma.skripsi.create({
        data: {
          nim: allMahasiswa[i].nim,
          judul_skripsi: faker.lorem.sentence(),
          status: faker.helpers.arrayElement(["Progress", "Selesai"]),
        },
      });
    }
  }
};

const dummyPembimbingSkripsi = async () => {
  // Fetch all Skripsi records
  const allSkripsi = await prisma.skripsi.findMany({
    select: {
      id: true,
    },
  });

  if (allSkripsi.length === 0) {
    throw new Error("No Skripsi found to create Bimbingan Skripsi entries");
  }

  // Fetch all Dosen records
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length < 2) {
    throw new Error(
      "Not enough Dosen found to create unique Bimbingan Skripsi entries"
    );
  }

  for (let skripsi of allSkripsi) {
    // Shuffle the dosen list to ensure randomness
    const shuffledDosen = faker.helpers.shuffle(allDosen);

    // Select the first dosen as pembimbing 1
    const pembimbing1 = shuffledDosen[0];

    // Find the next available dosen that is not the same as pembimbing 1
    const pembimbing2 = shuffledDosen.find(
      (dosen) => dosen.id !== pembimbing1.id
    );

    if (!pembimbing2) {
      throw new Error("Not enough unique Dosen found for this Skripsi");
    }

    // Create BimbinganSkripsi entries for pembimbing 1
    await prisma.bimbinganSkripsi.create({
      data: {
        id_dosen: pembimbing1.id,
        id_skripsi: skripsi.id,
        pembimbing: 1, // Pembimbing 1
      },
    });

    // Create BimbinganSkripsi entries for pembimbing 2
    await prisma.bimbinganSkripsi.create({
      data: {
        id_dosen: pembimbing2.id,
        id_skripsi: skripsi.id,
        pembimbing: 2, // Pembimbing 2
      },
    });
  }
};

const dummyPengujiSkripsi = async () => {
  // Fetch all Skripsi records along with their associated BimbinganSkripsi data
  const allSkripsi = await prisma.skripsi.findMany({
    select: {
      id: true,
      bimbinganSkripsi: {
        select: {
          id_dosen: true,
          pembimbing: true,
        },
      },
    },
  });

  // Fetch all Dosen records
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allSkripsi.length === 0) {
    throw new Error("No Skripsi found to create Penguji Skripsi entries");
  }

  for (let skripsi of allSkripsi) {
    // Filter pembimbing1 and pembimbing2 for the current skripsi
    const pembimbing1 = skripsi.bimbinganSkripsi.find(
      (b) => b.pembimbing === 1
    )?.id_dosen;
    const pembimbing2 = skripsi.bimbinganSkripsi.find(
      (b) => b.pembimbing === 2
    )?.id_dosen;

    if (!pembimbing1 || !pembimbing2) {
      throw new Error(`Pembimbing not found for Skripsi ID ${skripsi.id}`);
    }

    // Select penguji1 as one of the pembimbing1 or pembimbing2
    const penguji1 = faker.helpers.arrayElement([pembimbing1, pembimbing2]);

    // Select penguji2 and penguji3 from dosen excluding pembimbing1 and pembimbing2
    const eligibleDosen = allDosen.filter(
      (d) => d.id !== pembimbing1 && d.id !== pembimbing2
    );
    const penguji2 = faker.helpers.arrayElement(eligibleDosen).id;
    let penguji3 = faker.helpers.arrayElement(eligibleDosen).id;

    // Ensure penguji2 and penguji3 are different
    while (penguji3 === penguji2) {
      penguji3 = faker.helpers.arrayElement(eligibleDosen).id;
    }

    // Create PengujiSkripsi entries
    await prisma.pengujiSkripsi.create({
      data: {
        id_skripsi: skripsi.id,
        id_dosen: penguji1,
        penguji: 1, // Penguji 1
      },
    });

    await prisma.pengujiSkripsi.create({
      data: {
        id_skripsi: skripsi.id,
        id_dosen: penguji2,
        penguji: 2, // Penguji 2
      },
    });

    await prisma.pengujiSkripsi.create({
      data: {
        id_skripsi: skripsi.id,
        id_dosen: penguji3,
        penguji: 3, // Penguji 3
      },
    });
  }   
};
const createDummy = async () => {
  await dummyDosen();
  await dummyMahasiswa();
  await dummyKKN();
  await dummyMahasiswaKKN();
  await dummyBimbinganAkademik();

  await dummySkripsi();
  await dummyPembimbingSkripsi();
  await dummyPengujiSkripsi();
};
// const createDummyData = async () => {
//   for (let i = 0; i < 500; i++) {
//     const jenjang_terakhir = faker.helpers.arrayElement(["S2", "S3"]);
//     const jabatan_akademik = faker.helpers.arrayElement([
//       "Guru Besar",
//       "Lektor",
//       "Lektor Kepala",
//     ]);
//     const tahun_angkatan = faker.helpers.arrayElement([
//       2019, 2020, 2021, 2022, 2023,
//     ]);
//     const nim = `${tahun_angkatan}${faker.number.int({
//       min: 10000,
//       max: 99999,
//     })}`;
//     const status =
//       tahun_angkatan <= 2020
//         ? faker.helpers.arrayElement(["Aktif", "Tidak Aktif"])
//         : "Aktif";

//     // Create Mahasiswa
//     const mahasiswa = await prisma.mahasiswa.create({
//       data: {
//         nim: parseInt(nim),
//         nama: faker.person.fullName(),
//         tahun_angkatan,
//         status,
//       },
//     });
//     const nidn = await generateUniqueNIDN();
//     // Create Dosen
//     const dosen = await prisma.dosen.create({
//       data: {
//         nama: faker.person.fullName(),
//         nidn,
//         jenjang_terakhir,
//         bidang_keahlian: faker.person.jobArea(),
//         jabatan_akademik,
//         akademik: {
//           create: [
//             {
//               nim: mahasiswa.nim,
//               tahun_masuk: tahun_angkatan,
//               status,
//             },
//           ],
//         },
//         skripsi: {
//           create: [
//             {
//               nim: mahasiswa.nim,
//               pembimbing: faker.number.int({ min: 1, max: 2 }),
//               judul_skripsi: faker.lorem.sentence(),
//               status: faker.helpers.arrayElement(["Progress", "Selesai"]),
//             },
//           ],
//         },
//       },
//     });

//     // Ensure unique Penguji for each Mahasiswa
//     const pengujiSkripsiData = [];
//     const pengujiIds = new Set<number>(); // Track assigned Penguji IDs

//     while (pengujiSkripsiData.length < 3) {
//       const pengujiDosen = await prisma.dosen.findFirst({
//         where: {
//           id: {
//             notIn: Array.from(pengujiIds),
//           },
//         },
//         orderBy: {
//           id: "asc", // Ensuring we get a unique Dosen
//         },
//       });

//       if (!pengujiDosen) break;

//       pengujiIds.add(pengujiDosen.id);

//       pengujiSkripsiData.push({
//         nim: mahasiswa.nim,
//         penguji: pengujiDosen.id,
//         judul_skripsi: faker.lorem.sentence(),
//         status: faker.helpers.arrayElement(["Dijadwalkan", "Selesai"]),
//       });

//       if (pengujiSkripsiData.length >= 3) break;
//     }

//     // Final creation with unique PengujiSkripsi
//     await prisma.dosen.update({
//       where: { id: dosen.id },
//       data: {
//         ujiSkripsi: {
//           create: pengujiSkripsiData,
//         },
//         // Continue with other related entities...
//         kkn: faker.datatype.boolean()
//           ? {
//               create: [
//                 {
//                   nim: mahasiswa.nim,
//                   pembimbing: faker.number.int({ min: 1, max: 2 }),
//                   judul_kkn: faker.lorem.sentence(),
//                   lokasi: faker.location.city(),
//                   durasi: `${faker.number.int({ min: 1, max: 3 })} bulan`,
//                   status: faker.helpers.arrayElement(["Progress", "Selesai"]),
//                 },
//               ],
//             }
//           : undefined,
//         lomba: faker.datatype.boolean()
//           ? {
//               create: [
//                 {
//                   nim: mahasiswa.nim,
//                   pembimbing: faker.number.int({ min: 1, max: 5 }),
//                   nama_Lomba: faker.lorem.words(3),
//                   jenis_Lomba: faker.helpers.arrayElement([
//                     "Non Akademik ",
//                     "Akademik",
//                   ]),
//                   tingkat_lomba: faker.helpers.arrayElement([
//                     "Nasional",
//                     "Internasional",
//                   ]),
//                   lembaga: faker.company.name(),
//                   tahun: faker.number.int({ min: 2019, max: 2023 }),
//                   juara: faker.helpers.arrayElement(["1", "2", "3"]),
//                 },
//               ],
//             }
//           : undefined,
//         seminar: faker.datatype.boolean()
//           ? {
//               create: [
//                 {
//                   judul: faker.lorem.sentence(),
//                   peran: faker.helpers.arrayElement(["Peserta", "Pemateri"]),
//                   jenis_seminar: faker.helpers.arrayElement([
//                     "Nasional",
//                     "Internasional",
//                   ]),
//                   lokasi: faker.location.city(),
//                   tanggal: faker.date.past({ years: 2 }),
//                   status: faker.helpers.arrayElement(["Progress", "Selesai"]),
//                 },
//               ],
//             }
//           : undefined,
//         publikasi: faker.datatype.boolean()
//           ? {
//               create: [
//                 {
//                   judul: faker.lorem.sentence(),
//                   jenis_jurnal: faker.helpers.arrayElement([
//                     "Terakreditasi",
//                     "Tidak Terakreditasi",
//                   ]),
//                   penerbit: faker.company.name(),
//                   tahun: faker.number.int({ min: 2019, max: 2023 }),
//                   jumlah_sitasi: faker.number.int({ min: 0, max: 100 }),
//                   status: faker.helpers.arrayElement(["Terbit", "Menunggu"]),
//                 },
//               ],
//             }
//           : undefined,
//         penelitian: faker.datatype.boolean()
//           ? {
//               create: [
//                 {
//                   judul_penelitian: faker.lorem.sentence(),
//                   tahun: faker.number.int({ min: 2019, max: 2023 }),
//                   sumber_dana: faker.company.name(),
//                   jumlah_dana: faker.number.int({
//                     min: 1000000,
//                     max: 100000000,
//                   }),
//                   rekoginisi: faker.lorem.word(),
//                   penerapan: faker.datatype.boolean(),
//                   pengajuan_hki: faker.datatype.boolean(),
//                   produk: faker.commerce.productName(),
//                 },
//               ],
//             }
//           : undefined,
//         pengabdian: faker.datatype.boolean()
//           ? {
//               create: [
//                 {
//                   judul_pengabdian: faker.lorem.sentence(),
//                   lokasi: faker.location.city(),
//                   tahun: faker.number.int({ min: 2019, max: 2023 }),
//                   rekoginisi: faker.lorem.word(),
//                   penerapan: faker.datatype.boolean(),
//                   produk: faker.commerce.productName(),
//                 },
//               ],
//             }
//           : undefined,
//         kegiatanLuar: faker.datatype.boolean()
//           ? {
//               create: [
//                 {
//                   judul_kegiatan: faker.lorem.sentence(),
//                   jenis_kegiatan: faker.lorem.word(),
//                   lokasi: faker.location.city(),
//                   tanggal: faker.date.past({ years: 2 }),
//                 },
//               ],
//             }
//           : undefined,
//         penghargaan: faker.datatype.boolean()
//           ? {
//               create: [
//                 {
//                   nama_penghargaan: faker.lorem.words(2),
//                   jenis_penghargaan: faker.lorem.word(),
//                   lembaga: faker.company.name(),
//                   tahun: faker.number.int({ min: 2019, max: 2023 }),
//                   tanggal_penghargaan: faker.date.past({ years: 2 }),
//                 },
//               ],
//             }
//           : undefined,
//         sertifikat: faker.datatype.boolean()
//           ? {
//               create: [
//                 {
//                   nama_sertifikat: faker.lorem.words(2),
//                   jenis_sertifikat: faker.lorem.word(),
//                   lembaga: faker.company.name(),
//                   bidang_kompetensi: faker.person.jobType(),
//                   tanggal_terbit: faker.date.past({ years: 2 }),
//                   tanggal_kadaluarsa: faker.date.future({ years: 2 }),
//                 },
//               ],
//             }
//           : undefined,
//         buku: faker.datatype.boolean()
//           ? {
//               create: [
//                 {
//                   judul_buku: faker.lorem.words(3),
//                   jenis_buku: faker.lorem.word(),
//                   penerbit: faker.company.name(),
//                   tahun: faker.number.int({ min: 2019, max: 2023 }),
//                   status: faker.helpers.arrayElement(["Terbit", "Menunggu"]),
//                 },
//               ],
//             }
//           : undefined,
//       },
//     });

//     console.log(`Created record ${i + 1}`);
//   }
// };

// createDummyData()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

createDummy()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
