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
        // .sort({createdAt: -1});

        response.status(200).json({
            "status": "Successfully retrieved all the staff members!",
            "staffMembers": staffMembers
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

export default { addMember, getAllMembers }