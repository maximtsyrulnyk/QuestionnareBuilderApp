const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Підключення до бази даних
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // замініть на вашого користувача
    password: 'your_password', // замініть на ваш пароль
    database: 'questionnaire_builder'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Приклад маршруту для отримання анкет
app.get('/api/questionnaires', (req, res) => {
    const sql = 'SELECT * FROM questionnaires';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
