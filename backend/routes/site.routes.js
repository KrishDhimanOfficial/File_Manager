import express from "express"
import authControllers from "../controllers/auth.controller.js"
import { verifyAccessToken } from "../middleware/auth.middleware.js"
const router = express.Router({ strict: true, caseSensitive: true })

router.post('/auth/login', authControllers.handleLogin)
router.post('/auth/signup', authControllers.handleSignup)
router.get('/auth/logout', authControllers.handleLogout)
router.get('/auth/refresh', authControllers.handleRefresh)

router.get('/auth/verify', verifyAccessToken, (req, res) => {
    return res.json({ success: true })
})
export default router