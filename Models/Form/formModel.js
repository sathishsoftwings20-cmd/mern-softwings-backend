import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    date: { type: Date, required: true }, // store full ISO date+time
    message: { type: String },

    // Scheduler fields
    smsSent: { type: Boolean, default: false, index: true },
    smsSentAt: { type: Date, default: null },
    smsAttempts: { type: Number, default: 0 }, // optional: track attempts
  },
  { timestamps: true }
);

// index helps queries for due forms
formSchema.index({ date: 1, smsSent: 1 });

export default mongoose.model("Form", formSchema);
