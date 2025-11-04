import { createNestedFolders, upload } from "../middleware/multer.middleware.js";
import folderModel from "../models/folder.model.js";
import validate from "../services/validate.service.js";
import fs from 'node:fs'
import { handleTrashStatus, validateId } from "../utils/helpers.utils.js";

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

            const response = await folderModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { name: req.body.name } })
            if (!response) return res.status(400).json({ sucess: false, message: 'Something went wrong.' })

            const path = response.path.split('/')
            const parentId = path[path.length - 2]
            console.log(parentId);

            // await createNestedFolders(req.body.name, parentId)
            fs.promises.rename(`uploads/${response.path}`, `uploads/${req.body.name}`)

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
            console.log('helo');

        } catch (error) {
            console.log('handleUploadData : ' + error.message)
            return res.status(500).json({ success: false, message: 'Something went wrong.' })
        }
    },
}

export default folder_controllers