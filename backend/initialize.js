const mongoose = require("mongoose"); 
const  data=require("./data.js");
const cakeSchema= require("../models/cakeSchema.js");



const MONGO_URL="mongodb://127.0.0.1:27017/cakeverse"

// connect to MongoDB
main()
.then(() => {
    console.log("connect to DB");
})
.catch((err) => {
    console.log(err);
});

// start the server
async function main() {
    await mongoose.connect(MONGO_URL);
    
}


const initData = async () => {
    try {
      await cakeSchema.deleteMany({}); // Delete all existing cakes
      await cakeSchema.insertMany(data); // Insert new cakes from data.js
      console.log("Data was initialized successfully!");
    } catch (err) {
      console.error("Error initializing data:", err);
    }
  };
  




initData();