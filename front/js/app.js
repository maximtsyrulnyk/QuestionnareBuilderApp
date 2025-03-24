document.addEventListener('DOMContentLoaded', () => {
  const quizContainer =
    document.getElementById('quizContainer')
  const createQuizBtn =
    document.getElementById('createQuizBtn')
  const prevPageBtn = document.getElementById('prevPage')
  const nextPageBtn = document.getElementById('nextPage')
  const pageInfo = document.getElementById('pageInfo')

  let currentPage = 1
  let totalPages = 1

  // Load quizzes
  function loadQuizzes(page = 1) {
    fetch(`http://localhost:5000/api/quizzes?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        currentPage = data.currentPage
        totalPages = data.totalPages
        renderQuizzes(data.quizzes)
        updatePagination()
      })
      .catch((error) =>
        console.error('Error loading quizzes:', error),
      )
  }

  // Render quizzes
  function renderQuizzes(quizzes) {
    quizContainer.innerHTML = ''

    quizzes.forEach((quiz) => {
      const quizCard = document.createElement('div')
      quizCard.className = 'quiz-card'

      quizCard.innerHTML = `
          <h3>${quiz.name}</h3>
          <p>${quiz.description}</p>
          <p>Questions: ${quiz.questions.length}</p>
          <p>Completions: ${quiz.completions}</p>
          <div class="quiz-actions">
            <button class="edit-btn" data-id="${quiz._id}">Edit</button>
            <button class="run-btn" data-id="${quiz._id}">Run</button>
            <button class="delete-btn" data-id="${quiz._id}">Delete</button>
          </div>
        `

      quizContainer.appendChild(quizCard)
    })

    // Add event listeners to buttons
    document
      .querySelectorAll('.edit-btn')
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          window.location.href = `create-quiz.html?id=${e.target.dataset.id}`
        })
      })

    document.querySelectorAll('.run-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        window.location.href = `take-quiz.html?id=${e.target.dataset.id}`
      })
    })

    document
      .querySelectorAll('.delete-btn')
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          if (
            confirm(
              'Are you sure you want to delete this quiz?',
            )
          ) {
            deleteQuiz(e.target.dataset.id)
          }
        })
      })
  }

  // Delete a quiz
  function deleteQuiz(id) {
    fetch(`http://localhost:5000/api/quizzes/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          loadQuizzes(currentPage)
        }
      })
      .catch((error) =>
        console.error('Error deleting quiz:', error),
      )
  }

  // Update pagination buttons
  function updatePagination() {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`
    prevPageBtn.disabled = currentPage === 1
    nextPageBtn.disabled = currentPage === totalPages
  }

  // Event listeners
  createQuizBtn.addEventListener('click', () => {
    window.location.href = 'create-quiz.html'
  })

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      loadQuizzes(currentPage - 1)
    }
  })

  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      loadQuizzes(currentPage + 1)
    }
  })

  // Initial load
  loadQuizzes()
})
