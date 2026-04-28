import axios from "axios"
import BASE_URL from "../config/api.config"

const api = axios.create({
    baseURL: BASE_URL,
})

// Request interceptor to add the Bearer token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

export default api
