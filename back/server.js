const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const quizRoutes = require('./routes/quizzes')
const responseRoutes = require('./routes/responses')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
mongoose
  .connect('mongodb://localhost:27017/quiz_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) =>
    console.error('MongoDB connection error:', err),
  )

// Routes
app.use('/api/quizzes', quizRoutes)
app.use('/api/responses', responseRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`),
)
