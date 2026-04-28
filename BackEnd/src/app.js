const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const aiRoutes = require('./routes/ai.routes.js')
const authRouter = require('./routes/user.routes.js')

const app = express()


app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/api/review', aiRoutes)
app.use('/api/auth', authRouter)

module.exports = app