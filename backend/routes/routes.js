import express from 'express'
import folder_controllers from '../controllers/folder.controller.js'
const router = express.Router({ strict: true, caseSensitive: true })




router.get('/download/folder/:folderName', folder_controllers.handleDownloadFolder)
router.get('/download/file/:fileId', folder_controllers.handleDownloadFile)

export default router