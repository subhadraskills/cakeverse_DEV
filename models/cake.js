const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const cakeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    image: { 
        url: String, 
        filename: String, 
    },
    price: Number,
    brand: String,

    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

});


cakeSchema.post("findOneAndDelete", async (cake) => {
if(cake){
    await Review.deleteMany({ _id: { $in: cake.reviews}});
}

});


const Cake = mongoose.model("Cake", cakeSchema);  
module.exports = Cake;
