import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { logout } from "../services/auth.service"

const Navbar = () => {
    const { user, setUser } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 640)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleLogout = async () => {
        await logout()
        setUser(null)
        navigate("/login")
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                {isMobile ? "⚡ AI" : "⚡ CodeReviewer AI"}
            </Link>

            <div className="navbar-links">
                {user && (
                    <>
                        <Link to="/chat" className={`nav-link ${pathname.startsWith("/chat") ? "active" : ""}`}>
                            {isMobile ? "💬" : "Chat"}
                        </Link>
                        <Link to="/history" className={`nav-link ${pathname === "/history" ? "active" : ""}`}>
                            {isMobile ? "🕒" : "History"}
                        </Link>
                        <span className="nav-username">
                            {user.username}
                        </span>
                        <button onClick={handleLogout} className="nav-btn-logout">
                            {isMobile ? "🚪" : "Logout"}
                        </button>
                    </>
                )}

                <button onClick={toggleTheme} className="nav-btn-theme">
                    {theme === "light" ? (isMobile ? "🌙" : "🌙 Dark") : (isMobile ? "☀️" : "☀️ Light")}
                </button>
            </div>
        </nav>
    )
}

export default Navbar