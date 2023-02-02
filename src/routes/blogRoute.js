import express from "express"
import blogController from "../controllers/blogController.js";
import authentication from "../middlewares/authentication.js"

const router = express.Router()

router.post("/createPost", authentication.authLogin, blogController.createPost);
router.get("/getAllPosts", blogController.getAllPosts);
router.get("/getSinglePost", authentication.authUserLoggedIn, blogController.getSinglePost);
router.put("/updatePost/:blog_id", authentication.authLogin, blogController.updatePost);
router.delete("/deletePost/:blog_id", authentication.authLogin, blogController.deletePost);
router.post("/createComment/:blog_id", authentication.authLogin, blogController.createComment); 
router.get("/getAllComments/:blog_id", blogController.getAllComments);
router.put("/updateComment/:comment_id", authentication.authLogin, blogController.updateComment);
router.delete("/deleteComment/:comment_id", authentication.authLogin, blogController.deleteComment);
router.post("/likePost/:blog_id", authentication.authLogin, blogController.likePost);
router.post("/likeComment/:comment_id", authentication.authLogin, blogController.likeComment);
router.post("/commentReply/:comment_id", authentication.authLogin, blogController.commentReply);
router.get("/getAllCommentReplies/:comment_id", blogController.getAllCommentReplies);

export default router