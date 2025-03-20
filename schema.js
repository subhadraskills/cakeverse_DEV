const Joi = require('joi');

module.exports.cakeSchema = Joi.object({
   cake: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
       
        brand: Joi.string().required(),
       
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().uri().optional().allow('', null),  // Make url optional, and allow empty or null
        }).optional()  
    }).required(),
});



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});

