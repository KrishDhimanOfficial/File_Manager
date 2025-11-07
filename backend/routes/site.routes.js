import express from "express"
import authControllers from "../controllers/auth.controller.js"
import { verifyAccessToken } from "../middleware/auth.middleware.js"
import { findRelativePath, upload, uploadFile } from '../middleware/multer.middleware.js'
import folder_controllers from "../controllers/folder.controller.js"
const router = express.Router({ strict: true, caseSensitive: true })

router.post('/auth/login', authControllers.handleLogin)
router.post('/auth/signup', authControllers.handleSignup)
router.get('/auth/logout', authControllers.handleLogout)
router.get('/auth/refresh', authControllers.handleRefresh)

router.get('/auth/verify', verifyAccessToken, (req, res) => res.json({ success: true }))

router.get('/all/items', folder_controllers.handleGetAllItems)
router.get('/folders/:id?', folder_controllers.handleGetFolders)
router.get('/trash/folders/:id?', folder_controllers.handleGetTrashFolders)

router.route('/folder/:id?')
    .post(upload().none(), folder_controllers.handleCreateFolder)
    .put(upload().none(), folder_controllers.handleRenameFolder)
    .patch(upload().none(), folder_controllers.handlefolderTrashStatus)

router.put('/move/folder/:targetId/:itemId', folder_controllers.handleMoveFolder)
router.put('/move/file/:targetId/:itemId', folder_controllers.handleMoveFile)

router.route('/upload/data/:id?')
    .post(uploadFile, folder_controllers.handleUploadData)
    .put(folder_controllers.handleRenameFile)

export default router