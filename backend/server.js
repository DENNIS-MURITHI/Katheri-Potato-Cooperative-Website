const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const db = require('./db'); 
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON a
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Ensure the database and table are created
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL.');
    connection.release(); 
});

// Fetch sales data endpoint
app.get('/api/sales-data', (req, res) => {
    const sql = 'SELECT potatoType, SUM(quantity) AS quantity FROM sales GROUP BY potatoType';
    pool.query(sql, (error, results) => {
        if (error) return res.status(500).json({ message: 'Error fetching sales data.' });
        res.json(results);
    });
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { full_name, email, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10); 

        const sql = 'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)';
        pool.query(sql, [full_name, email, hash], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error registering user. Email may already be in use.' });
            }
            res.status(201).json({ message: 'User registered successfully.' });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user.' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        pool.query(sql, [email], (error, results) => {
            if (error || results.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            const user = results[0];
            bcrypt.compare(password, user.password, (err, match) => {
                if (err || !match) {
                    return res.status(401).json({ message: 'Invalid email or password.' });
                }

                // Return user details with the login response
                res.status(200).json({ message: 'Login successful.', user: { full_name: user.full_name, email: user.email } });
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in.' });
    }
});

// Endpoint to handle potato purchase
app.post('/api/buy', (req, res) => {
    const { email, potatoType, quantity, totalPrice } = req.body;

    const sql = 'INSERT INTO transactions (email, potatoType, quantity, totalPrice) VALUES (?, ?, ?, ?)';
    pool.query(sql, [email, potatoType, quantity, totalPrice], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error processing purchase.' });
        }
        res.status(201).json({ message: 'Purchase successful.' });
    });
});

// Endpoint to handle potato seed sale
app.post('/api/sell-seeds', (req, res) => {
    const { email, seedType, quantity, totalPrice } = req.body;

    const sql = 'INSERT INTO sales (email, potatoType, quantity, totalPrice) VALUES (?, ?, ?, ?)';
    pool.query(sql, [email, seedType, quantity, totalPrice], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error processing seed sale.' });
        }
        res.status(201).json({ message: 'Seed sale recorded successfully.' });
    });
});

// Endpoint to handle training booking
app.post('/api/book-training', (req, res) => {
    const { email, trainingType, trainingTime } = req.body;

    const sql = 'INSERT INTO training (email, training_type, training_time) VALUES (?, ?, ?)';
    pool.query(sql, [email, trainingType, trainingTime], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error booking training.' });
        }
        res.status(201).json({ message: 'Training booked successfully.' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
