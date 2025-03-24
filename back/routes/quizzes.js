const express = require('express')
const router = express.Router()
const Quiz = require('../models/Quiz')

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const quizzes = await Quiz.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const count = await Quiz.countDocuments()

    res.json({
      quizzes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create a new quiz
router.post('/', async (req, res) => {
  const quiz = new Quiz({
    name: req.body.name,
    description: req.body.description,
    questions: req.body.questions,
  })

  try {
    const newQuiz = await quiz.save()
    res.status(201).json(newQuiz)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get a single quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz)
      return res
        .status(404)
        .json({ message: 'Quiz not found' })
    res.json(quiz)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update a quiz
router.put('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz)
      return res
        .status(404)
        .json({ message: 'Quiz not found' })

    quiz.name = req.body.name || quiz.name
    quiz.description =
      req.body.description || quiz.description
    quiz.questions = req.body.questions || quiz.questions

    const updatedQuiz = await quiz.save()
    res.json(updatedQuiz)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete a quiz
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id)
    if (!quiz)
      return res
        .status(404)
        .json({ message: 'Quiz not found' })
    res.json({ message: 'Quiz deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Increment completion count
router.patch('/:id/completed', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { $inc: { completions: 1 } },
      { new: true },
    )
    if (!quiz)
      return res
        .status(404)
        .json({ message: 'Quiz not found' })
    res.json(quiz)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
