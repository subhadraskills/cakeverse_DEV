const express = require("express");
const router = express.Router();

// Define routes
router.get("/", (req, res) => {
    res.send("All cakes");
});

module.exports = router; // Ensure this line exists
