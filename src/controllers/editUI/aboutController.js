import aboutModel from "../../models/editUI/aboutModel.js"

// Add about the company
const addAbout = async(request, response) =>{

    try{

        const newAbout = new aboutModel({
            about : request.body.about,
        });

        const aboutUs = await newAbout.save()

        response.status(200).json({
            "successMessage": "About content added successfully!",
            "aboutContent": aboutUs
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


const getAbout = async(request, response) =>{
    try{
        const aboutUs = await aboutModel.find()

        response.status(200).json({
            "successMessage": "Successfully retrieved about rock associates!",
            "aboutContent": aboutUs[0]
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


const updateAbout = async(request, response) =>{

    try{

        const updatedAbout = await aboutModel.findOne({_id: "63e717b9d4a0df542990e995"})
        
        updatedAbout.about = request.body.about,
        
        await updatedAbout.save()

        response.status(200).json({
            "successMessage": "About content updated successfully!",
            "aboutContent": updatedAbout
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



export default { addAbout, getAbout, updateAbout }