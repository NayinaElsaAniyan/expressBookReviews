const express = require('express');
const axios = require('axios');
const public_users = express.Router();

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('https://nayinaelsaan-5002.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books');
    const bookList = response.data;
    res.status(200).json(bookList);
  } catch (error) {
    console.error('Error fetching book list:', error.message); // Log error message
    res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`https://nayinaelsaan-5002.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/${isbn}`);
    const bookDetails = response.data;
    res.status(200).json(bookDetails);
  } catch (error) {
    console.error('Error fetching book details by ISBN:', error.message);
    res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`https://nayinaelsaan-5002.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/author/${author}`);
    const booksByAuthor = response.data;
    res.status(200).json(booksByAuthor);
  } catch (error) {
    console.error('Error fetching books by author:', error.message);
    res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`https://nayinaelsaan-5002.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/title/${title}`);
    const booksByTitle = response.data;
    res.status(200).json(booksByTitle);
  } catch (error) {
    console.error('Error fetching books by title:', error.message);
    res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

module.exports.general = public_users;
