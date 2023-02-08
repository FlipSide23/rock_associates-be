import mongoose from "mongoose";

const Schema = mongoose.Schema

const projectsSchema = new Schema({

    title: {
        type: String,
        required: true,
    },

    projectImage: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    activitiesPerformed: {
        type: String,
        required: true,
    },

    result: {
        type: String,
        required: true,
    },

    employer: {
        type: String,
        required: true,
    },

    year: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        required: true,
    },

    client: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

}, {
    timestamps: true
})


export default mongoose.model("projects", projectsSchema)