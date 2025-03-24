document.addEventListener('DOMContentLoaded', () => {
  const questionsContainer = document.getElementById(
    'questionsContainer',
  )
  const addQuestionBtn = document.getElementById(
    'addQuestionBtn',
  )
  const saveQuizBtn = document.getElementById('saveQuizBtn')
  const backToCatalog =
    document.getElementById('backToCatalog')
  const quizName = document.getElementById('quizName')
  const quizDescription = document.getElementById(
    'quizDescription',
  )

  const urlParams = new URLSearchParams(
    window.location.search,
  )
  const quizId = urlParams.get('id')
  let questions = []

  // If editing an existing quiz, load it
  if (quizId) {
    fetch(`http://localhost:5000/api/quizzes/${quizId}`)
      .then((response) => response.json())
      .then((quiz) => {
        quizName.value = quiz.name
        quizDescription.value = quiz.description
        questions = quiz.questions
        renderQuestions()
      })
      .catch((error) =>
        console.error('Error loading quiz:', error),
      )
  }

  // Add a new question
  addQuestionBtn.addEventListener('click', () => {
    questions.push({
      text: '',
      type: 'text',
      answers: [],
    })
    renderQuestions()
  })

  // Render all questions
  function renderQuestions() {
    questionsContainer.innerHTML = ''

    questions.forEach((question, index) => {
      const questionCard = document.createElement('div')
      questionCard.className = 'question-card'

      questionCard.innerHTML = `
          <div class="question-header">
            <h3>Question ${index + 1}</h3>
            <button class="remove-question-btn" data-index="${index}">Remove</button>
          </div>
          <input type="text" class="question-text" data-index="${index}" 
                 value="${
                   question.text
                 }" placeholder="Question text">
          <select class="question-type" data-index="${index}">
            <option value="text" ${
              question.type === 'text' ? 'selected' : ''
            }>Text</option>
            <option value="single" ${
              question.type === 'single' ? 'selected' : ''
            }>Single Choice</option>
            <option value="multiple" ${
              question.type === 'multiple' ? 'selected' : ''
            }>Multiple Choice</option>
          </select>
          <div class="answers-container" data-index="${index}">
            ${
              question.type !== 'text'
                ? renderAnswers(question.answers, index)
                : ''
            }
          </div>
          ${
            question.type !== 'text'
              ? `<button class="add-answer-btn" data-index="${index}">Add Answer</button>`
              : ''
          }
        `

      questionsContainer.appendChild(questionCard)
    })

    // Add event listeners
    document
      .querySelectorAll('.question-text')
      .forEach((input) => {
        input.addEventListener('change', (e) => {
          questions[e.target.dataset.index].text =
            e.target.value
        })
      })

    document
      .querySelectorAll('.question-type')
      .forEach((select) => {
        select.addEventListener('change', (e) => {
          const index = e.target.dataset.index
          questions[index].type = e.target.value
          if (e.target.value === 'text') {
            questions[index].answers = []
          }
          renderQuestions()
        })
      })

    document
      .querySelectorAll('.remove-question-btn')
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          questions.splice(e.target.dataset.index, 1)
          renderQuestions()
        })
      })

    document
      .querySelectorAll('.add-answer-btn')
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const index = e.target.dataset.index
          questions[index].answers.push({
            text: '',
            isCorrect: false,
          })
          renderQuestions()
        })
      })

    document
      .querySelectorAll('.remove-answer-btn')
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const questionIndex =
            e.target.dataset.questionIndex
          const answerIndex = e.target.dataset.answerIndex
          questions[questionIndex].answers.splice(
            answerIndex,
            1,
          )
          renderQuestions()
        })
      })

    document
      .querySelectorAll('.answer-text')
      .forEach((input) => {
        input.addEventListener('change', (e) => {
          const questionIndex =
            e.target.dataset.questionIndex
          const answerIndex = e.target.dataset.answerIndex
          questions[questionIndex].answers[
            answerIndex
          ].text = e.target.value
        })
      })

    document
      .querySelectorAll('.answer-correct')
      .forEach((input) => {
        input.addEventListener('change', (e) => {
          const questionIndex =
            e.target.dataset.questionIndex
          const answerIndex = e.target.dataset.answerIndex

          if (questions[questionIndex].type === 'single') {
            // For single choice, only one can be selected
            questions[questionIndex].answers.forEach(
              (answer, idx) => {
                answer.isCorrect =
                  idx === parseInt(answerIndex)
              },
            )
            renderQuestions()
          } else {
            // For multiple choice, toggle the selected one
            questions[questionIndex].answers[
              answerIndex
            ].isCorrect = e.target.checked
          }
        })
      })
  }

  // Render answers for a question
  function renderAnswers(answers, questionIndex) {
    return answers
      .map(
        (answer, index) => `
        <div class="answer-item">
          <input type="text" class="answer-text" 
                 data-question-index="${questionIndex}" 
                 data-answer-index="${index}"
                 value="${answer.text}" 
                 placeholder="Answer text">
          <input type="${
            questions[questionIndex].type === 'single'
              ? 'radio'
              : 'checkbox'
          }" 
                 class="answer-correct" 
                 data-question-index="${questionIndex}" 
                 data-answer-index="${index}"
                 ${answer.isCorrect ? 'checked' : ''}>
          <button class="remove-answer-btn" 
                  data-question-index="${questionIndex}" 
                  data-answer-index="${index}">Remove</button>
        </div>
      `,
      )
      .join('')
  }

  // Save the quiz
  saveQuizBtn.addEventListener('click', () => {
    if (!quizName.value.trim()) {
      alert('Please enter a quiz name')
      return
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      if (!question.text.trim()) {
        alert(`Please enter text for question ${i + 1}`)
        return
      }

      if (
        question.type !== 'text' &&
        question.answers.length < 2
      ) {
        alert(`Question ${i + 1} needs at least 2 answers`)
        return
      }

      if (question.type !== 'text') {
        const hasCorrectAnswer = question.answers.some(
          (a) => a.isCorrect,
        )
        if (!hasCorrectAnswer) {
          alert(
            `Question ${
              i + 1
            } needs at least one correct answer`,
          )
          return
        }
      }
    }

    const quizData = {
      name: quizName.value,
      description: quizDescription.value,
      questions: questions,
    }

    const url = quizId
      ? `http://localhost:5000/api/quizzes/${quizId}`
      : 'http://localhost:5000/api/quizzes'
    const method = quizId ? 'PUT' : 'POST'

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Quiz saved successfully!')
        window.location.href = 'index.html'
      })
      .catch((error) => {
        console.error('Error saving quiz:', error)
        alert('Error saving quiz')
      })
  })

  // Back to catalog
  backToCatalog.addEventListener('click', () => {
    window.location.href = 'index.html'
  })
})
