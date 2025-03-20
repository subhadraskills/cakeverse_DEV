const Cake = require("./models/cake"); 
const Review=require("./models/review");

const ExpressError = require("./utils/ExpressError.js");
const { cakeSchema , reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
   
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "you must be logged in to create cake!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
    };


    module.exports.isOwner= async(req, res, next)=>{
        let { id } = req.params;
        let cake =await Cake.findById(id);
        if(!cake.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "you are not the owner of this cake");
           return  res.redirect(`/cakes/${id}`);
        }
        next();
  
    };
    module.exports.validateCake = (req, res, next) => {
        if (req.method === "DELETE") return next(); 
        const { error } = cakeSchema.validate(req.body);
        if (error) {
            const errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        }
        next();
    };
    
    
    module.exports. validateReview =(req,res,next )=> {
        let {error}= reviewSchema.validate(res.body);
       
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
         throw new ExpressError(400, errMsg);
        }else {
            next();
        }
    
        };
    
        
        module.exports.isReviewAuthor= async(req, res, next)=>{
            let { id,reviewId } = req.params;
            let review =await Review.findById(reviewId);
            if(!review.author.equals(res.locals.currUser._id)) {
                req.flash("error", "you are not the author of this review");
               return  res.redirect(`/cakes/${id}`);
            }
            next();
      
        };
        
    


  
  
    