import express from "express";
import cors from "cors";
import formRoute from "./Routes/Form/formRoutes.js";
import userRoute from "./Routes/User/userRoutes.js";
import { connectDB } from "./lib/db.js";
import { startSmsScheduler } from "./jobs/smsScheduler.js"; // import the scheduler

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS configuration
app.use(cors({
    origin: "https://softwingsreact-git-main-sathishs-projects-4ebf018b.vercel.app", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // allow cookies if needed
}));

// Parse JSON
app.use(express.json());

// Routes
app.use("/form", formRoute);
app.use("/auth", userRoute);

// Connect DB then start server and scheduler
connectDB()
  .then(() => {
    // Start scheduler AFTER DB is connected
    startSmsScheduler();

    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("Failed to connect DB and start server:", err);
    process.exit(1);
  });
