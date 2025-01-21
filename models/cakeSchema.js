const mongoose = require("mongoose");
const cakeSchema = mongoose.Schema({
    
    name: { 
        type: String,
         required: true 
        }, 
    image: { 
        type: String,
       // required: true 
        }, 
    price: { 
        type: Number, 
        required: true 
    }, 
    description: {
         type: String,
          required: true
         }, 
    brand: {
         type: String,
          required: true 
        }, 
  });
   

const Cake = mongoose.model("Cake",cakeSchema);  
module.exports = Cake;