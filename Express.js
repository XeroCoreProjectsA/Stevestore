const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pointgo'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
});

// Register User
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
        [username, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User registered' });
    });
});

// Login User
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Password salah' });

        const token = jwt.sign({ id: user.id }, 'SECRETKEY', { expiresIn: '1h' });
        res.json({ token });
    });
});

// Get Products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Buy Product
app.post('/buy', (req, res) => {
    const { user_id, product_id, amount } = req.body;
    db.query('INSERT INTO transactions (user_id, product_id, amount) VALUES (?, ?, ?)', 
        [user_id, product_id, amount], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Transaksi berhasil' });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
