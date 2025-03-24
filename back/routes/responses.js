const express = require('express')
const router = express.Router()
const Response = require('../models/Response')
const Quiz = require('../models/Quiz')

// Save a response
router.post('/', async (req, res) => {
  const response = new Response({
    quizId: req.body.quizId,
    answers: req.body.answers,
    timeTaken: req.body.timeTaken,
  })

  try {
    const newResponse = await response.save()

    // Increment the completion count for the quiz
    await Quiz.findByIdAndUpdate(req.body.quizId, {
      $inc: { completions: 1 },
    })

    res.status(201).json(newResponse)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get responses for a quiz
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const responses = await Response.find({
      quizId: req.params.quizId,
    })
    res.json(responses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
