const mongoose = require("mongoose"); 
const  initData=require("./data.js");
const Cake= require("../models/cake.js");



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


const initDB = async () => {
    
  await Cake.deleteMany({});
  initData.data= initData.data.map((obj) => ({
      ...obj,owner: "6751e5d4e2376f7df2621f42"
  }));
  await Cake.insertMany(initData.data);
  console.log("Data was initialized");
  };
  




initDB();