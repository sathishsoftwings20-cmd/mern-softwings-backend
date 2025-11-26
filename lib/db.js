import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://sathishsoftwings20_db_user:XRXg54MmvA30vdFN@cluster.751cl4h.mongodb.net/?appName=Cluster"
    );

    console.log("✅ Connected to MongoDB Atlas via Mongoose");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
}
