import mongoose from "mongoose";

const Schema = mongoose.Schema

const staffSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    position: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

}, {
    timestamps: true
})


export default mongoose.model("Staff", staffSchema)