import mongoose from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String, 
        required: true,
    },    

    password: {
        type: String, 
        required: true,
    }, 

    repeatPassword: {
        type: String,
        required: true,
    },

    imageLink: {
        url: String
    },

    ImagePresent: {
        type: Boolean
    },

    emailToken: {
        type: String
    },

    isVerified: {
        type: Boolean
    },

    resetToken: {
        type: String
    },

    role: {
        type: String,
        default: "user"
    },

}, {
    timestamps: true
})


export default mongoose.model("User", userSchema)