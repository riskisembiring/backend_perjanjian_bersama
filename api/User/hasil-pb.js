import { db } from "../../config/firebase-config.js";

// GET semua hasil PB untuk user tertentu
const getHasilPbHandler = async (req, res) => {
  try {
    const { userId } = req.params; // ambil dari route param

    if (!userId) {
      return res.status(400).json({ message: "userId wajib dikirim!" });
    }

    // Ambil semua pengajuan PB berdasarkan userId
    const snapshot = await db
      .collection("pengajuanPB")
      .where("userId", "==", userId)
      //   .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const data = snapshot.docs.map((doc, index) => {
      const pengajuan = doc.data();
      return {
        key: doc.id,
        no: index + 1,
        tanggal: (() => {
          const d = pengajuan.createdAt.toDate();
          return (
            `${String(d.getDate()).padStart(2, "0")}-${String(
              d.getMonth() + 1
            ).padStart(2, "0")}-${d.getFullYear()} ` +
            `${String(d.getHours()).padStart(2, "0")}:${String(
              d.getMinutes()
            ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
          );
        })(),
        pemohon: pengajuan.namaPemohon,
        status:
          pengajuan.status === "Disetujui"
            ? "Diterima"
            : pengajuan.status === "Ditolak"
            ? "Ditolak"
            : "Proses",
        alasan: pengajuan.alasan,
      };
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error getHasilPbHandler:", error);
    res.status(500).json({
      message: "Gagal mengambil hasil PB",
      error: error.message,
    });
  }
};

export { getHasilPbHandler };
