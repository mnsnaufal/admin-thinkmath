import express from 'express';
import bcrypt from 'bcrypt';
import { Admin } from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/registerAdmin', async (req,res) => {
    const {username, password} = req.body;
    const admin = await Admin.findOne({username})
    if(admin) {
        return res.status(400).json({message : "admin tidak di temukan"})
    }

    try {
        const hashpassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            username,
            password : hashpassword
        })

        await newAdmin.save()
        return res.status(200).json({message : "Admin Berhasil dibuat", status : true})
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
})

//buat login
router.post('/loginAdmin', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://klien-thinkmath.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");

    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: "Akun tidak ditemukan" });
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Password salah" });
        }

        const token = jwt.sign({ username: admin.username }, process.env.KEY, { expiresIn: '3h' });
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: true,  // Tambahkan ini untuk menghindari masalah di HTTPS
            sameSite: 'None', // Pastikan cookie bisa diakses lintas domain
            maxAge: 3600000 
        });

        return res.status(200).json({ status: true, message: "Login Berhasil", token });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Terjadi kesalahan", error });
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({status : true})
})

export {router as AdminRouter}