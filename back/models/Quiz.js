const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
})

const questionSchema = new mongoose.Schema({
  text: String,
  type: {
    type: String,
    enum: ['text', 'single', 'multiple'],
  },
  answers: [answerSchema],
})

const quizSchema = new mongoose.Schema({
  name: String,
  description: String,
  questions: [questionSchema],
  completions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Quiz', quizSchema)
