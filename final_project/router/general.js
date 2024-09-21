const express = require("express");
let books = require("./booksdb.js");
const axios = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Base URL
const baseURL = 'http://localhost:5000';

//Register New User
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  } else {
    users.push({ username, password });
  }
  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    // Directly resolving the book list
    if (books) {
      res.status(200).json(books); // Send books directly
    } else {
      res.status(404).send("No books were found.");
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    if (books[isbn]) {
      res.status(200).json(books[isbn]);
    } else {
      res.status(404).send("Details of book by ISBN not found");
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  const bookList = [];

  // Searching for books by author
  for (const key in books) {
    if (books[key].author === author) {
      bookList.push(books[key]);
    }
  }

  if (bookList.length > 0) {
    res.status(200).json(bookList);
  } else {
    res.status(404).send(`No book found for author ${author}`);
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  const bookList = [];

  // Searching for books by title
  for (const key in books) {
    if (books[key].title === title) {
      bookList.push(books[key]);
    }
  }

  if (bookList.length > 0) {
    res.status(200).json(bookList);
  } else {
    res.status(404).send(`No book found for title ${title}`);
  }
});

// Get book review based on ISBN
public_users.get("/review/:isbn", async function (req, res) {
  const isbn = req.params.isbn;

  // Check if the book exists
  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).send("Book not found with ISBN " + isbn);
  }
});

// Get all books
const getAllBooks = async () => {
  try {
    const response = await axios.get(`${baseURL}/`);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

// Get book by ISBN
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`${baseURL}/isbn/${isbn}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
  }
};

// Get books by author
const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`${baseURL}/author/${author}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching books by author:', error);
  }
};

// Get books by title
const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`${baseURL}/title/${title}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching books by title:', error);
  }
};

// Example usage
getAllBooks();
getBookByISBN('1'); // Change '1' to the desired ISBN
getBooksByAuthor('Dante Alighieri'); // Change 'Unknown' to the desired author
getBooksByTitle('Pride and Prejudice');

module.exports.general = public_users;
