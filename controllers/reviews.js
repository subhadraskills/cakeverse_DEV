const { required } = require("joi");
const Cake=require("../models/cake");
const Review =require("../models/review");



module.exports.createReview=async (req,res) =>{
       
    let cake=await Cake.findById(req.params.id);
    let newReview=new Review(req.body.review);
   newReview.author=req.user._id;

    cake.reviews.push(newReview);

    await newReview.save();
    await cake.save();
    req.flash("success", "New Review Created!"); 
   
    res.redirect(`/cakes/${cake._id}`);

};


module.exports.destroyReview=async (req, res) =>{
    let { id, reviewId } = req.params;

    await Cake.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "New Cake Deleted!"); 
    res.redirect(`/cakes/${id}`);
};