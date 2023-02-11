import testimonialModel from "../../models/editUI/testimonialModel.js";
import testimonialValidationSchema from "../../validations/editUI/testimonialValidation.js";
import cloudinary from "../../helpers/cloudinary.js";

// Add a testimonial
const addTestimonial = async(request, response) =>{

    try{
        //Validation
        const {error} = testimonialValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

        const ImageResult = await cloudinary.uploader.upload(request.body.image, {
            folder: "Rock Associates's Images"
        })

        const newTestimonial = new testimonialModel({
            name : request.body.name,
            location : request.body.location,
            testimonial : request.body.testimonial,
            image : ImageResult.secure_url,
        });

        const Testimonial = await newTestimonial.save()

        response.status(200).json({
            "successMessage": "Testimonial added successfully!",
            "testimonialContent": Testimonial
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


const getAllTestimonials = async(request, response) =>{
    try{
        const allTestimonials = await testimonialModel.find()

        response.status(200).json({
            "successMessage": "Successfully retrieved all the testimonials!",
            "allTestimonials": allTestimonials
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


const getSingleTestimonial = async(request, response) =>{
    try{
        const singleTestimonial = await testimonialModel.findOne({_id: request.query.testimonialId});

        response.status(200).json({
            "successMessage": "Successfully retrieved the testimonial!",
            "fetchedTestimonial": singleTestimonial
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


// Add a testimonial Testimonial
const updateTestimonial = async(request, response) =>{

    try{
        //Validation
        const {error} = testimonialValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

        const updatedTestimonial = await testimonialModel.findOne({_id: request.query.testimonialId})

        if (request.body.image) {
            const ImageResult = await cloudinary.uploader.upload(request.body.image, {
              folder: "Rock Associates's Images"
            });

            updatedTestimonial.name = request.body.name,
            updatedTestimonial.location = request.body.location,
            updatedTestimonial.testimonial = request.body.testimonial,
            updatedTestimonial.image = ImageResult.secure_url

          } else {
            updatedTestimonial.name = request.body.name,
            updatedTestimonial.location = request.body.location,
            updatedTestimonial.testimonial = request.body.testimonial
            
          }

        await updatedTestimonial.save()

        response.status(200).json({
            "successMessage": "Testimonial updated successfully!",
            "testimonialContent": updatedTestimonial
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



const deleteTestimonial = async(request, response) =>{
    try{

        await testimonialModel.deleteOne({_id: request.query.testimonialId});

        response.status(200).json({
            "successMessage": "Testimonial deleted successfully!"
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

export default { addTestimonial, getAllTestimonials, getSingleTestimonial, updateTestimonial, deleteTestimonial }