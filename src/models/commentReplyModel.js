import mongoose from "mongoose";
import moment from "moment";

const Schema = mongoose.Schema

const commentReplySchema = new Schema({

	reply: {
        type: String,
        required: true,
    },

	comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

},{
    timestamps:true,
});

commentReplySchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.createdAt = moment(ret.createdAt).format('MMMM, DD YYYY');
        ret.updatedAt = moment(ret.updatedAt).format('MMMM, DD YYYY');
    }
});

export default mongoose.model("CommentReply", commentReplySchema)