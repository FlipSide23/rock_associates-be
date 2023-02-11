import experienceModel from "../../models/editUI/experienceModel.js"

// Add about the company
const addExperience = async(request, response) =>{

    try{

        const newExperience = new experienceModel({
            yearsOfExperience : request.body.yearsOfExperience,
        });

        const yearsOfExperience = await newExperience.save()

        response.status(200).json({
            "successMessage": "Years of experience added successfully!",
            "experienceContent": yearsOfExperience
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


const getExperience = async(request, response) =>{
    try{
        const yearsOfExperience = await experienceModel.find()

        response.status(200).json({
            "successMessage": "Years of experience retrieved successfully!",
            "experienceContent": yearsOfExperience[0]
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


const updateExperience = async(request, response) =>{

    try{

        const updatedExperience = await experienceModel.findOne({_id: "63e715bcc00f5e1a1ac08f52"})
        
        updatedExperience.yearsOfExperience = request.body.yearsOfExperience,
        
        await updatedExperience.save()

        response.status(200).json({
            "successMessage": "Years of experience updated successfully!",
            "experienceContent": updatedExperience
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



export default { addExperience, getExperience, updateExperience }