const Cake = require("../models/cake"); 



module.exports.index = async (req, res) => {
    const allCakes = await Cake.find({});
    res.render("cakes/index.ejs", { allCakes });
};


module.exports.renderNewForm=(req, res) => {
    res.render("cakes/new.ejs");
};


module.exports.showCake= async (req, res) => {
    let { id } = req.params;
    const cake = await Cake.findById(id)
    .populate({
        path:"reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");

    if (!cake) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/cakes");  
    }
    console.log(cake);
    res.render("cakes/show.ejs", { cake });
};




module.exports.createCake=async(req,res) => {
    let url =req.file.path;
    let filename=req.file.filename;
    
    const newCake = new Cake(req.body.cake);
    newCake.owner=req.user._id;
    newCake.image= {url,filename};
    await newCake.save();
  req.flash("success", "New CakeCreated!");
  res.redirect("/cakes");
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const cake = await Cake.findById(id);
    if (!cake) {
        req.flash("error", "Cake you requested for does not exist!"); 
        res.redirect("/cakes"); 
        
    }
    let originalImageUrl = cake.image.url;
    originalImageUrl = originalImageUrl.replace("upload","upload/w_250");
    res.render("cakes/edit.ejs", {cake, originalImageUrl });
};



module.exports.updateCake= async (req, res) => {
    let { id } = req.params;
   
    let cake=await Cake.findByIdAndUpdate(id, { ...req.body.cake });

    if(typeof req.file !=="undefined") {
      let url =req.file.path;
      let filename=req.file.filename;
      cake.image = {url, filename};
      await cake.save();
    }
    req.flash("success", "Cake Updated!");
    res.redirect(`/cakes/${id}`);  
};


module.exports.destroyCake=async (req, res) => {
    let { id } = req.params;
   let deletedCake= await Cake.findByIdAndDelete(id);
   console.log(deletedCake);
    req.flash("success", "CakeDeleted!");
    res.redirect("/cakes");  
};