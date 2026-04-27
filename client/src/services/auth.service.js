import axios from "axios"
import BASE_URL from "../config/api.config"

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export const register = (data) =>
    api.post("/api/auth/register", data).then(r => r.data)

export const login = (data) =>
    api.post("/api/auth/login", data).then(r => r.data)

export const logout = () =>
    api.post("/api/auth/logout").then(r => r.data)

export const getMe = () =>
    api.get("/api/auth/me").then(r => r.data)