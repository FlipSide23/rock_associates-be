import mongoose from "mongoose";

const Schema = mongoose.Schema

const servicesSchema = new Schema({

    serviceTitle: {
        type: String,
        required: true,
    },

    serviceDescription: {
        type: String,
        required: true,
    }

}, {
    timestamps: true
})


export default mongoose.model("Services", servicesSchema)