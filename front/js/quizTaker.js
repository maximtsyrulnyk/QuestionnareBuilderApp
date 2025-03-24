document.addEventListener('DOMContentLoaded', () => {
    const quizQuestions = document.getElementById('quizQuestions');
    const submitQuizBtn = document.getElementById('submitQuizBtn');
    const quizResults = document.getElementById('quizResults');
    const resultsContainer = document.getElementById('resultsContainer');
    const timeDisplay = document.getElementById('timeDisplay');
    const timeTakenDisplay = document.getElementById('timeTaken');
    const quizTitle = document.getElementById('quizTitle');
    
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    
    let quiz = null;
    let startTime = null;
    let timerInterval = null;
    let userAnswers = {};
  
    // Load the quiz
    fetch(`http://localhost:5000/api/quizzes/${quizId}`)
      .then(response => response.json())
      .then(data => {
        quiz = data;
        quizTitle.textContent = quiz.name;
        renderQuiz();
        startTimer();
      })
      .catch(error => console.error('Error loading quiz:', error));
  
    // Render the quiz questions
    function renderQuiz() {
      quizQuestions.innerHTML = '';
      userAnswers = {};
      
      quiz.questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'quiz-question';
        questionElement.dataset.questionIndex = index;
        
        let answersHTML = '';
        
        if (question.type === 'text') {
          answersHTML = `
            <textarea class="answer-text" data-question-index="${index}" 
                      placeholder="Your answer"></textarea>
          `;
        } else if (question.type === 'single') {
          answersHTML = question.answers.map((answer, ansIndex) => `
            <div class="answer-option">
              <input type="radio" name="question-${index}" 
                     id="q${index}-a${ansIndex}" 
                     data-question-index="${index}" 
                     data-answer-index="${ansIndex}">
              <label for="q${index}-a${ansIndex}">${answer.text}</label>
            </div>
          `).join('');
        } else if (question.type === 'multiple') {
          answersHTML = question.answers.map((answer, ansIndex) => `
            <div class="answer-option">
              <input type="checkbox" 
                     id="q${index}-a${ansIndex}" 
                     data-question-index="${index}" 
                     data-answer-index="${ansIndex}">
              <label for="q${index}-a${ansIndex}">${answer.text}</label>
            </div>
          `).join('');
        }
        
        questionElement.innerHTML = `
          <h3>${index + 1}. ${question.text}</h3>
          <div class="answers">${answersHTML}</div>
        `;
        
        quizQuestions.appendChild(questionElement);
      });
  
      submitQuizBtn.style.display = 'block';
      
      // Add event listeners for answers
      document.querySelectorAll('input[type="radio"], input[type="checkbox"], textarea').forEach(input => {
        input.addEventListener('change', (e) => {
          const questionIndex = e.target.dataset.questionIndex;
          const answerIndex = e.target.dataset.answerIndex;
          
          if (quiz.questions[questionIndex].type === 'text') {
            userAnswers[questionIndex] = e.target.value;
          } else if (quiz.questions[questionIndex].type === 'single') {
            if (e.target.checked) {
              userAnswers[questionIndex] = [parseInt(answerIndex)];
            }
          } else if (quiz.questions[questionIndex].type === 'multiple') {
            if (!userAnswers[questionIndex]) {
              userAnswers[questionIndex] = [];
            }
            
            if (e.target.checked) {
              if (!userAnswers[questionIndex].includes(parseInt(answerIndex))) {
                userAnswers[questionIndex].push(parseInt(answerIndex));
              }
            } else {
              userAnswers[questionIndex] = userAnswers[questionIndex].filter(
                idx => idx !== parseInt(answerIndex)
              );
            }
          }
        });
      });
    }
  
    // Start the timer
    function startTimer() {
      startTime = new Date();
      timerInterval = setInterval(updateTimer, 1000);
      updateTimer();
    }
  
    // Update the timer display
    function updateTimer() {
      const now = new Date();
      const elapsed = Math.floor((now - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      timeDisplay.textContent = `${minutes}:${seconds}`;
    }
  
    // Submit the quiz
    submitQuizBtn.addEventListener('click', () => {
      // Validate all questions are answered
      for (let i = 0; i < quiz.questions.length; i++) {
        if (userAnswers[i] === undefined || 
            (Array.isArray(userAnswers[i]) && userAnswers[i].length === 0)) {
          alert(`Please answer question ${i + 1}`);
          return;
        }
      }
      
      clearInterval(timerInterval);
      const endTime = new Date();
      const timeTaken = Math.floor((endTime - startTime) / 1000);
      
      // Format time taken for display
      const minutes = Math.floor(timeTaken / 60);
      const seconds = timeTaken % 60;
      timeTakenDisplay.textContent = `${minutes > 0 ? minutes + ' minute' + (minutes !== 1 ? 's' : '') + ' and ' : ''}${seconds} second${seconds !== 1 ? 's' : ''}`;
      
      // Prepare answers for submission
      const answers = [];
      for (const [questionIndex, answer] of Object.entries(userAnswers)) {
        answers.push({
          questionId: quiz.questions[questionIndex]._id || questionIndex,
          answer: answer
        });
      }
      
      // Show results
      showResults(answers);
      
      // Submit to server
      fetch('http://localhost:5000/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz._id,
          answers: answers,
          timeTaken: timeTaken
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Response saved:', data);
      })
      .catch(error => {
        console.error('Error saving response:', error);
      });
    });
  
    // Show quiz results
    function showResults(answers) {
      quizQuestions.style.display = 'none';
      submitQuizBtn.style.display = 'none';
      quizResults.style.display = 'block';
      
      resultsContainer.innerHTML = '';
      
      quiz.questions.forEach((question, index) => {
        const answer = answers.find(a => 
          a.questionId === question._id || a.questionId == index);
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        
        let answerText = '';
        if (question.type === 'text') {
          answerText = answer.answer;
        } else {
          const selectedAnswers = Array.isArray(answer.answer) ? answer.answer : [answer.answer];
          answerText = selectedAnswers.map(ansIndex => 
            question.answers[ansIndex].text
          ).join(', ');
        }
        
        resultElement.innerHTML = `
          <h4>${index + 1}. ${question.text}</h4>
          <p><strong>Your answer:</strong> ${answerText || 'No answer'}</p>
        `;
        
        resultsContainer.appendChild(resultElement);
      });
    }
  });