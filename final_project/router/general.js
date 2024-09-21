const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Register New User
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  } else {
    users.push({ username, password });
  }
  return res.status(201).json({ message: "User successfully registered" });
});

async function getBooksList() {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books); // Resolvemos con la lista de libros
    } else {
      reject("Not books were founded.");
    }
  });
}

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const bookList = await getBooksList(books);
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(404).send(error);
  }
});

//Function to get book details
function getBookDetailsByISBN(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]); 
    } else {
      reject("Details of book by ISBN not found"); 
    }
  });
}

// Get book details bases on isbn
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const bookDetails = await getBookDetailsByISBN(isbn);
    res.send(bookDetails); //
  } catch (error) {
    res.status(404).send(error);
  }
});

async function findBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    const booksByAuthor = [];
    const bookKeys = Object.keys(books);

    bookKeys.forEach((key) => {
      const book = books[key];
      if (book.author === author) {
        booksByAuthor.push(book); //
      }
    });

    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No book found for author " + booksByAuthor);
    }
  });
}

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;

  try {
    const booksDetails = await findBooksByAuthor(author);
    res.send(booksDetails);
  } catch (error) {
    res.status(404).send(error);
  }
});

async function findBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const booksByTitle = [];
    const bookKeys = Object.keys(books);

    bookKeys.forEach((key) => {
      const book = books[key];
      if (book.title === title) {
        booksByTitle.push(book); //
      }
    });

    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No book found for title " + booksByTitle);
    }
  });
}
// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;

  try {
    const booksDetails = await findBooksByTitle(title);
    res.send(booksDetails);
  } catch (error) {
    res.status(404).send(error);
  }
});
// Get book review based on isbn
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).send("Book not found with ISBN " + isbn);
  }
});

module.exports.general = public_users;
