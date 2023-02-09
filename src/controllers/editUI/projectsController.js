import mongoose from "mongoose";
import slugify from "slugify";
import projectsModel from "../../models/editUI/projectsModel.js";
import projectsValidationSchema from "../../validations/editUI/projectsValidation.js";
import cloudinary from "../../helpers/cloudinary.js";

// Create a Project
const createProject = async(request, response) =>{

    try{
        //Validation
        const {error} = projectsValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

        const projectImageResult = await cloudinary.uploader.upload(request.body.projectImage, {
            folder: "Rock Associates's Images"
        })

        const newProject = new projectsModel({
            title : request.body.title,
            description : request.body.description,
            activitiesPerformed : request.body.activitiesPerformed,
            result : request.body.result,
            employer : request.body.employer,
            year : request.body.year,
            location : request.body.location,
            client : request.body.client,
            category : request.body.category,
            projectImage : projectImageResult.secure_url,
			slug : slugify(request.body.title, { lower: true, strict: true })
        });

        const Project = await newProject.save()

        response.status(200).json({
            "successMessage": "Project created successfully!",
            "projectContent": Project
        })
    }

    catch(error){
        console.log(error);
		if (error.code === 11000 || error.code === 11001) {
            response.status(400).json({
				"duplicationError": "You already have a project with this title!"
			})
		} else{
			response.status(500).json({
				"status": "fail", 
				"message": error.message
			})
		}
        
    }
}


// Getting all the Projects
const getAllProjects = async(request, response) =>{
    try{

        const allProjects = await projectsModel.find().sort({createdAt: -1});

        if (allProjects){
            response.status(200).json({
                "successMessage": "Projects fetched successfully!",
                "allAvailableProjects": allProjects,
            })
        }

        else{
            response.status(400).json({"ProjectError": "Projects not found"})  
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


// Getting a single Project
const getSingleProject = async(request, response) =>{
    try{

        const Project = await projectsModel.findOne({slug: request.query.slug});
        
        if (Project){
			response.status(200).json({
                "successMessage": "Project fetched successfully!",
				"fetchedProject": Project
			})
		}

        else{
            response.status(400).json({
                "ProjectFetchedError": "Project not found!"
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

// Getting Project by category
const getProjectByCategory = async(request, response) =>{
    try{

        const Project = await projectsModel.find({category: request.query.category});
        
        if (Project){
			response.status(200).json({
                "successMessage": "Project fetched successfully!",
				"fetchedProject": Project
			})
		}

        else{
            response.status(400).json({
                "ProjectFetchedError": "Project not found!"
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


// Update a Project

const updateProject = async(request, response) =>{
    try{

		let slug = request.query.slug;

        const projectImageResult = await cloudinary.uploader.upload(request.body.projectImage, {
            folder: "Rock Associates's Project Images"
        })

        const Project = await projectsModel.findOne({slug: slug});

        if (Project){

            Project.title = request.body.title || Project.title,
            Project.description = request.body.description || Project.description,
            Project.activitiesPerformed = request.body.activitiesPerformed || Project.activitiesPerformed,
            Project.result = request.body.result || Project.result,
            Project.employer = request.body.employer || Project.employer,
            Project.year = request.body.year || Project.year,
            Project.location = request.body.location || Project.location,
            Project.client = request.body.client || Project.client,
            Project.category = request.body.category || Project.category,
            Project.projectImage = projectImageResult.secure_url || Project.projectImage

            await Project.save()

            response.status(200).json({
                "projectUpdateSuccess": "Project updated successfully!",
                "updatedProject": Project
            })

        }

        else{
            response.status(400).json({
                "ProjectUpdateError": "Project not found!"
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


// Delete a Project
const deleteProject = async(request, response) =>{
    try{
		let project_id = request.params.project_id;

		if(!mongoose.Types.ObjectId.isValid(project_id)){
			return response.status(400).json({
				"invalidId":'Something went wrong, refresh your page and try again!',
			});
		}

        const Project = await projectsModel.findOne({_id: project_id});

		if (Project){

				await Project.deleteOne()

				response.status(200).json({
					"deletedProject": `Project deleted successfully!`
				})

        }

        else{
            response.status(400).json({
                "ProjectUpdateError": "Project not found!"
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


export default { createProject, getAllProjects, getSingleProject, getProjectByCategory, updateProject, deleteProject };