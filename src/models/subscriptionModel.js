import mongoose from "mongoose";

const Schema = mongoose.Schema

const subscriptionSchema = new Schema ({

    subscriberEmail: {
        type: String,
        required: true
    },

    // emailToken: {
    //     type: String
    // },

    isVerified: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true
})

export default mongoose.model("Subscription", subscriptionSchema);