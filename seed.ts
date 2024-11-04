import { PrismaClient } from "@prisma/client";
import { Faker, fakerID_ID, } from "@faker-js/faker";


const prisma = new PrismaClient();
const generateUniqueNIDN = async (): Promise<string> => {
  let nidn: string = ""; // Initialize nidn with an empty string
  let isUnique = false;

  while (!isUnique) {
    nidn = `${fakerID_ID.number.int({ min: 10000, max: 99999 })}`;
    const existingDosen = await prisma.dosen.findUnique({ where: { nidn } });
    if (!existingDosen) {
      isUnique = true;
    }
  }

  return nidn;
};

const generateUniqueKodeMatkul = async (): Promise<string> => {
  // Fetch the highest existing kodeMatkul
  const lastMatkul = await prisma.kurikulum.findMany({
    orderBy: {
      kode_matkul: "desc",
    },
    take: 1,
    select: {
      kode_matkul: true,
    },
  });

  let nextNumber = 1;

  if (lastMatkul.length > 0) {
    // Extract the numeric part and increment it
    const lastKode = lastMatkul[0].kode_matkul;
    const numericPart = parseInt(lastKode.replace(/\D/g, ""), 10);
    nextNumber = numericPart + 1;
  }

  // Generate the next kodeMatkul with the format MKXXX (e.g., MK001, MK002)
  const kodeMatkul = `IK${nextNumber.toString().padStart(3, "0")}`;

  return kodeMatkul;
};
const dummyDosen = async () => {
  for (let i = 0; i < 15; i++) {
    const jenjang_terakhir = fakerID_ID.helpers.arrayElement(["S2", "S3"]);
    const jabatan_akademik = fakerID_ID.helpers.arrayElement([
      "Guru Besar",
      "Lektor",
      "Lektor Kepala",
    ]);
    const nidn = await generateUniqueNIDN();
    await prisma.dosen.create({
      data: {
        nama: fakerID_ID.person.fullName(),
        nidn,
        jenjang_terakhir,
        bidang_keahlian: fakerID_ID.person.jobArea(),
        jabatan_akademik,
      },
    });
  }
};

const dummyMahasiswa = async () => {
  for (let i = 0; i < 50; i++) {
    const tahun_angkatan = fakerID_ID.helpers.arrayElement([
      2019, 2020, 2021, 2022, 2023,
    ]);
    const status =
      tahun_angkatan <= 2020
        ? fakerID_ID.helpers.arrayElement(["Aktif", "Tidak Aktif"])
        : "Aktif";
    const nim = `${tahun_angkatan}${fakerID_ID.number.int({
      min: 10000,
      max: 99999,
    })}`;
    await prisma.mahasiswa.create({
      data: {
        nim: parseInt(nim),
        nama: fakerID_ID.person.fullName(),
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
    const randomIndex1 = fakerID_ID.number.int({
      min: 0,
      max: availableDosen.length - 1,
    });
    const randomDosen1 = availableDosen.splice(randomIndex1, 1)[0];

    // Randomly select the second dosen and remove it from the available list
    const randomIndex2 = fakerID_ID.number.int({
      min: 0,
      max: availableDosen.length - 1,
    });
    const randomDosen2 = availableDosen.splice(randomIndex2, 1)[0];

    await prisma.kKN.create({
      data: {
        lokasi: fakerID_ID.location.city(),
        durasi: `${fakerID_ID.number.int({ min: 1, max: 3 })} bulan`,
        status: fakerID_ID.helpers.arrayElement(["Progress", "Selesai"]),
        judul_kkn: fakerID_ID.lorem.sentence(),
        tahun: `${fakerID_ID.number.int({ min: 2019, max: 2023 })}`,
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
  const shuffledMahasiswa = fakerID_ID.helpers.shuffle(allMahasiswa);

  // Loop through all mahasiswa
  for (let i = 0; i < shuffledMahasiswa.length; i++) {
    const randomKKN = fakerID_ID.helpers.arrayElement(allKKN);

    // Check if the mahasiswa is already assigned to a KKN
    const existingKKNMahasiswa = await prisma.pesertaKKN.findUnique({
      where: { id_mahasiswa: shuffledMahasiswa[i].nim },
    });

    // If the mahasiswa is not assigned to a KKN, create a new record
    if (!existingKKNMahasiswa) {
      await prisma.pesertaKKN.create({
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
      tahun_angkatan: true,
    },
  });

  if (allMahasiswa.length === 0) {
    throw new Error("No Mahasiswa found to create Bimbingan Akademik entries");
  }

  // Object to store 4 Dosen per tahun angkatan, retained for all years
  const dosenPerAngkatan: { [key: number]: number[] } = {};
  let assignedDosen = fakerID_ID.helpers
    .arrayElements(allDosen, 4)
    .map((dosen) => dosen.id);

  // Use the same 4 Dosen for each tahun angkatan
  for (const tahunMasuk of [2019, 2020, 2021, 2022, 2023]) {
    dosenPerAngkatan[tahunMasuk] = assignedDosen;
  }

  // Assign Bimbingan to each Mahasiswa
  for (const mahasiswa of allMahasiswa) {
    const { nim, tahun_angkatan } = mahasiswa;
    const randomDosen = fakerID_ID.helpers.arrayElement(
      dosenPerAngkatan[tahun_angkatan]
    );
    let status = "Aktif";
    if (tahun_angkatan <= 2020) {
      status = fakerID_ID.helpers.arrayElement(["Aktif", "Tidak Aktif"]);
    }

    const existingRecord = await prisma.bimbinganAkademik.findUnique({
      where: { nim: nim },
    });

    if (!existingRecord) {
      let tahunSelesai = null;
      if (status === "Tidak Aktif") {
        tahunSelesai = tahun_angkatan + (tahun_angkatan === 2019 || 2020 ? 5 : 4);
      }

      await prisma.bimbinganAkademik.create({
        data: {
          id_dosen: randomDosen,
          nim: nim,
          tahun_masuk: tahun_angkatan,
          tahun_selesai: tahunSelesai,
          status: status,
        },
      });
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
          judul_skripsi: fakerID_ID.lorem.sentence(),
          status: fakerID_ID.helpers.arrayElement(["Progress", "Selesai"]),
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
    const shuffledDosen = fakerID_ID.helpers.shuffle(allDosen);

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
    const penguji1 = fakerID_ID.helpers.arrayElement([pembimbing1, pembimbing2]);

    // Select penguji2 and penguji3 from dosen excluding pembimbing1 and pembimbing2
    const eligibleDosen = allDosen.filter(
      (d) => d.id !== pembimbing1 && d.id !== pembimbing2
    );
    const penguji2 = fakerID_ID.helpers.arrayElement(eligibleDosen).id;
    let penguji3 = fakerID_ID.helpers.arrayElement(eligibleDosen).id;

    // Ensure penguji2 and penguji3 are different
    while (penguji3 === penguji2) {
      penguji3 = fakerID_ID.helpers.arrayElement(eligibleDosen).id;
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

const dummyLomba = async () => {
  for (let i = 0; i < 20; i++) {
    await prisma.lomba.create({
      data: {
        nama_lomba: fakerID_ID.lorem.words(3),
        jenis_lomba: fakerID_ID.helpers.arrayElement(["Non Akademik", "Akademik"]),
        tingkat_lomba: fakerID_ID.helpers.arrayElement([
          "Nasional",
          "Internasional",
        ]),
        lembaga: fakerID_ID.company.name(),
        tahun: fakerID_ID.number.int({ min: 2019, max: 2023 }),
      },
    });
  }
};

const dummyPesertaLomba = async () => {
  // Fetch all Mahasiswa records
  const allMahasiswa = await prisma.mahasiswa.findMany({
    select: {
      nim: true,
    },
  });

  if (allMahasiswa.length === 0) {
    throw new Error("No Mahasiswa found to create Peserta Lomba entries");
  }

  // Fetch all Lomba records
  const allLomba = await prisma.lomba.findMany({
    select: {
      id: true,
    },
  });

  if (allLomba.length === 0) {
    throw new Error("No Lomba found to create Peserta Lomba entries");
  }

  // Iterate over each Lomba
  for (const lomba of allLomba) {
    // Shuffle the Mahasiswa list to ensure random selection
    const shuffledMahasiswa = fakerID_ID.helpers.shuffle(allMahasiswa);

    // Limit the number of participants to the number of available juara (1, 2, 3)
    const maxParticipants = Math.min(3, shuffledMahasiswa.length);

    // Juara options that haven't been assigned yet
    const availableJuara = ["1", "2", "3"];

    // Track the Mahasiswa that have already been added to this Lomba
    const addedMahasiswa = new Set<number>();

    // Create PesertaLomba entries for this Lomba
    for (let i = 0; i < maxParticipants; i++) {
      const randomMahasiswa = shuffledMahasiswa[i];

      // Ensure the same Mahasiswa is not added twice to the same Lomba
      if (
        !addedMahasiswa.has(randomMahasiswa.nim) &&
        availableJuara.length > 0
      ) {
        // Assign the next available juara
        const juara = availableJuara.shift(); // Remove the first juara from the list

        // Create the PesertaLomba entry
        await prisma.pesertaLomba.create({
          data: {
            nim: randomMahasiswa.nim,
            id_lomba: lomba.id,
            juara: juara!,
          },
        });

        // Track the Mahasiswa that has been added
        addedMahasiswa.add(randomMahasiswa.nim);
      }
    }
  }
};

const dummyBimbinganLomba = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length === 0) {
    throw new Error("No Dosen found to create Bimbingan Lomba entries");
  }

  const allLomba = await prisma.lomba.findMany({
    select: {
      id: true,
    },
  });

  if (allLomba.length === 0) {
    throw new Error("No Lomba found to create Bimbingan Lomba entries");
  }

  for (let i = 0; i < allLomba.length; i++) {
    const shuffledDosen = fakerID_ID.helpers.shuffle(allDosen);
    const existDosen = await prisma.bimbinganLomba.findFirst({
      where: {
        id_lomba: allLomba[i].id,
        id_dosen: shuffledDosen[0].id,
      },
    });

    if (!existDosen) {
      await prisma.bimbinganLomba.create({
        data: {
          id_lomba: allLomba[i].id,
          id_dosen: shuffledDosen[0].id,
          pembimbing: 1,
        },
      });
    }
  }
};

const dummySeminar = async () => {
  for (let i = 0; i < fakerID_ID.number.int({ min: 5, max: 20 }); i++) {
    const seminarDate = fakerID_ID.date.past({ years: 2 });

    // Determine the status based on the seminar date
    const seminarStatus = seminarDate < new Date() ? "Selesai" : "Dijadwalkan";

    await prisma.seminar.create({
      data: {
        judul: fakerID_ID.lorem.sentence(),
        jenis_seminar: fakerID_ID.helpers.arrayElement([
          "Nasional",
          "Internasional",
        ]),
        lokasi: fakerID_ID.location.city(),
        status: seminarStatus,
        tanggal: seminarDate,
      },
    });
  }
};

const dummyPesertaSeminar = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length === 0) {
    throw new Error("No Dosen found to create Peserta Seminar entries");
  }

  const allSeminar = await prisma.seminar.findMany({
    select: {
      id: true,
    },
  });

  for (let i = 0; i < allSeminar.length; i++) {
    const shuffledDosen = fakerID_ID.helpers.shuffle(allDosen);
    const existDosen = await prisma.pesertaSeminar.findFirst({
      where: {
        id_seminar: allSeminar[i].id,
        id_dosen: shuffledDosen[0].id,
      },
    });

    if (!existDosen) {
      await prisma.pesertaSeminar.create({
        data: {
          id_seminar: allSeminar[i].id,
          id_dosen: shuffledDosen[0].id,
          peran: fakerID_ID.helpers.arrayElement(["Peserta", "Pemateri"]),
        },
      });
    }
  }
};

const dummyKurikulum = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length === 0) {
    throw new Error("No Dosen found to create Kurikulum entries");
  }

  // Object to track the total SKS per semester
  const sksPerSemester: { [key: number]: number } = {};

  // Initialize SKS counters for each semester (1 to 8)
  for (let semester = 1; semester <= 8; semester++) {
    sksPerSemester[semester] = 0;
  }

  // Loop to create courses while ensuring each semester has 12 to 16 SKS
  for (let semester = 1; semester <= 8; semester++) {
    while (sksPerSemester[semester] < 12) {
      const randomDosen = fakerID_ID.helpers.arrayElement(allDosen);

      // Determine the number of SKS for this course
      let maxSKS = 16 - sksPerSemester[semester];
      if (maxSKS > 4) maxSKS = 4; // Ensure each course is between 2-4 SKS

      const sks = fakerID_ID.number.int({ min: 2, max: Math.min(4, maxSKS) });

      await prisma.kurikulum.create({
        data: {
          kode_matkul: await generateUniqueKodeMatkul(),
          id_dosen: randomDosen.id,
          semester: semester,
          metode_pembelajaran: fakerID_ID.helpers.arrayElement([
            "Case Method",
            "Team Based Project",
            "Inquiry Based Learning",
            "Discovery Learning",
            "Cooperative Learning",
          ]),
          sks: sks,
          nama_matkul: fakerID_ID.lorem.words(2),
        },
      });

      // Update the SKS counter for the semester
      sksPerSemester[semester] += sks;
    }
  }
};

const dummyPublikasiJurnal = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length === 0) {
    throw new Error("No Dosen found to create Publikasi Jurnal entries");
  }

  for (let i = 0; i < fakerID_ID.number.int({ min: 5, max: 20 }); i++) {
    const randomDosen = fakerID_ID.helpers.arrayElement(allDosen);

    await prisma.publikasiJurnal.create({
      data: {
        judul: fakerID_ID.lorem.sentence(),
        jenis_jurnal: fakerID_ID.helpers.arrayElement([
          "Nasional Terakreditasi",
          "Nasional Tidak Terakreditasi",
          "Internasional Bereputasi",
          "Internasional Tidak Bereputasi",
        ]),
        penerbit: fakerID_ID.company.name(),
        tahun: fakerID_ID.number.int({ min: 2019, max: 2023 }),
        jumlah_sitasi: fakerID_ID.number.int({ min: 0, max: 100 }),
        status: fakerID_ID.helpers.arrayElement(["Terbit", "Diajukan"]),
        id_dosen: randomDosen.id,
      },
    });
  }
};

const dummyPenelitian = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length === 0) {
    throw new Error("No Dosen found to create Penelitian entries");
  }

  for (let i = 0; i < fakerID_ID.number.int({ min: 5, max: 20 }); i++) {
    const randomDosen = fakerID_ID.helpers.arrayElement(allDosen);

    await prisma.penelitian.create({
      data: {
        judul_penelitian: fakerID_ID.lorem.sentence(),
        tahun: fakerID_ID.number.int({ min: 2019, max: 2023 }),
        sumber_dana: fakerID_ID.company.name(),
        jumlah_dana: fakerID_ID.number.int({ min: 1000000, max: 100000000 }),
        rekoginisi: fakerID_ID.helpers.arrayElement(["Nasional", "Internasional"]),
        penerapan: fakerID_ID.datatype.boolean(),
        pengajuan_hki: fakerID_ID.datatype.boolean(),
        produk: fakerID_ID.datatype.boolean(),
        id_dosen: randomDosen.id,
      },
    });
  }
};

const dummyPengabdian = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length === 0) {
    throw new Error("No Dosen found to create Pengabdian entries");
  }

  for (let i = 0; i < fakerID_ID.number.int({ min: 5, max: 20 }); i++) {
    const randomDosen = fakerID_ID.helpers.arrayElement(allDosen);

    await prisma.pengabdian.create({
      data: {
        judul_pengabdian: fakerID_ID.lorem.sentence(),
        lokasi: fakerID_ID.location.city(),
        tahun: fakerID_ID.number.int({ min: 2019, max: 2023 }),
        rekoginisi: fakerID_ID.helpers.arrayElement(["Nasional", "Internasional"]),
        penerapan: fakerID_ID.datatype.boolean(),
        produk: fakerID_ID.datatype.boolean(),
        id_dosen: randomDosen.id,
        pengajuan_hki: fakerID_ID.datatype.boolean(),
      },
    });
  }
};

const dummyKegiatanLuar = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length === 0) {
    throw new Error("No Dosen found to create Kegiatan Luar entries");
  }

  for (let i = 0; i < fakerID_ID.number.int({ min: 5, max: 20 }); i++) {
    const randomDosen = fakerID_ID.helpers.arrayElement(allDosen);

    await prisma.kegiatanLuar.create({
      data: {
        judul_kegiatan: fakerID_ID.lorem.sentence(),
        jenis_kegiatan: fakerID_ID.helpers.arrayElement([
          "Pertukaran dosen",
          "Penelitian bersama",
          "Magang",
        ]),
        lokasi: fakerID_ID.location.city(),
        tanggal: fakerID_ID.date.past({ years: 2 }),
        id_dosen: randomDosen.id,
      },
    });
  }
};

const dummyPenghargaan = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length === 0) {
    throw new Error("No Dosen found to create Penghargaan entries");
  }

  for (let i = 0; i < fakerID_ID.number.int({ min: 5, max: 20 }); i++) {
    const randomDosen = fakerID_ID.helpers.arrayElement(allDosen);

    await prisma.penghargaan.create({
      data: {
        nama_penghargaan: fakerID_ID.lorem.words(2),
        jenis_penghargaan: fakerID_ID.helpers.arrayElement([
          "Akademik",
          "Penelitian",
          "Pengabdian Masyarakat",
        ]),
        lembaga: fakerID_ID.company.name(),
        tahun: fakerID_ID.number.int({ min: 2019, max: 2023 }),
        tanggal_penghargaan: fakerID_ID.date.past({ years: 2 }),
        id_dosen: randomDosen.id,
      },
    });
  }
};

const dummySertifikat = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length === 0) {
    throw new Error("No Dosen found to create Sertifikat entries");
  }

  for (let i = 0; i < fakerID_ID.number.int({ min: 5, max: 20 }); i++) {
    const randomDosen = fakerID_ID.helpers.arrayElement(allDosen);

    await prisma.sertifikat.create({
      data: {
        nama_sertifikat: fakerID_ID.lorem.words(2),
        jenis_sertifikat: fakerID_ID.helpers.arrayElement([
          "Kompetensi",
          "Pelatihan dan Workshop",
          "Penelitian",
          "Pengabdian kepada masyarakat",
        ]),
        lembaga: fakerID_ID.company.name(),
        bidang_kompetensi: fakerID_ID.person.jobType(),
        tanggal_terbit: fakerID_ID.date.past({ years: 2 }),
        tanggal_kadaluarsa: fakerID_ID.date.future({ years: 2 }),
        id_dosen: randomDosen.id,
      },
    });
  }
};

const dummyBukuBahanAjar = async () => {
  const allDosen = await prisma.dosen.findMany({
    select: {
      id: true,
    },
  });

  if (allDosen.length === 0) {
    throw new Error("No Dosen found to create Pendidikan entries");
  }

  for (let i = 0; i < fakerID_ID.number.int({ min: 5, max: 20 }); i++) {
    const randomDosen = fakerID_ID.helpers.arrayElement(allDosen);

    await prisma.bukuBahanAjar.create({
      data: {
        judul_buku: fakerID_ID.lorem.words(3),
        jenis_buku: fakerID_ID.helpers.arrayElement(["Buku", "Bahan Ajar"]),
        penerbit: fakerID_ID.company.name(),
        tahun: fakerID_ID.number.int({ min: 2019, max: 2023 }),
        status: fakerID_ID.helpers.arrayElement(["Terbit", "Diajukan"]),
        id_dosen: randomDosen.id,
      },
    });
  }
};
const createDummy = async () => {
  // Dosen & Mahasiswa
  await dummyDosen();
  await dummyMahasiswa();

  // KKN
  await dummyKKN();
  await dummyMahasiswaKKN();

  await dummyBimbinganAkademik();

  // Skripsi
  await dummySkripsi();
  await dummyPembimbingSkripsi();
  await dummyPengujiSkripsi();

  // Lomba
  await dummyLomba();
  await dummyPesertaLomba();
  await dummyBimbinganLomba();

  // Seminar
  await dummySeminar();
  await dummyPesertaSeminar();

  await dummyKurikulum();
  await dummyPublikasiJurnal();
  await dummyPenelitian();
  await dummyPengabdian();
  await dummyKegiatanLuar();
  await dummyPenghargaan();
  await dummySertifikat();
  await dummyBukuBahanAjar();
};
createDummy()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
