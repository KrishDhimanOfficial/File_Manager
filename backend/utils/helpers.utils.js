import mongoose from "mongoose"
import folderModel from "../models/folder.model.js"

export const handleTrashStatus = async (id, isTrash) => {
    try {
        // Update the current folder
        await folderModel.findByIdAndUpdate(id, { $set: { isTrash } })

        // Find all child folders
        const childFolders = await folderModel.find({ parentId: id })

        // Recursively update children
        for (const child of childFolders) {
            await handleTrashStatus(child._id, isTrash)
        }

    } catch (error) {
        console.error('Error in handleTrashStatus:', error.message)
        throw new Error(error)
    }
}

export const validateId = (id) => {
    return mongoose.Types.ObjectId.isValid(id)
}