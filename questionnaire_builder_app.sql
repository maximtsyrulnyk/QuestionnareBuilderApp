CREATE DATABASE questionnaire_app;
USE questionnaire_app;

-- Таблиця опитувань
CREATE TABLE questionnaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    questions_count INT DEFAULT 0,
    completions_count INT DEFAULT 0
);

-- Таблиця питань
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    questionnaire_id INT,
    question_text TEXT NOT NULL,
    question_type ENUM('text', 'single_choice', 'multiple_choice') NOT NULL,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE
);

-- Таблиця варіантів відповідей для питань
CREATE TABLE answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT,
    answer_text TEXT,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Таблиця відповідей користувачів
CREATE TABLE responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    questionnaire_id INT,
    completion_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE
);

-- Таблиця відповідей користувачів на конкретні питання
CREATE TABLE response_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    response_id INT,
    question_id INT,
    answer_text TEXT,
    FOREIGN KEY (response_id) REFERENCES responses(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);