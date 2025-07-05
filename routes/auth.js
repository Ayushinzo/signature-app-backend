import express from 'express'
import User from '../models/user.js'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import verifyToken from '../middleware/verifyToken.js'
dotenv.config()

const authRouter = express.Router()

authRouter.post('/register', [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required")
], async (req, res) => {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({
                success: false,
                message: "Invalid credentials",
                errors: errors.array()
            })
        }

        const { username, email, password } = req.body;

        if (password.length < 6) {
            return res.json({
                success: false,
                message: 'Password must be at least 6 character long'
            })
        }

        const exists = await User.findOne({ email });
        if (exists) return res.json({
            success: false,
            message: 'User already exists'
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.json({
            success: true,
            token,
            userdata: {
                name: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        return res.json({
            success: false,
            message: "Could not register user"
        });
    }
})

authRouter.post('/login', [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required")
], async (req, res) => {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({
                success: false,
                message: "Invalid credentials",
                errors: errors.array()
            })
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.json({
            success: false,
            message: 'Invalid credentials'
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({
            success: false,
            message: 'Invalid credentials'
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.json({
            success: true,
            token,
            userdata: {
                email: user.email,
                message: user.username
            }
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Unauthorized"
        })
    }
})

authRouter.get('/verify', verifyToken, (req, res) => {
    return res.json({
        success: true,
        user: req.user
    });
});

authRouter.get('/getUserDetails', verifyToken, async (req, res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password -_id -createdAt -updatedAt -__v");
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }
        return res.json({
            success: true,
            user
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server data"
        })
    }
})

export default authRouter;