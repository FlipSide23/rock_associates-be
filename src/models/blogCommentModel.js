import mongoose from "mongoose";
import moment from "moment";

const Schema = mongoose.Schema

const commentSchema = new Schema({

	comment: {
        type: String,
        required: true,
    },

	blog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment_likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'CommentLike' }],
    comment_replies:[{type: mongoose.Schema.Types.ObjectId, ref: 'CommentReply' }],

},{
    timestamps:true,
});

commentSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.createdAt = moment(ret.createdAt).format('MMMM, DD YYYY');
        ret.updatedAt = moment(ret.updatedAt).format('MMMM, DD YYYY');
    }
});

export default mongoose.model("BlogComment", commentSchema)