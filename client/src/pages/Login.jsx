import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../services/auth.service"
import { useAuth } from "../context/AuthContext"

const Login = () => {
    const [form, setForm]     = useState({ email: "", password: "" })
    const [error, setError]   = useState("")
    const [loading, setLoading] = useState(false)
    const { setUser }         = useAuth()
    const navigate            = useNavigate()

    const handleChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const data = await login(form)
            setUser(data.user)
            navigate("/chat")
        } catch (err) {
            setError(err.response?.data?.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Sign in to continue reviewing code</p>

                {error && (
                    <p className="error-msg">{error}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="auth-footer">
                    No account?{" "}
                    <span onClick={() => navigate("/register")}>
                        Register here
                    </span>
                </p>
            </div>
        </div>
    )
}

export default Login