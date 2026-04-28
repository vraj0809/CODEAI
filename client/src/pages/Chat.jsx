import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { sendMessage, getReviewById } from "../services/review.service"

const getScoreColor = (score) => {
    if (score >= 80) return "var(--score-good)"
    if (score >= 50) return "var(--score-mid)"
    return "var(--score-bad)"
}

const Chat = () => {
    const [chatHistory, setChatHistory] = useState([])
    const [reviewId, setReviewId]       = useState(null)
    const [prompt, setPrompt]           = useState("")
    const [loading, setLoading]         = useState(false)
    const [fetching, setFetching]       = useState(false)
    const [isMobile, setIsMobile]       = useState(window.innerWidth <= 640)
    const bottomRef                     = useRef(null)
    const textareaRef                   = useRef(null)
    const { reviewId: paramReviewId }   = useParams()

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 640)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // load old chat if came from history
    useEffect(() => {
        if (paramReviewId) {
            setFetching(true)
            getReviewById(paramReviewId)
                .then(data => {
                    setReviewId(data.reviewId)
                    setChatHistory(data.chatHistory)
                })
                .catch(() => {})
                .finally(() => setFetching(false))
        }
    }, [paramReviewId])

    // auto scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatHistory, loading])

    // auto-resize textarea to fit content
    const autoResize = () => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 200) + 'px'
    }

    const handleSend = async () => {
        if (!prompt.trim() || loading) return

        const userMessage = prompt.trim()
        setPrompt("")
        setLoading(true)

        // reset textarea height after sending
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }

        // add user message to UI immediately
        setChatHistory(prev => [...prev, {
            role:    "user",
            message: userMessage,
            score:   null
        }])

        try {
            const data = await sendMessage(userMessage, reviewId)

            setReviewId(data.reviewId)

            setChatHistory(prev => {
                const updated = [...prev]

                // update score on last user message if exists
                if (data.userScore !== null) {
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        score: data.userScore
                    }
                }

                // push AI reply
                updated.push({
                    role:    "assistant",
                    message: data.reply,
                    score:   data.aiScore || null
                })

                return updated
            })

        } catch (err) {
            setChatHistory(prev => [...prev, {
                role:    "assistant",
                message: "Something went wrong. Please try again.",
                score:   null
            }])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleNewChat = () => {
        setChatHistory([])
        setReviewId(null)
        setPrompt("")
    }

    if (fetching) return (
        <div style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            height:         "calc(100vh - 64px)",
            color:          "var(--text-secondary)"
        }}>
            Loading chat...
        </div>
    )

    return (
        <div className="chat-container">

            {/* top bar */}
            <div className="chat-topbar">
                <span>
                    {reviewId ? "Continuing review..." : "New review"}
                </span>

                <button onClick={handleNewChat} className="chat-new-btn">
                    + New Chat
                </button>
            </div>

            {/* messages area */}
            <div className="chat-messages">

                {chatHistory.length === 0 && (
                    <div className="chat-empty">
                        <div className="emoji">👨‍💻</div>
                        <p className="title">Paste your code below</p>
                        <p className="desc">
                            Get instant AI review with score and improvements
                        </p>
                    </div>
                )}

                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={`msg-wrapper ${msg.role === "user" ? "user" : "ai"}`}
                    >
                        {/* role label */}
                        <span className="msg-label">
                            {msg.role === "user" ? "You" : "AI Reviewer"}
                        </span>

                        {/* message bubble */}
                        <div className={`msg-bubble ${msg.role === "user" ? "user-bubble" : "ai-bubble"}`}>
                            {msg.message}
                        </div>
                    </div>
                ))}

                {/* loading bubble */}
                {loading && (
                    <div className="msg-wrapper ai">
                        <span className="msg-label">AI Reviewer</span>
                        <div className="msg-bubble ai-bubble">
                            Reviewing your code... ⏳
                        </div>
                    </div>
                )}

                {/* auto scroll anchor */}
                <div ref={bottomRef} />
            </div>

            {/* input area */}
            <div className="chat-input-area">
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={e => { setPrompt(e.target.value); autoResize() }}
                    onKeyDown={handleKeyDown}
                    placeholder={isMobile ? "Paste code or ask a question..." : "Paste your code or ask a question... (Enter to send, Shift+Enter for new line)"}
                    rows={1}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !prompt.trim()}
                    className="chat-send-btn"
                >
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    )
}

export default Chat