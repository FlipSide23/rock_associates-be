import staffModel from "../../models/editUI/staffModel.js"
import staffValidationSchema from "../../validations/editUI/staffValidation.js"
import cloudinary from "../../helpers/cloudinary.js";

// Add a staff member
const addMember = async(request, response) =>{

    try{
        //Validation
        const {error} = staffValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

        const ImageResult = await cloudinary.uploader.upload(request.body.image, {
            folder: "Rock Associates's Images"
        })

        const newMember = new staffModel({
            name : request.body.name,
            position : request.body.position,
            facebookProfile : request.body.facebookProfile,
            linkedlinProfile : request.body.linkedlinProfile,
            twitterProfile : request.body.twitterProfile,
            image : ImageResult.secure_url,
        });

        const staffMember = await newMember.save()

        response.status(200).json({
            "successMessage": "Staff member added successfully!",
            "staffContent": staffMember
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


const getAllMembers = async(request, response) =>{
    try{
        const staffMembers = await staffModel.find()

        response.status(200).json({
            "successMessage": "Successfully retrieved all the staff members!",
            "allStaffMembers": staffMembers
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


const getSingleMember = async(request, response) =>{
    try{
        const staffMember = await staffModel.findOne({_id: request.query.memberId});

        response.status(200).json({
            "successMessage": "Successfully retrieved the staff member!",
            "staffMember": staffMember
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


// Add a staff member
const updateMember = async(request, response) =>{

    try{
        //Validation
        const {error} = staffValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

        const ImageResult = await cloudinary.uploader.upload(request.body.image, {
            folder: "Rock Associates's Images"
        })

        const updatedMember = await staffModel.findOne({_id: request.query.memberId})
        
            updatedMember.name = request.body.name,
            updatedMember.position = request.body.position,
            updatedMember.facebookProfile = request.body.facebookProfile,
            updatedMember.linkedlinProfile = request.body.linkedlinProfile,
            updatedMember.twitterProfile = request.body.twitterProfile,
            updatedMember.image = ImageResult.secure_url,
        
        await updatedMember.save()

        response.status(200).json({
            "successMessage": "Staff member updated successfully!",
            "staffContent": updatedMember
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



const deleteMember = async(request, response) =>{
    try{

        await staffModel.deleteOne({_id: request.query.memberId});

        response.status(200).json({
            "successMessage": "Staff member deleted successfully!"
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

export default { addMember, getAllMembers, getSingleMember, updateMember, deleteMember }