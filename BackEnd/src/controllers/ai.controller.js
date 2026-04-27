const aiService = require("../services/ai.service")
const CodeReview = require("../models/history.model.js")

module.exports.getReview = async (req, res) => {
    try {
        const { userprompt, reviewId } = req.body
        const userId = req.user.id

        if (!userprompt) {
            return res.status(400).json({ message: "Prompt is required" })
        }

        let review
        let isNewChat = false

        if (reviewId) {
            review = await CodeReview.findById(reviewId)
            if (!review) {
                return res.status(404).json({ message: "Review not found" })
            }
            review.chatHistory.push({
                role:    "user",
                message: userprompt
            })
        } else {
            isNewChat = true
            review = await CodeReview.create({
                title: "Untitled Review",
                userId,
                chatHistory: [{
                    role:    "user",
                    message: userprompt
                }]
            })
        }

        const last10 = review.chatHistory
            .slice(-10)
            .map(msg => ({
                role:    msg.role,
                content: msg.message
            }))

        const aiReply = await aiService(userprompt, isNewChat ? [] : last10)

        if (isNewChat) {
            review.title = aiReply.title || userprompt.substring(0, 30) + "..."
        }

        review.chatHistory.push({
            role:    "assistant",
            message: aiReply.message
        })

        await review.save()

        res.status(200).json({
            reviewId: review._id,
            title:    review.title,
            reply:    aiReply.message
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.getReviewById = async (req, res) => {
    try {
        const review = await CodeReview.findById(req.params.id)
        if (!review) {
            return res.status(404).json({ message: "Review not found" })
        }
        res.status(200).json({
            reviewId:    review._id,
            title:       review.title,
            chatHistory: review.chatHistory
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await CodeReview.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .select("title createdAt chatHistory")
        res.status(200).json({ reviews })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}