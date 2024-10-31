const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public')); // This line serves static files from the 'public' folder

// Serve the HTML page at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
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

// Helper function to save users (storing unhashed passwords)
const saveUser = (username, password) => {
  const usersDB = path.join(__dirname, 'public', 'users.json'); // Ensure this path is correct
  const users = JSON.parse(fs.readFileSync(usersDB, 'utf-8') || '[]');
  users.push({ username, password }); // Store unhashed password
  fs.writeFileSync(usersDB, JSON.stringify(users, null, 2));
};

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
