import mongoose from "mongoose";

const Schema = mongoose.Schema

const aboutSchema = new Schema({
    about: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
})


export default mongoose.model("About", aboutSchema)