import mongoose from "mongoose";
import blogSchema from "../models/blogModel.js";
import blogValidationSchema from "../validations/blogValidation.js";
import cloudinary from "../helpers/cloudinary.js";

// Creating the post
const createPost = async(request, response) =>{

    try{
        //Validation
        const {error} = blogValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

        // const postImageResult = await cloudinary.uploader.upload(request.body.postImage, {
        //     folder: "Rock Associates's Images"
        // })

        const newPost = new blogSchema({
            title : request.body.title,
            postBody : request.body.postBody,
            // postImage : postImageResult.secure_url,
            createdBy : request.user._id
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
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
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
			        title : { $regex: request.query.keyword } 
			      },
			      {
			        postBody : { $regex: request.query.keyword } 
			      },
			      {
			        'postCreator.firstName' : { $regex: request.query.keyword } 
			      },
			      {
			        'postCreator.lastName' : { $regex: request.query.keyword } 
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
				// "postImage":1,
				"postCreator._id":1 ,
	    		"postCreator.firstName":1,
	    		"postCreator.lastName":1
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
                "allAvailablePosts": allPosts,
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


export default { createPost, getAllPosts };