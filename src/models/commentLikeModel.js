import mongoose from "mongoose";

const Schema = mongoose.Schema

const blogLikeSchema = new Schema({

	comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogComment' },
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

},{
    timestamps:true,
});

export default mongoose.model("CommentLike", blogLikeSchema)