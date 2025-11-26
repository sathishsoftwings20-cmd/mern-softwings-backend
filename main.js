import express from "express";
import cors from "cors";
import formRoute from "./Routes/Form/formRoutes.js";
import userRoute from "./Routes/User/userRoutes.js";
import { connectDB } from "./lib/db.js";
import { startSmsScheduler } from "./jobs/smsScheduler.js";

const app = express();
const port = process.env.PORT || 5000;

// ✅ Allowed origins
const allowedOrigins = [
    "https://softwingsreact-git-main-sathishs-projects-4ebf018b.vercel.app",
    "http://localhost:3000"
];

// ✅ CORS middleware
app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin (like mobile apps, curl)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    credentials: true
}));

// ✅ Parse JSON
app.use(express.json());

// Routes
app.use("/form", formRoute);
app.use("/auth", userRoute);

// Connect DB then start server and scheduler
connectDB()
  .then(() => {
    startSmsScheduler();
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("Failed to connect DB and start server:", err);
    process.exit(1);
  });
