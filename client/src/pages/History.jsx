import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllReviews, getReviewById } from "../services/review.service"

const History = () => {
    const [reviews, setReviews]   = useState([])
    const [loading, setLoading]   = useState(true)
    const navigate                = useNavigate()

    useEffect(() => {
        getAllReviews()
            .then(data => setReviews(data.reviews || []))
            .catch(() => setReviews([]))
            .finally(() => setLoading(false))
    }, [])

    const handleClick = (reviewId) => {
        navigate(`/chat/${reviewId}`)
    }

    if (loading) return (
        <div style={{ padding: "2rem", color: "var(--text-secondary)" }}>
            Loading history...
        </div>
    )

    return (
        <div className="history-container">
            <h2>Review History</h2>

            {reviews.length === 0 && (
                <p style={{ color: "var(--text-secondary)" }}>
                    No reviews yet. Start by pasting your code!
                </p>
            )}

            <div className="history-list">
                {reviews.map(review => (
                    <div
                        key={review._id}
                        onClick={() => handleClick(review._id)}
                        className="history-card"
                    >
                        <div>
                            <p className="title">
                                {review.title}
                            </p>
                            <p className="meta">
                                {new Date(review.createdAt).toLocaleDateString()} —{" "}
                                {review.chatHistory?.length || 0} messages
                            </p>
                        </div>
                        <span className="arrow">→</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default History