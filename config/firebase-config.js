import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

// Inisialisasi Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "informasi-pb.appspot.com", // 🔑 ganti dengan bucket project kamu
});

// Firestore
const db = admin.firestore();

// Storage bucket
const bucket = admin.storage().bucket();

export { db, bucket };
