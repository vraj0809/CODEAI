const mongoose = require("mongoose")

const chatMessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    // score: {
    //     type: Number,
    //     min: 0,
    //     max: 100,
    //     default: null
    // }
}, { _id: false })

const codeReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Untitled Review"  
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true              
    },
    chatHistory: [chatMessageSchema]
}, { timestamps: true })

module.exports = mongoose.model("CodeReview", codeReviewSchema)