import api from "./api"

export const register = async (data) => {
    const r = await api.post("/api/auth/register", data)
    if (r.data.token) {
        localStorage.setItem("token", r.data.token)
    }
    return r.data
}

export const login = async (data) => {
    const r = await api.post("/api/auth/login", data)
    if (r.data.token) {
        localStorage.setItem("token", r.data.token)
    }
    return r.data
}

export const logout = async () => {
    localStorage.removeItem("token")
    const r = await api.post("/api/auth/logout")
    return r.data
}

export const getMe = () =>
    api.get("/api/auth/get-me").then(r => r.data)