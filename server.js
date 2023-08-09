require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');


const app = express();
app.set('view engine', 'ejs');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// MySQL configuration
const db = mysql.createConnection({
    // host: 'localhost',
    // user: 'demo',
    // password: '1234',
    // database: 'school'

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE


});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});


// Serve the HTML form
app.get('/', (req, res) => {
    res.render('index');
});


// Handle form submission
app.post('/submit', (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    
    const sql = 'INSERT INTO userdata (name, age) VALUES (?, ?)';
    db.query(sql, [name, age], (err, result) => {
        if (err) {
            console.error('Error inserting into MySQL:', err);
            res.send('Error inserting data');
        } else {
            console.log('Data inserted into MySQL:', result);
            // res.send('Data inserted successfully'); 
            res.redirect('/users');
        }
    });
});


// Display a list of users
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM userdata';
    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.send('Error fetching data');
        } else {
            res.render('users', { users: rows });
        }
    });
});

// Display edit form for a specific user
app.get('/edit/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM userdata WHERE id = ?';
    db.query(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.send('Error fetching data');
        } else {
            res.render('edit', { user: rows[0] });
        }
    });
});

// Handle edit form submission
app.post('/update/:id', (req, res) => {
    const userId = req.params.id;
    const newName = req.body.name;
    const newAge = req.body.age;
    
    const sql = 'UPDATE userdata SET name = ?, age = ? WHERE id = ?';
    db.query(sql, [newName, newAge, userId], (err, result) => {
        if (err) {
            console.error('Error updating data in MySQL:', err);
            res.send('Error updating data');
        } else {
            res.redirect('/users');
        }
    });
});

//Delete data
app.get('/delete/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM userdata WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error deleting data from MySQL:', err);
            res.send('Error deleting data');
        } else {
            res.redirect('/users');
        }
    });
});



//404 page
app.get('*', (req, res) => {
    res.send('Go back to <a href="/">home page</a>');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
