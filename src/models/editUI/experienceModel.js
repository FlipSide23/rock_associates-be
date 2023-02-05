import mongoose from "mongoose";

const Schema = mongoose.Schema

const experienceSchema = new Schema({
    yearsOfExperience: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
})


export default mongoose.model("Experience", experienceSchema)