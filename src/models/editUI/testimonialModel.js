import mongoose from "mongoose";

const Schema = mongoose.Schema

const testimonialSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    testimonial: {
        type: String,
        required: true
    },   

}, {
    timestamps: true
})


export default mongoose.model("Testimonial", testimonialSchema)