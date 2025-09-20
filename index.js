import express from "express";
import cors from "cors";

import { addUserHandler } from "./api/User/add-user.js";
import { loginUserHandler } from "./api/User/login.js";
import { ajukanPbHandler } from "./api/User/ajukan-pb.js";
import { getHasilPbHandler } from "./api/User/hasil-pb.js";
import {
  getAccountsHandler,
  deleteAccountHandler,
  updateRoleHandler,
} from "./api/Admin/accounts.js";
import {
  getAllPengajuanPB,
  updateStatusPengajuanPB,
} from "./api/Admin/approval-pb.js";
import { getStatsHandler } from "./api/Admin/stats.js";

const app = express();

// ✅ Konfigurasi CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ==================== User API ====================
app.post("/add-user", addUserHandler);
app.post("/login", loginUserHandler);
app.post("/ajukan-pb", ajukanPbHandler);
app.get("/hasil-pb/:userId", getHasilPbHandler);

// ==================== Admin API ====================
app.get("/accounts", getAccountsHandler);
app.delete("/accounts/:id", deleteAccountHandler);
app.put("/accounts/:id/role", updateRoleHandler);
app.get("/approval-pb", getAllPengajuanPB);
app.put("/approval-pb/:id", updateStatusPengajuanPB);
app.get("/stats", getStatsHandler);

// ==================== Jalankan server kalau bukan di Vercel ====================
// if (process.env.VERCEL !== "1") {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
//   });
// }

// ✅ Export untuk Vercel (serverless)
export default app;
