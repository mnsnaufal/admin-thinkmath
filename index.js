import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AdminRouter } from './routes/admin.js';
import { UserRouter } from './routes/user.js';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cookieParser());

//  Middleware CORS (HARUS SEBELUM ROUTES)
app.use(cors({
    origin: "https://klien-thinkmath.vercel.app", // Sesuaikan dengan URL FE
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

//  Handle Preflight Requests
app.options('*', cors());

//  Routes (Harus di bawah CORS)
app.use('/admin', AdminRouter);
app.use('/user', UserRouter);

//  Koneksi ke MongoDB
// Koneksi ke MongoDB
mongoose.connect(process.env.URI)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        app.listen(process.env.PORT || 3000, () => {
            console.log(`🚀 Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
    });

