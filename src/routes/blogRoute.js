import express from "express"
import blogController from "../controllers/blogController.js";
import authentication from "../middlewares/authentication.js"

const router = express.Router()

router.post("/createPost", authentication.authLogin, blogController.createPost);
router.get("/getAllPosts", blogController.getAllPosts);
// router.get("/getSinglePost/:id", blogController.getSinglePost);
// router.put("/updatePost/:id", blogController.updatePost);
// router.delete("/deletePost/:id", blogController.deletePost);
// router.put("/createComment/:id", blogController.createComment);
// router.get("/getAllComments/:id", blogController.getAllComments);
// router.get("/getAllCommentReplies/:id", blogController.getAllCommentReplies);
// router.post("/likePost/:blog_id", blogController.likePost);
// router.get("/getAllLikes/:id", blogController.getAllLikes);
// router.post("/likeComment/:id/:commentId", blogController.likeComment);
// router.put("/commentReply/:id/:commentId", blogController.commentReply);
// router.get("/getSingleComment/:id/:commentId", blogController.getSingleComment);

export default router