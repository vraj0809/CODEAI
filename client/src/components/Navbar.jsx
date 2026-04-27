import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { logout } from "../services/auth.service"

const Navbar = () => {
    const { user, setUser } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const handleLogout = async () => {
        await logout()
        setUser(null)
        navigate("/login")
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                ⚡ CodeReviewer AI
            </Link>

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
        </nav>
    )
}

export default Navbar