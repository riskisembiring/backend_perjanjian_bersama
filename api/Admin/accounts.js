import { db } from "../../config/firebase-config.js";

// GET semua user
const getAccountsHandler = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const accounts = snapshot.docs.map((doc, index) => ({
      key: doc.id,
      no: index + 1,
      nama: doc.data().name,
      email: doc.data().email,
      username: doc.data().username,
      perusahaan: doc.data().namaPerusahaan,
      noHp: doc.data().noHp,
      role: doc.data().userRole,
    }));

    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error ambil akun:", error);
    res.status(500).json({ message: "Gagal mengambil data akun", error: error.message });
  }
};

// DELETE user by id
const deleteAccountHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("users").doc(id).delete();
    res.status(200).json({ message: "✅ User berhasil dihapus" });
  } catch (error) {
    console.error("Error hapus user:", error);
    res.status(500).json({ message: "Gagal menghapus user", error: error.message });
  }
};

// UPDATE role user
const updateRoleHandler = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    await db.collection("users").doc(id).update({ userRole: role });
    res.status(200).json({ message: "✅ Role berhasil diperbarui" });
  } catch (error) {
    console.error("Error update role:", error);
    res.status(500).json({ message: "Gagal update role", error: error.message });
  }
};

export { getAccountsHandler, deleteAccountHandler, updateRoleHandler };
