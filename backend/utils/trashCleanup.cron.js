import cron from 'node-cron'
import fs from 'fs'
import path from 'path'
import folderModel from '../models/folder.model.js'

// Run every day at midnight
cron.schedule(
    //  '*/10 * * * * *',
    '0 0 * * *',
    async () => {
        console.log('🧹 Running trash cleanup...')

        const now = new Date()
        const expiredFolders = await folderModel.find({
            isTrash: true,
            expiryTime: { $lte: now },
        })

        for (const folder of expiredFolders) {
            try {
                const folderPath = path.join('uploads', folder.path)
                if (fs.existsSync(folderPath)) {
                    await fs.promises.rm(folderPath, { recursive: true, force: true })
                }
                console.log(`🗑️ Deleted folder: ${folder.name}`)
            } catch (err) {
                console.error('Error deleting folder:', err)
            }
        }
        await folderModel.deleteMany({ isTrash: true, expiryTime: { $lte: now } })
    })
