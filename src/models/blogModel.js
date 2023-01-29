import mongoose from "mongoose";
import moment from "moment";

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

    postImage: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

    createdBy: {type: Schema.Types.ObjectId, ref: "User" },

    blog_comments:[{type: mongoose.Schema.Types.ObjectId, ref: 'BlogComment' }],

    blog_likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'BlogLike' }]

}, {
    timestamps: true
})

blogSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.createdAt = moment(ret.createdAt).format('MMMM, DD YYYY');
        ret.updatedAt = moment(ret.updatedAt).format('MMMM, DD YYYY');
    }
});

export default mongoose.model("Blog", blogSchema)