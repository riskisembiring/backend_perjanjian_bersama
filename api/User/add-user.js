import bcrypt from "bcryptjs";
import { db } from "../../config/firebase-config.js";

const addUserHandler = async (req, res) => {
  const { name, email, namaPerusahaan, noHp, username, password } = req.body;
  const userRole = req.body.userRole || "User"; // default role

  if (!name || !email || !namaPerusahaan || !noHp || !username || !password) {
    return res.status(400).json({ message: "Semua field (name, email, username, password) wajib diisi!" });
  }

  try {
    // 🔎 Cek apakah username sudah ada
    const existingUser = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({ message: "Username sudah digunakan, silakan pilih yang lain!" });
    }

    // Hash password sebelum simpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const docRef = await db.collection("users").add({
      name,
      email,
      username,
      namaPerusahaan,
      noHp,
      userRole,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "User berhasil dibuat!",
      id: docRef.id,
      role: userRole,
    });
  } catch (error) {
    console.error("Error register:", error);
    res.status(500).json({
      message: "Error saat menyimpan data",
      error: error.message,
    });
  }
};

export { addUserHandler };
