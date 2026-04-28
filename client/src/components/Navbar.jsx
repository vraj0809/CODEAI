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

    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 640)
            if (window.innerWidth > 640) setMenuOpen(false)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleLogout = async () => {
        await logout()
        setUser(null)
        setMenuOpen(false)
        navigate("/login")
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                ⚡ CodeReviewer AI
            </Link>

            {isMobile ? (
                <>
                    <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? "✖" : "☰"}
                    </button>

                    {menuOpen && (
                        <div className="mobile-menu">
                            {user && (
                                <>
                                    <div className="mobile-user-info">
                                        <span className="nav-username">{user.username}</span>
                                    </div>
                                    <Link to="/chat" onClick={() => setMenuOpen(false)} className={`nav-link mobile-link ${pathname.startsWith("/chat") ? "active" : ""}`}>
                                        Chat
                                    </Link>
                                    <Link to="/history" onClick={() => setMenuOpen(false)} className={`nav-link mobile-link ${pathname === "/history" ? "active" : ""}`}>
                                        History
                                    </Link>
                                    <button onClick={handleLogout} className="nav-btn-logout mobile-logout">
                                        Logout
                                    </button>
                                </>
                            )}
                            <button onClick={() => { toggleTheme(); setMenuOpen(false); }} className="nav-btn-theme mobile-theme">
                                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="navbar-links">
                    {user && (
                        <>
                            <Link to="/chat" className={`nav-link ${pathname.startsWith("/chat") ? "active" : ""}`}>
                                Chat
                            </Link>
                            <Link to="/history" className={`nav-link ${pathname === "/history" ? "active" : ""}`}>
                                History
                            </Link>
                            <span className="nav-username">
                                {user.username}
                            </span>
                            <button onClick={handleLogout} className="nav-btn-logout">
                                Logout
                            </button>
                        </>
                    )}

                    <button onClick={toggleTheme} className="nav-btn-theme">
                        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                    </button>
                </div>
            )}
        </nav>
    )
}

export default Navbar