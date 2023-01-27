import mongoose from "mongoose";

const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    postBody: {
        type: String,
        required: true
    },

    // postImage: {
    //     type: String,
    //     required: true
    // },

    createdBy: {type: Schema.Types.ObjectId, ref: "User" }

}, {
    timestamps: true
})


export default mongoose.model("Blog", blogSchema)