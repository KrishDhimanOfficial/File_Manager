import mongoose from "mongoose";
import { findRelativePath } from "../middleware/multer.middleware.js";

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'folder'
    },
    type: {
        type: String,
        enum: ['folder', 'file'],
    },
    size: {
        type: Number
    },
    // path: {
    //     type: String
    // },
    isTrash: {
        type: Boolean,
        default: false
    },
    extension: {
        type: String
    },
    expiryTime: {
        type: Date,
        default: null
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    })

// ✅ Create a virtual property "id" from "_id"
folderSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

folderSchema.virtual('path').get(function () {
    const filePath = findRelativePath(this.name)
    return this.type === 'file'
        ? `uploads/${filePath}`
        : null
})

export default mongoose.model('folder', folderSchema)