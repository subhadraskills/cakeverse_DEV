if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); 
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");

const Cake = require("./models/cakeSchema.js");
const User = require("./models/user.js");
const cakeRouter = require("./routes/cake.js");
const userRouter = require("./routes/user.js");




// const MONGO_URL = "mongodb://127.0.0.1:27017/cakeverse";

const dbUrl = process.env.ATLASDB_URL;  


// main()
//     .then(() => {
//         console.log("connected to DB");
//     })
//     .catch((err) => {
//         console.log("Error connecting to DB: ", err);
//     });


//   async function main(){
// await mongoose.connect(dbUrl);
//   }


async function main(){
  try {
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout for connection
    });
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to DB: ", err.message);
  }
}
main();
    
  
// Set up EJS and view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
const sessionOptions = {
  secret: "process.env.SECRET",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages and current user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/", cakeRouter);
app.use("/", userRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to CakeVerse!");
});




// // Index Route

// app.get("/cakes", async (req, res) => {
// const allcakes = await Cake.find({}); // Fetch cakes from the database
// res.render("cakes/index", { allcakes }); // Render the correct view
    
// });


app.get("/cakes", async (req, res) => {
  try {
    const allcakes = await Cake.find({});
    res.render("cakes/index", { allcakes });
  } catch (err) {
    console.log("Error fetching cakes:", err);
    req.flash("error", "Something went wrong while fetching cakes.");
    res.redirect("/cakes");
  }
});


//New Route
app.get("/cakes/new",(req,res) =>{
    if(!req.isAuthenticated()) {
        req.flash("error","you must be logged in to create cake!");
         return res.redirect("/login");
    }
    res.render("cakes/new.ejs");
});

//show Route
app.get("/cakes/:id",async(req,res)=>{
    let {id}=req.params;
    const cake =await Cake.findById(id);
    res.render("cakes/show.ejs", {cake});
});

//create Route
app.post("/cakes", async (req, res) => {
        const newCake = new Cake(req.body.cake); 
        await newCake.save();
        res.redirect("/cakes");  
});

//Edit Route
app.get("/cakes/:id/edit",async(req,res)=>{
    let { id } =req.params;
    const cake =await Cake.findById(id);
    res.render("cakes/edit.ejs", {cake});
});


// Update Route
app.put("/cakes/:id", async (req, res) => {
    let { id } = req.params;
    await Cake.findByIdAndUpdate(id, {...req.body.cake});
    res.redirect(`/cakes/${id}`);
});

//Delete Route
app.delete("/cakes/:id", async (req, res) => {
    let { id } = req.params;
    let deletedCake = await Cake.findByIdAndDelete(id);
    console.log(deletedCake);
    res.redirect("/cakes");
});


//start the server
app.listen(8080, ()=>{
    console.log("server is listing to port 8080")
});