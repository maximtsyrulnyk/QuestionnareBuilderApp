const mysql = require('mysql2')
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'questionnaire_app',
})

db.connect((err) => {
  if (err) throw err
  console.log('MySQL connected...')
})
