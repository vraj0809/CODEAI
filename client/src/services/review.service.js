import axios from "axios"
import BASE_URL from "../config/api.config"

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export const sendMessage = (userprompt, reviewId = null) =>
    api.post("/api/review/getbyai", { userprompt, reviewId }).then(r => r.data)

export const getReviewById = (reviewId) =>
    api.get(`/api/review/getbyid/${reviewId}`).then(r => r.data)

export const getAllReviews = () =>
    api.get("/api/review/all").then(r => r.data)