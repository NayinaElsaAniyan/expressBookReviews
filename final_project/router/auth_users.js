const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Authenticate user based on username and password
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Register new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Login user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
  req.session.token = token;
  
  return res.status(200).json({ message: "Successfully logged in", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  const token = req.session.token;

  if (!token) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    const username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
