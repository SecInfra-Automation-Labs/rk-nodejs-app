const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;

const db = mysql.createConnection({
  host: '192.168.56.6',
  user: 'nodeuser',
  password: 'nodepass',
  database: 'nodeappdb'
});

db.connect(err => { if(err) console.error(err); else console.log('Connected to MySQL'); });
db.query('CREATE TABLE IF NOT EXISTS messages (id INT AUTO_INCREMENT PRIMARY KEY, text VARCHAR(255))');

app.get('/', (req, res) => {
  db.query('SELECT * FROM messages', (err, results) => {
    if(err) res.status(500).send('DB error');
    else res.send(results.length ? results.map(r => r.text).join(', ') : 'No messages yet.');
  });
});

app.get('/add/:msg', (req, res) => {
  db.query('INSERT INTO messages (text) VALUES (?)', [req.params.msg], err => {
    if(err) res.status(500).send('Insert failed'); else res.send('Message added!');
  });
});

app.listen(port,'0.0.0.0', () => console.log(`App running on http://0.0.0.0:${port}`));
