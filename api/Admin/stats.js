import { db } from "../../config/firebase-config.js";

const getStatsHandler = async (req, res) => {
  try {
    // hitung jumlah user
    const usersSnap = await db.collection("users").get();
    const usersCount = usersSnap.size;

    // hitung jumlah pengajuan
    const pengajuanSnap = await db.collection("pengajuanPB").get();
    const pengajuanCount = pengajuanSnap.size;

    // hitung jumlah dokumen (akumulasi dari semua files)
    let dokumenCount = 0;
    pengajuanSnap.forEach((doc) => {
      const data = doc.data();
      if (data.files) {
        dokumenCount += Object.keys(data.files).length;
      }
    });

    // respon konsisten seperti login
    res.status(200).json({
      message: "Stats berhasil diambil!",
      stats: {
        users: usersCount,
        pengajuan: pengajuanCount,
        dokumen: dokumenCount,
      },
    });
  } catch (error) {
    console.error("Error ambil stats:", error);
    res.status(500).json({
      message: "Error saat ambil stats",
      error: error.message,
    });
  }
};

export { getStatsHandler };
