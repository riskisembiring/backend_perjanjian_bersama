import bcrypt from "bcryptjs";
import { db } from "../../config/firebase-config.js";

const loginUserHandler = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi!" });
  }

  try {
    // Cari user berdasarkan username
    const userSnapshot = await db
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(400).json({ message: "Username tidak ditemukan!" });
    }

    // Ambil data user
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Bandingkan password dengan hash
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah!" });
    }

    // Jika sukses
    res.status(200).json({
      message: "Login berhasil!",
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        username: userData.username,
        role: userData.userRole,
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({
      message: "Error saat login",
      error: error.message,
    });
  }
};

export { loginUserHandler };
