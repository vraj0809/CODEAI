import { createContext, useContext, useEffect, useState } from "react"
import { getMe } from "../services/auth.service"

export const AuthContext = createContext()  

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMe()
            .then(data => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)