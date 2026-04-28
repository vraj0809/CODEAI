const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const aiRoutes = require('./routes/ai.routes.js')
const authRouter = require('./routes/user.routes.js')
const connectToDB = require('./config/database.js')

const app = express()

// Guarantee DB connection on every request
app.use(async (req, res, next) => {
    await connectToDB()
    next()
})
app.use(cors({
    origin: function(origin, callback) {
        callback(null, true);
    },
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