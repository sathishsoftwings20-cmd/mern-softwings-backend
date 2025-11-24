import mongoose from "mongoose";

const userScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["superadmin", "admin", "staff", "user"],
            default: "user"
        }
    }
)
export default mongoose.model("User", userScheme);
