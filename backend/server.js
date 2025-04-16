// server.js
console.log("🔥 Server file is running...");

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// In-memory users storage
const users = [
    { username: 'admin', password: 'admin123' }  // Default user for testing
];

app.use(cors());
app.use(bodyParser.json());

// Login endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ success: true, message: 'Login successful!' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Register endpoint (optional)
app.post('/api/auth/register', (req, res) => {
    const { username, password } = req.body;
    
    if (users.some(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    
    users.push({ username, password });
    console.log('Current users:', users); // For debugging
    res.json({ success: true, message: 'Registration successful!' });
});

app.get('/', (req, res) => {
    res.send('API Running');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});