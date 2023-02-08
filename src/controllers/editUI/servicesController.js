import servicesModel from "../../models/editUI/servicesModel.js"
import servicesValidationSchema from "../../validations/editUI/servicesValidation.js"

// Add a staff Service
const addService = async(request, response) =>{

    try{
        //Validation
        const {error} = servicesValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})


        const newService = new servicesModel({
            serviceTitle : request.body.serviceTitle,
            serviceDescription : request.body.serviceDescription,
        });

        const Service = await newService.save()

        response.status(200).json({
            "successMessage": "Service added successfully!",
            "serviceContent": Service
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


const getAllServices = async(request, response) =>{
    try{
        const allServices = await servicesModel.find().sort({createdAt: -1})

        response.status(200).json({
            "successMessage": "Successfully retrieved all services!",
            "allServices": allServices
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


const getSingleService = async(request, response) =>{
    try{
        const singleService = await servicesModel.findOne({_id: request.query.serviceId});

        response.status(200).json({
            "successMessage": "Successfully retrieved the Service!",
            "singleService": singleService
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


// Add a staff Service
const updateService = async(request, response) =>{

    try{
        //Validation
        const {error} = servicesValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

        const updatedService = await servicesModel.findOne({_id: request.query.serviceId})
        
            updatedService.serviceTitle = request.body.serviceTitle,
            updatedService.serviceDescription = request.body.serviceDescription,
        
        await updatedService.save()

        response.status(200).json({
            "successMessage": "Service updated successfully!",
            "serviceContent": updatedService
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



const deleteService = async(request, response) =>{
    try{

        await servicesModel.deleteOne({_id: request.query.serviceId});

        response.status(200).json({
            "successMessage": "Service deleted successfully!"
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

export default { addService, getAllServices, getSingleService, updateService, deleteService }