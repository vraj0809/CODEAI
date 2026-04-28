import api from "./api"

export const sendMessage = (userprompt, reviewId = null) =>
    api.post("/api/review/getbyai", { userprompt, reviewId }).then(r => r.data)

export const getReviewById = (reviewId) =>
    api.get(`/api/review/getbyid/${reviewId}`).then(r => r.data)

export const getAllReviews = () =>
    api.get("/api/review/all").then(r => r.data)