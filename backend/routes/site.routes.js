import express from "express"
import authControllers from "../controllers/auth.controller.js"
import { verifyAccessToken } from "../middleware/auth.middleware.js"
import { upload } from '../middleware/multer.middleware.js'
import folder_controllers from "../controllers/folder.controller.js"
const router = express.Router({ strict: true, caseSensitive: true })

router.post('/auth/login', authControllers.handleLogin)
router.post('/auth/signup', authControllers.handleSignup)
router.get('/auth/logout', authControllers.handleLogout)
router.get('/auth/refresh', authControllers.handleRefresh)

router.get('/auth/verify', verifyAccessToken, (req, res) => res.json({ success: true }))

router.route('/folder/:id?')
    .post(upload().none(), folder_controllers.handleCreateFolder)
export default router