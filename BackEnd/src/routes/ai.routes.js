const express = require('express');
const aiController = require("../controllers/ai.controller")
const authMiddleware = require("../middlewares/auth.middleware.js")
const router = express.Router();


router.post("/getbyai",authMiddleware.authUser, aiController.getReview)
router.get("/getbyid/:id",authMiddleware.authUser, aiController.getReviewById) 
router.get("/all", authMiddleware.authUser, aiController.getAllReviews)
module.exports = router; 