import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    type: {
        type: String,
        enum: ['folder', 'file'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('folder', folderSchema)