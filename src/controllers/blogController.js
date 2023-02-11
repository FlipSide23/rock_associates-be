import mongoose from "mongoose";
import slugify from "slugify";
import blogSchema from "../models/blogModel.js";
import blogCommentModel from "../models/blogCommentModel.js";
import blogLikeModel from "../models/blogLikeModel.js";
import commentLikeModel from "../models/commentLikeModel.js";
import blogValidationSchema from "../validations/blogValidation.js";
import commentValidationSchema from "../validations/commentValidation.js";
import commentReplyValidationSchema from "../validations/commentReplyValidation.js";
import cloudinary from "../helpers/cloudinary.js";
import commentReplyModel from "../models/commentReplyModel.js";

// Create a post
const createPost = async(request, response) =>{

    try{
        //Validation
        const {error} = blogValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

        const postImageResult = await cloudinary.uploader.upload(request.body.postImage, {
            folder: "Rock Associates's Images"
        })

        const newPost = new blogSchema({
            title : request.body.title,
            postBody : request.body.postBody,
            postImage : postImageResult.secure_url,
            createdBy : request.user._id,
			slug : slugify(request.body.title, { lower: true, strict: true })
        });

        const blogPost = await newPost.save()
        const populatedPost = await blogPost.populate('createdBy')

        response.status(200).json({
            "successMessage": "Post created successfully!",
            "postContent": populatedPost
        })
    }

    catch(error){
        console.log(error);
		if (error.code === 11000 || error.code === 11001) {
            response.status(400).json({
				"duplicationError": "You already have a post with this title!"
			})
		} else{
			response.status(500).json({
				"status": "fail", 
				"message": error.message
			})
		}
        
    }
}


// Getting all the posts
const getAllPosts = async(request, response) =>{
    try{
        
        // Populate post creator details
        let query=[
			{
				$lookup:
				{
				 from: "users",
				 localField: "createdBy",
				 foreignField: "_id",
				 as: "postCreator"
				}
			},
			{$unwind: '$postCreator'},

		];

        // Search functionality
        if(request.query.keyword && request.query.keyword!=''){ 
			query.push({
			  $match: { 
			    $or :[
			      {
			        title : { $regex: request.query.keyword, $options: 'i' } 
			      },
			      {
			        postBody : { $regex: request.query.keyword, $options: 'i' } 
			      },
			      {
			        'postCreator.firstName' : { $regex: request.query.keyword, $options: 'i' } 
			      },
			      {
			        'postCreator.lastName' : { $regex: request.query.keyword, $options: 'i' } 
			      }
			    ]
			  }
			});
		}

        // Get posts for each author
        if(request.query.user_id){		
			query.push({
			    $match: { 
			    	createdBy:mongoose.Types.ObjectId(request.query.user_id),
			    }	
			});
		}

        // Pagination functionality
        let total = await blogSchema.countDocuments(query);
		let page=(request.query.page)?parseInt(request.query.page):1;
		let perPage=(request.query.perPage)?parseInt(request.query.perPage):6;
		let skip=(page-1)*perPage;
		query.push({
			$skip:skip,
		});
		query.push({
			$limit:perPage,
		});

        // Only show needed fields
        query.push(
	    	{ 
	    		$project : {
    			"_id":1,
    			"createdAt":1,
	    		"title": 1,
	    		"slug": 1,
				"postBody": 1,
				"postImage":1,
				"postCreator._id":1 ,
	    		"postCreator.firstName":1,
	    		"postCreator.lastName":1,
				"comments_count":{$size:{"$ifNull":["$blog_comments",[]]}},
				"likes_count":{$size:{"$ifNull":["$blog_likes",[]]}}
	    		} 
	    	}
	    );

        // Sort functionality
        if(request.query.sortBy && request.query.sortOrder){
			var sort = {};
			sort[request.query.sortBy] = (request.query.sortOrder=='asc')?1:-1;
			query.push({
				$sort: sort
			});
		}else{
			query.push({
				$sort: {createdAt:-1}
			});	
		}


        const allPosts = await blogSchema.aggregate(query);

        if (allPosts){
            response.status(200).json({
                "allAvailablePosts": allPosts.map(doc => blogSchema.hydrate(doc)),
                "paginationDetails":{
                    total:total,
                    currentPage:page,
                    perPage:perPage,
                    totalPages:Math.ceil(total/perPage)
                }
            })
        }

        else{
            response.status(400).json({"postError": "The blog posts not found"})  
        }
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Getting a single post
const getSinglePost = async(request, response) =>{
    try{

		let slug = request.query.slug;

		let query=[
			{
				$lookup:
				{
				 from: "users",
				 localField: "createdBy",
				 foreignField: "_id",
				 as: "postCreator"
				}
			},
			{$unwind: '$postCreator'},
			{
				$match:{
					'slug': slug
				}
			}
		];


		// Only show needed fields
        query.push(
	    	{ 
	    		$project : {
    			"_id":1,
    			"createdAt":1,
	    		"title": 1,
				"slug": 1,
				"postBody": 1,
				"postImage":1,
				"blog_likes":1,
				"postCreator._id":1 ,
	    		"postCreator.firstName":1,
	    		"postCreator.lastName":1,
	    		"postCreator.imageLink":1,
				"comments_count":{$size:{"$ifNull":["$blog_comments",[]]}},
				"likes_count":{$size:{"$ifNull":["$blog_likes",[]]}}
	    		} 
	    	}
	    );

		let total = await blogSchema.countDocuments(query);

        const post = await blogSchema.aggregate(query);
        
        if (post){

			if(post.length>0){

			let blog= post[0];
			let current_user= request.user;
			let liked_by_current_user= false;
			if(current_user){
				let blog_like=await blogLikeModel.findOne({
					blog_id:blog._id,
					user_id:current_user._id
				});
				if(blog_like){
					liked_by_current_user= true;
				}
			}

			response.status(200).json({
				"fetchedPost": blogSchema.hydrate(blog),
				"fetchedPostDetails":{
					liked_by_current_user: liked_by_current_user,
					totalPosts: total
				} 
			})
		}
            
        }

        else{
            response.status(400).json({
                "postFetchedError": "Post not found!"
            })  
        }
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Update a post

const updatePost = async(request, response) =>{
    try{

		let slug = request.query.slug;

        const postImageResult = await cloudinary.uploader.upload(request.body.postImage, {
            folder: "Rock Associates's Post Images"
        })

        const post = await blogSchema.findOne({slug: slug});
        if (post){

			let current_user = request.user;

			if(post.createdBy!= current_user._id){
				return response.status(400).json({
					"unauthorizedError":'Access denied, you are not the creator of this post!',
			});
			}else{
                post.title = request.body.title || post.title,
                post.postBody = request.body.postBody || post.postBody
                post.postImage = postImageResult.secure_url || post.postImage

            await post.save()

            response.status(200).json({
                "postUpdateSuccess": "Post updated successfully!",
                "updatedPost": post
            })

		}
        }
        else{
            response.status(400).json({
                "postUpdateError": "Post not found!"
            })
        }
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Delete a post
const deletePost = async(request, response) =>{
    try{
		let blog_id = request.params.blog_id;

		if(!mongoose.Types.ObjectId.isValid(blog_id)){
			return response.status(400).json({
				"invalidId":'Something went wrong, refresh your page and try again!',
			});
		}

        const post = await blogSchema.findOne({_id: blog_id});

		if (post){

			let current_user = request.user;

			if(post.createdBy!= current_user._id){
				return response.status(400).json({
			  		"unauthorizedError":'Access denied, you are not the creator of this post!',
			  	});
			}else{
				await post.deleteOne()

				response.status(200).json({
					"deletedPost": `Post deleted successfully!`
				})
		}
        }
        else{
            response.status(400).json({
                "postUpdateError": "Post not found!"
            })
        }

        

    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Create a comment
const createComment = async(request, response) =>{
    try{

		//Validation
        const {error} = commentValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

		let blog_id = request.params.blog_id;

		if(!mongoose.Types.ObjectId.isValid(blog_id)){
			return response.status(400).json({
				"invalidId":'Something went wrong, refresh your page and try again!',
			});
		}

		const post = await blogSchema.findOne({_id: blog_id});

		if (post){

			const newComment = new blogCommentModel({
				comment : request.body.comment,
				blog_id : blog_id,
				user_id : request.user._id,
			});
	
			const commentData = await newComment.save()

			await blogSchema.updateOne(
				{_id : blog_id},
				{
					$push: { blog_comments : commentData._id  } 
				}
			)

			const populatedPost = await commentData.populate('user_id')
	
	
			response.status(200).json({
				"successMessage": "Comment created successfully!",
				"commentContent": populatedPost
			})
        }
        else{
            response.status(400).json({
                "postUpdateError": "Post not found!"
            })
        }

		
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Get all comments
const getAllComments = async(request, response) =>{
    try{
        let blog_id = request.params.blog_id;

		if(!mongoose.Types.ObjectId.isValid(blog_id)){
			return response.status(400).json({
				"invalidId":'Something went wrong, refresh your page and try again!',
			});
		}

		const post = await blogSchema.findOne({_id: blog_id});

		if (post){

			let query=[
				{
					$lookup:
					{
					 from: "users",
					 localField: "user_id",
					 foreignField: "_id",
					 as: "commentCreator"
					}
				},
				{$unwind: '$commentCreator'},
				{
					$lookup:
					{
					 from: "commentlikes",
					 localField: "comment_likes",
					 foreignField: "_id",
					 as: "commentLikes"
					}
				},
				{
					$match:{
						'blog_id':mongoose.Types.ObjectId(blog_id)
					}
				},
				{
					$sort:{
						createdAt:-1
					}
				}
			];

			// Only show needed fields
			query.push(
				{ 
					$project : {
					"_id":1,
					"createdAt":1,
					"comment": 1,
					"commentLikes.user_id": 1,
					"postCreator._id":1 ,
					"commentCreator.firstName":1,
					"commentCreator.lastName":1,
					"commentCreator.imageLink":1,
					"comment_likes_count":{$size:{"$ifNull":["$comment_likes",[]]}}
					} 
				}
			);

			let allComments = await blogCommentModel.aggregate(query);
	
			response.status(200).json({
                "allAvailableComments": allComments.map(doc => blogCommentModel.hydrate(doc))
        })

	}
        else{
            response.status(400).json({
                "postUpdateError": "Post not found!"
            })
        }
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Update a comment
const updateComment = async(request, response) =>{
    try{

		//Validation
        const {error} = commentValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

		let comment_id = request.params.comment_id;

		if(!mongoose.Types.ObjectId.isValid(comment_id)){
			return response.status(400).json({
				"invalidId":'Something went wrong, refresh your page and try again!',
			});
		}

		const comment = await blogCommentModel.findOne({_id: comment_id});

		if (comment){

				let current_user = request.user;

				if(comment.user_id!= current_user._id){
					return response.status(400).json({
						"unauthorizedError":'Access denied, you are not the creator of this comment!',
					});
				}else{

					await blogCommentModel.updateOne({_id:comment_id},{
						comment: request.body.comment || comment.comment
					});


					let query=[
						{
							$lookup:
							{
							from: "users",
							localField: "user_id",
							foreignField: "_id",
							as: "commentCreator"
							}
						},
						{$unwind: '$commentCreator'},
						{
							$match:{
								'_id':mongoose.Types.ObjectId(comment_id)
							}
						},

					];

					let updatedComment = await blogCommentModel.aggregate(query);

				response.status(200).json({
					"commentUpdateSuccess": "Comment updated successfully!",
					"updatedComment": updatedComment[0]
				})

			}

			
        }
        else{
            response.status(400).json({
                "commentUpdateError": "Comment not found!"
            })
        }

		
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}

// Delete a comment
const deleteComment = async(request, response) =>{
    try{

		//Validation

		let comment_id = request.params.comment_id;

		if(!mongoose.Types.ObjectId.isValid(comment_id)){
			return response.status(400).json({
				"invalidId":'Something went wrong, refresh your page and try again!',
			});
		}

		const comment = await blogCommentModel.findOne({_id: comment_id});

		if (comment){

				let current_user = request.user;

				if(comment.user_id!= current_user._id){
					return response.status(400).json({
						"unauthorizedError":'Access denied, you are not the creator of this comment!',
					});
				}else{

					await blogCommentModel.deleteOne({_id:comment_id})
					await blogSchema.updateOne(
						{_id:comment.blog_id},
						{
							$pull:{blog_comments:comment_id}
						}
					)

				response.status(200).json({
					"commentDeleteSuccess": "Comment deleted successfully!"
				})

			}
        }
        else{
            response.status(400).json({
                "commentUpdateError": "Comment not found!"
            })
        }

		
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Like a post
const likePost = async(request, response) =>{
    try{

      let blog_id = request.params.blog_id

      if(!mongoose.Types.ObjectId.isValid(blog_id)){
        return response.status(400).json({ 
            "invalidId":'Something went wrong, refresh your page and try again!',
        })
      }

      const blog = await blogSchema.findOne({_id: blog_id});

      if(!blog){
        return response.status(400).json({ 
            "messageNoBlog": "No blog found!",
        })
      }
      else{

        let current_user = request.user;

        const blog_like = await blogLikeModel.findOne({ blog_id: blog_id, user_id: current_user._id})

        if(!blog_like){
            const blogLikeDoc = new blogLikeModel ({
                blog_id: blog_id,
                user_id: current_user._id
            })
            let likeData= await blogLikeDoc.save();

            await blogSchema.updateOne({_id: blog_id},
                {
                  $push:{blog_likes: likeData._id}
                })

                return response.status(200).json({ 
                    "messageLikeAdded": "Like successfully added!",
                })
        }

        else{
            await blogLikeModel.deleteOne({
                _id:blog_like._id
            })

            await blogSchema.updateOne({_id: blog_like.blog_id},
                {
                  $pull:{blog_likes: blog_like._id}
                })

                return response.status(200).json({ 
                    "messageLikeRemoved": "Like successfully removed!",
                })
        }
      }
 
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Like a comment
const likeComment = async(request, response) =>{
    try{

      let comment_id = request.params.comment_id

      if(!mongoose.Types.ObjectId.isValid(comment_id)){
        return response.status(400).json({ 
            "invalidId":'Something went wrong, refresh your page and try again!',
        })
      }

      const comment = await blogCommentModel.findOne({_id: comment_id});

      if(!comment){
        return response.status(400).json({ 
            "messageNoBlog": "No blog found!",
        })
      }
      else{

        let current_user = request.user;

        const comment_like = await commentLikeModel.findOne({ comment_id: comment_id, user_id: current_user._id})

        if(!comment_like){
            const commentLikeDoc = new commentLikeModel ({
                comment_id: comment_id,
                user_id: current_user._id
            })
            let likeData= await commentLikeDoc.save();

            await blogCommentModel.updateOne({_id: comment_id},
                {
                  $push:{comment_likes: likeData._id}
                })

                return response.status(200).json({ 
                    "messageLikeAdded": "Like successfully added!",
                })
        }

        else{
            await commentLikeModel.deleteOne({
                _id:comment_like._id
            })

            await blogCommentModel.updateOne({_id: comment_like.comment_id},
                {
                  $pull:{comment_likes: comment_like._id}
                })

                return response.status(200).json({ 
                    "messageLikeRemoved": "Like successfully removed!",
                })
        }
      }
 
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Comment reply
const commentReply = async(request, response) =>{
    try{

		//Validation
        const {error} = commentReplyValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

		let comment_id = request.params.comment_id;

		if(!mongoose.Types.ObjectId.isValid(comment_id)){
			return response.status(400).json({
				"invalidId":'Something went wrong, refresh your page and try again!',
			});
		}

		const comment = await blogCommentModel.findOne({_id: comment_id});

		if (comment){

			const newReply = new commentReplyModel({
				reply : request.body.reply,
				comment_id : comment_id,
				user_id : request.user._id,
			});
	
			const commentData = await newReply.save()

			await blogCommentModel.updateOne(
				{_id : comment_id},
				{
					$push: { comment_replies : commentData._id  } 
				}
			)

			const populatedPost = await commentData.populate('user_id')
	
	
			response.status(200).json({
				"successMessage": "Reply added successfully!",
				"replyContent": populatedPost
			})
        }
        else{
            response.status(400).json({
                "postUpdateError": "Post not found!"
            })
        }

		
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Get all comment replies
const getAllCommentReplies = async(request, response) =>{
    try{
        let comment_id = request.params.comment_id;

		if(!mongoose.Types.ObjectId.isValid(comment_id)){
			return response.status(400).json({
				"invalidId":'Something went wrong, refresh your page and try again!',
			});
		}

		const comment = await blogCommentModel.findOne({_id: comment_id});

		if (comment){

			let query=[
				{
					$lookup:
					{
					 from: "users",
					 localField: "user_id",
					 foreignField: "_id",
					 as: "replyCreator"
					}
				},
				{$unwind: '$replyCreator'},
				{
					$match:{
						'comment_id':mongoose.Types.ObjectId(comment_id)
					}
				},
				{
					$sort:{
						createdAt:-1
					}
				}
			];

			// Only show needed fields
			query.push(
				{ 
					$project : {
					"_id":1,
					"createdAt":1,
					"reply": 1,
					"comment_replies": 1,
					"comment_likes": 1,
					"postCreator._id":1 ,
					"replyCreator.firstName":1,
					"replyCreator.lastName":1,
					"replyCreator.imageLink":1,
					} 
				}
			);


			let allReplies = await commentReplyModel.aggregate(query);
	
			response.status(200).json({
                "allAvailableReplies": allReplies.map(doc => commentReplyModel.hydrate(doc)),
        })

	}
        else{
            response.status(400).json({
                "repliesFoundError": "Replies not found!"
            })
        }
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}




export default { createPost, getAllPosts, getSinglePost, updatePost, deletePost,
	createComment, getAllComments, updateComment, deleteComment,
	likePost, likeComment, commentReply, getAllCommentReplies
};