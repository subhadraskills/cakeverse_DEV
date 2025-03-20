const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Cake = require("../models/cake.js");
const { isLoggedIn, isOwner ,validateCake} = require("../middleware.js");


const cakeController = require("../controllers/cakes.js");
const multer=require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router
.route("/")
.get( wrapAsync(cakeController.index))
.post(
    isLoggedIn,
   upload.single("cake[image]"),
   validateCake,
     wrapAsync(cakeController.createCake)
    );


// New Route 
router.get("/new", isLoggedIn, cakeController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(cakeController.showCake))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("cake[image]"),
        validateCake, 
        wrapAsync(cakeController.updateCake)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(cakeController.destroyCake) 
    );


// Edit Route 
router.get(
    "/:id/edit", 
    isLoggedIn,
    isOwner,
     wrapAsync(cakeController.renderEditForm)
    );



module.exports = router;