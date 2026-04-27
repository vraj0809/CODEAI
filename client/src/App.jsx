import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import Navbar          from "./components/Navbar"
import ProtectedRoute  from "./components/ProtectedRoute"
import Landing         from "./pages/Landing"
import Login           from "./pages/Login"
import Register        from "./pages/Register"
import Chat            from "./pages/Chat"
import History         from "./pages/History"
import "./styles/theme.css"

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/"         element={<Landing />} />
                        <Route path="/login"    element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/chat"     element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                        <Route path="/chat/:reviewId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                        <Route path="/history"  element={<ProtectedRoute><History /></ProtectedRoute>} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App