import mongoose from "mongoose";

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
    path: {
        type: String
    },
    isTrash: {
        type: Boolean,
        default: false
    },
    extension: {
        type: String
    },
    trashTime: {
        type: Number
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

export default mongoose.model('folder', folderSchema)