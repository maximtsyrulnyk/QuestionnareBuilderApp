const mongoose = require('mongoose')

const answerResponseSchema = new mongoose.Schema({
  questionId: mongoose.Schema.Types.ObjectId,
  answer: mongoose.Schema.Types.Mixed,
})

const responseSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  answers: [answerResponseSchema],
  timeTaken: Number, // in seconds
  completedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Response', responseSchema)
