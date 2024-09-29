const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Create the database if it doesn't exist and then connect
db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
    if (err) throw err;
    console.log(`Database ${process.env.DB_NAME} created or already exists.`);

    // Now change the user to connect to the specific database
    db.changeUser({ database: process.env.DB_NAME }, (err) => {
        if (err) throw err;
        console.log(`Connected to database: ${process.env.DB_NAME}`);

        // Create tables
        createTables();
    });
});

// Create necessary tables
const createTables = () => {
    const usersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    `;

    db.query(usersTableQuery, (err) => {
        if (err) throw err;
        console.log('Users table created or already exists.');
    });

    const transactionsTableQuery = `
        CREATE TABLE IF NOT EXISTS transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            potatoType VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            totalPrice DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(transactionsTableQuery, (err) => {
        if (err) throw err;
        console.log('Transactions table created or already exists.');
    });

    const salesTableQuery = `
        CREATE TABLE IF NOT EXISTS sales (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            potatoType VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            totalPrice DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(salesTableQuery, (err) => {
        if (err) throw err;
        console.log('Sales table created or already exists.');
    });

    const trainingTableQuery = `
        CREATE TABLE IF NOT EXISTS training (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            training_type VARCHAR(255) NOT NULL,
            training_time VARCHAR(255) NOT NULL,
            booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(trainingTableQuery, (err) => {
        if (err) throw err;
        console.log('Training table created or already exists.');
    });
};

module.exports = db;
