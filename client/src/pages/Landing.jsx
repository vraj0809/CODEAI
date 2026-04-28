import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"

const Landing = () => {
    const navigate = useNavigate()

    return (
        <>
            <div className="landing-container">
                <h1 className="landing-title">
                    CodeReviewer AI
                </h1>

                <p className="landing-subtitle">
                    Paste your code and get instant AI-powered review.
                    Find bugs, improve quality and get a score — all in seconds.
                </p>

                <div className="landing-features">
                    {["🔍 Bug Detection", "✨ Better Code", "📝 Chat History"].map(f => (
                        <span key={f} className="feature-pill">
                            {f}
                        </span>
                    ))}
                </div>

                <button onClick={() => navigate("/register")} className="landing-cta">
                    Get Started Free →
                </button>

                <p className="landing-link">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")}>
                        Login here
                    </span>
                </p>
            </div>
            <Footer />
        </>
    )
}

export default Landing