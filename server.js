const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Placeholder for database (replace with a real database for production)
const usersDB = './users.json';

// Helper function to save users (storing unhashed passwords)
const saveUser = (username, password) => {
  const users = JSON.parse(fs.readFileSync(usersDB, 'utf-8') || '[]');
  users.push({ username, password }); // Store unhashed password
  fs.writeFileSync(usersDB, JSON.stringify(users, null, 2));
};

// Serve the HTML page at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html')); // Change 'register.html' to the name of your HTML file
});

// Register route for saving credentials
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    // Save the user with unhashed password
    saveUser(username, password);
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('Server error');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
