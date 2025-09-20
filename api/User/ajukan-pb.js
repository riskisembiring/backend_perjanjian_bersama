import { db } from "../../config/firebase-config.js";

const ajukanPbHandler = async (req, res) => {
  try {
    const { userId, namaUser, files, namaPemohon, x } = req.body;

    // validasi
    if (!userId || !namaUser || !files || !namaPemohon) {
      return res
        .status(400)
        .json({ message: "userId, files & namaPemohon wajib dikirim!" });
    }

    // simpan metadata + URL ke Firestore
    const docRef = await db.collection("pengajuanPB").add({
      userId,
      namaUser,
      namaPemohon, 
      files, // sudah berupa URL dari Upload.io
      status: "Pending",
      createdAt: new Date(),
    });

    res
      .status(201)
      .json({ message: "Pengajuan PB berhasil disimpan!", id: docRef.id });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error saat menyimpan pengajuan PB", error: error.message });
  }
};

export { ajukanPbHandler };
