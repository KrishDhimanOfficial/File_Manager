import { createNestedFolders, findRelativePath, upload } from "../middleware/multer.middleware.js";
import folderModel from "../models/folder.model.js";
import validate from "../services/validate.service.js";
import fs from 'node:fs'
import { handleTrashStatus, validateId } from "../utils/helpers.utils.js";
import { deleteFile } from "../utils/removeFile.utils.js";
import path from "node:path";

const folder_controllers = {
    handleCreateFolder: async (req, res) => {
        try {
            console.log(req.body);
            const { name, parentId, type } = req.body;

            const response = await folderModel.create({ name, parentId, type, })
            if (!response) return res.status(400).json({ success: false, message: 'Something went wrong.' })

            response.path = await createNestedFolders(name, parentId)
            response.save()

            return res.status(200).json({
                success: true,
                message: 'Folder created successfully.',
                folder: response
            })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('handleCreateFolder : ' + error.message)
        }
    },

    handleRenameFolder: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ sucess: false, message: 'Invalid Request.' })
            const { name } = req.body;

            const response = await folderModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { name } }).populate('parentId')
            if (!response) return res.status(400).json({ sucess: false, message: 'Something went wrong.' })

            const oldpath = await findRelativePath(response.name)
            const newpath = response.parentId === null
                ? `${name}`
                : `${await findRelativePath(response.parentId.name)}/${name}`

            response.path = newpath
            response.save()
            fs.promises.rename(`uploads/${oldpath}`, `uploads/${newpath}`)

            return res.status(200).json({
                success: true,
                message: 'Folder renamed successfully.',
            })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('handleRenameFolder : ' + error.message)
        }
    },
    handleGetFolders: async (req, res) => {
        try {
            const response = await folderModel.find({ parentId: req.params.id || null })
            return res.status(200).json(response)
        } catch (error) {
            console.log('handleGetFolders : ' + error.message)
            return res.status(500).json([])
        }
    },

    handlefolderTrashStatus: async (req, res) => {
        try {
            const { isTrash } = req.body

            const response = await folderModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        isTrash,
                    }
                }, { new: true })
            if (!response) return res.status(400).json({ error: 'Something went wrong.' })

            await handleTrashStatus(response._id, isTrash)
            return res.status(200).json({
                success: response.isTrash ? 'move to trash.' : 'restored.'
            })
        } catch (error) {
            console.log('handlefolderTrashStatus : ' + error.message)
        }
    },
    handleGetTrashFolders: async (req, res) => {
        try {
            // Step 1: Get all trashed folders
            const trashedFolders = await folderModel.find({ isTrash: true })

            // Step 2: Build a set of all trashed folder IDs for quick lookup
            const trashedIds = new Set(trashedFolders.map(f => f._id.toString()))

            // Step 3: Filter out folders whose parent is also trashed
            const rootTrashFolders = trashedFolders.filter(folder => {
                // If folder has no parent → show it
                if (!folder.parentId) return true
                // If folder's parent is not in trash → show it
                return !trashedIds.has(folder.parentId.toString())
            })

            return res.status(200).json(rootTrashFolders)
        } catch (error) {
            console.log('handleGetTrashFolders : ' + error.message)
        }
    },

    handleDeleteFolder: async (req, res) => {
        try {
            const response = true
            if (!response) return res.status(400).json({ error: 'Not found.' })
            return res.status(200).json({ success: 'move to trash.' })
        } catch (error) {
            console.log('handleDeleteFolder : ' + error.message)
        }
    },

    handleUploadData: async (req, res) => {
        try {
            const response = await folderModel.create({
                name: req.file?.filename,
                parentId: req.query.parentId === 'null' ? null : req.query.parentId,
                type: 'file',
                path: req.file?.path,
                size: req.file?.size,
                extension: path.extname(req.file?.originalname).split('.')[1],
            })

            if (!response) {
                deleteFile(req.file?.path)
                return res.status(400).json({ success: false, message: 'Something went wrong.' })
            }
            return res.status(200).json({ success: true, message: 'File uploaded successfully.', file: response })
        } catch (error) {
            console.log('handleUploadData : ' + error.message)
            deleteFile(req.file?.path)
            return res.status(500).json({ success: false, message: 'Something went wrong.' })
        }
    },
    handleRenameFile: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })
            const { name } = req.body;
            const response = await folderModel.findById(req.params.id).populate('parentId')
            if (!response) return res.status(404).json({ success: false, message: 'Not found' })

            const oldpath = response.path
            const newpath = response.parentId === null
                ? `${name}.${response.extension}`
                : `${await findRelativePath(response.parentId.name)}/${name}.${response.extension}`

            response.name = `${name}.${response.extension}`
            response.path = `uploads/${newpath}`
            await response.save()
            await fs.promises.rename(oldpath, `uploads/${newpath}`)
        } catch (error) {
            console.log('handleRenameFile : ' + error.message)
            return res.status(500).json({ success: false, message: 'Something went wrong.' })
        }
    },
}

export default folder_controllers