import chalk from "chalk"
import jwt from "../services/generateJWT.service.js"
import adminModel from "../models/admin.model.js"
import config from "../config/config.js"
import validate from '../services/validate.service.js'
import bcrypt from "bcrypt"

const authControllers = {
    handleLogin: async (req, res) => {
        try {
            const user = await adminModel.findOne({ email: req.body.email })
            if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' })

            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' })

            const payload = jwt.jwtEncrypt({ id: user._id })
            const accessToken = jwt.accessToken({ data: payload })
            const refreshToken = jwt.refreshToken({ data: payload })

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: config.node_env === "production",           // send only via HTTP
                sameSite: "strict",     // block CSRF
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            return res.status(200).json({
                success: true,
                message: 'Login successfully.',
                accessToken
            })
        } catch (error) {
            chalk.red(console.log('handleLogin : ' + error.message))
        }
    },
    handleSignup: async (req, res) => {
        try {
            const { name, email } = req.body;
            const user = await adminModel.create({ name, email })
            if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' })

            const payload = jwt.jwtEncrypt({ id: user._id })
            const accessToken = jwt.accessToken({ data: payload })
            const refreshToken = jwt.refreshToken({ data: payload })

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: config.node_env === "production",           // send only via HTTP
                sameSite: "strict",     // block CSRF
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            return res.status(200).json({
                success: true,
                message: 'Login successfully.',
                accessToken
            })
        } catch (error) {
            console.log('handleSignup : ' + error.message)
            if (error.name === 'ValidationError') validate(res, error.errors)
            if (error.cause?.code === 11000) return res.status(400).json({ success: false, message: "Email already exists" })
            return res.status(500).json({ success: false, message: "Server error" })
        }
    },

    handleRefresh: async (req, res) => {
        try {
            const token = req.cookies?.refreshToken;

            if (!token) return res.status(401).json({ success: false, message: "No token" })

            const user = jwt.verifyToken(token, config.jwt_refresh_key)
            const decoded = jwt.jwtDecrypt(user.data)

            const response = await adminModel.findById(decoded.id)
            if (!response) {
                return res.status(404).json({ success: false, message: "User not found" })
            }

            const payload = jwt.jwtEncrypt({ id: response._id })
            const accessToken = jwt.accessToken({ data: payload })
            const newRefresh = jwt.refreshToken({ data: payload })

            res.cookie("refreshToken", newRefresh, {
                httpOnly: true,
                secure: config.node_env === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.status(200).json({ success: true, accessToken })
        } catch (error) {
            console.log('handleRefresh : ' + error.message)
            return res.status(403).json({ success: false, message: "Invalid token" })
        }
    },

    handleLogout: async (req, res) => {
        try {
            res.clearCookie("refreshToken", {
                sameSite: "strict",
                secure: config.node_env === "production",
                path: "/",
            });
            return res.status(200).json({ success: true, message: "Logged out" })
        } catch (error) {
            chalk.red(console.log('handleLogout : ' + error.message))
        }
    },
    handleAuthUser: async (req, res) => {
        try {
            const token = req.cookies?.refreshToken;

            if (!token) return res.status(401).json({ success: false, message: "No token" })

            const user = jwt.verifyToken(token, config.jwt_refresh_key)
            const decoded = jwt.jwtDecrypt(user.data)

            const response = await adminModel.findById(decoded.id, { password: 0 })
            if (!response) return res.status(404).json({ success: false, message: "User not found" })

            return res.status(200).json(response)
        } catch (error) {
            console.log('handleAuthUser : ' + error.message)
            return res.status(403).json({ success: false, message: "Invalid token" })
        }
    },
    handleUpdateProfile: async (req, res) => {
        try {
            const { name, email, currentPassword, password } = req.body;

            const user = await adminModel.findOne({ email })
            if (!user) return res.status(404).json({ success: false, message: "User not found" })

            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' })

            user.name = name
            user.email = email
            user.password = await bcrypt.hash(password, 10)

            await user.save()

            return res.status(200).json({ success: true, message: "Profile updated successfully" })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            else return res.status(500).json({ success: false, message: "Server error" })
            console.log('handleUpdateProfile : ' + error.message)
        }
    },
}

export default authControllers