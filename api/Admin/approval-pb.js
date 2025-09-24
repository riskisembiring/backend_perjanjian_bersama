import { db } from "../../config/firebase-config.js";

// GET semua pengajuan PB
const getAllPengajuanPB = async (req, res) => {
  try {
    const snapshot = await db.collection("pengajuanPB").get();

    const data = await Promise.all(
      snapshot.docs.map(async (doc, index) => {
        const pengajuan = doc.data();

        // Ambil info user
        let namaUser = "Tidak Diketahui";
        if (pengajuan.userId) {
          const userDoc = await db.collection("users").doc(pengajuan.userId).get();
          if (userDoc.exists) {
            namaUser = userDoc.data().name;
          }
        }

        return {
          id: doc.id,
          no: index + 1,
          nama: namaUser,
          tanggal: (() => {
            const d = pengajuan.createdAt.toDate();
            return (
              `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()} ` +
              `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
            );
          })(),
          namaPemohon: pengajuan.namaPemohon,
          status: pengajuan.status,
          alasan: pengajuan.alasan || "", // tampilkan alasan kalau ada
          files: pengajuan.files || {},
        };
      })
    );

    res.status(200).json(data);
  } catch (error) {
    console.error("Error getAllPengajuanPB:", error);
    res.status(500).json({ message: "Gagal mengambil data pengajuan PB", error: error.message });
  }
};

// UPDATE status pengajuan
const updateStatusPengajuanPB = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, alasan } = req.body;

    if (!["Disetujui", "Ditolak", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid!" });
    }

    const updateData = { status };

    if (status === "Ditolak") {
      updateData.alasan = alasan || "Tidak ada alasan diberikan";
    } else if (status === "Disetujui") {
      updateData.alasan = ""; // kosongkan alasan kalau disetujui
    }

    await db.collection("pengajuanPB").doc(id).update(updateData);

    res.status(200).json({ message: `Status berhasil diubah menjadi ${status}` });
  } catch (error) {
    console.error("Error updateStatusPengajuanPB:", error);
    res.status(500).json({ message: "Gagal update status", error: error.message });
  }
};

export { getAllPengajuanPB, updateStatusPengajuanPB };
