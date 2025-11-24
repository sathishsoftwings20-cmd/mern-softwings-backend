import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect(
            "mongodb+srv://sathish200703_db_user:Ix2QI4KJrjaYloZ5@formremindercluster.gxhfvxg.mongodb.net/formApp?retryWrites=true&w=majority"
        );

        console.log("✅ Connected to MongoDB Atlas via Mongoose");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
}
