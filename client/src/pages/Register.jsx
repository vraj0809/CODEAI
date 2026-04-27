import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../services/auth.service"

const Register = () => {
    const [form, setForm]       = useState({ username: "", email: "", password: "" })
    const [error, setError]     = useState("")
    const [loading, setLoading] = useState(false)
    const navigate              = useNavigate()

    const handleChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            await register(form)
            navigate("/login")
        } catch (err) {
            setError(err.response?.data?.message || "Register failed")
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { name: "username", type: "text",     label: "Username",  placeholder: "johndoe" },
        { name: "email",    type: "email",    label: "Email",     placeholder: "you@example.com" },
        { name: "password", type: "password", label: "Password",  placeholder: "••••••••" },
    ]

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Start reviewing your code with AI</p>

                {error && (
                    <p className="error-msg">{error}</p>
                )}

                <form onSubmit={handleSubmit}>
                    {fields.map(field => (
                        <div key={field.name} className="input-group">
                            <label>{field.label}</label>
                            <input
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                value={form[field.name]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Registering..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have account?{" "}
                    <span onClick={() => navigate("/login")}>
                        Login here
                    </span>
                </p>
            </div>
        </div>
    )
}

export default Register