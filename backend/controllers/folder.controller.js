import { upload } from "../middleware/multer.middleware.js";
import folderModel from "../models/folder.model.js";
import validate from "../services/validate.service.js";

const folder_controllers = {
    handleCreateFolder: async (req, res) => {
        try {
            console.log(req.body);
            const { name, parentId, type } = req.body;

            const response = await folderModel.create({ name, parentId, type })
            if (!response) return res.status(400).json({ success: false, message: 'Something went wrong.' })

            upload(name)
            return res.status(200).json({ success: true, message: 'Folder created successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('handleCreateFolder : ' + error.message)
        }
    }
}
export default folder_controllers