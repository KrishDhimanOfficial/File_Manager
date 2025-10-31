import { createNestedFolders, upload } from "../middleware/multer.middleware.js";
import folderModel from "../models/folder.model.js";
import validate from "../services/validate.service.js";
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

    handleGetFolders: async (req, res) => {
        try {
            const response = await folderModel.find({ parentId: req.params.id || null, isTrash: false })
            return res.status(200).json(response)
        } catch (error) {
            console.log('handleGetFolders : ' + error.message)
            return res.status(500).json([])
        }
    },

    handlefolderTrashStatus: async (req, res) => {
        try {
            const { isTrash } = req.body
            const response = await folderModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { isTrash } }, { new: true })
            if (!response) return res.status(400).json({ error: 'Something went wrong.' })

            return res.status(200).json({
                success: response.isTrash ? 'move to trash.' : 'restored.'
            })
        } catch (error) {
            console.log('handlefolderTrashStatus : ' + error.message)
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
}

export default folder_controllers