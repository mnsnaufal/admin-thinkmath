import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
import { AdminRouter } from './routes/admin.js';
import { UserRouter } from './routes/user.js';



const app = express();
app.use(express.json());

// Load environment variables from .env file 
dotenv.config({ path: "./config/.env" });

// Middleware CORS
app.use(cors({
    origin: ["https://klien-thinkmath.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

// Log requests
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});

app.use(cookieParser())
app.use('/admin', AdminRouter)
app.use('/user', UserRouter)
app.use('/user/:id', UserRouter)

mongoose.connect(process.env.URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch(err => {
        console.log("MongoDB URI:", process.env.URI);
        console.log("Port:", process.env.PORT || 3000);
        console.error("Connection error", err);
    });

