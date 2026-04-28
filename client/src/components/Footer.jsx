import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} CodeReviewer AI. All rights reserved.</p>
                <div className="footer-links">
                    <Link to="/">Home</Link>
                    <a href="https://github.com/vraj0809/CODEAI" target="_blank" rel="noreferrer">GitHub Repo</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
