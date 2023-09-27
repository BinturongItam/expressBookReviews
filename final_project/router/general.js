const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    const getBooks = async () => {
      return books;
    }
    try {
      const books = await getBooks();
      return res.status(200).json(books);
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
    
  });



// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const booksisbn = async () => {
        const books = require("./booksdb.js");
        const isbn = req.params.isbn;
        const book = books[isbn];
        return book;
      };
  
      const book = await booksisbn();
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
  
      // Define and immediately invoke the asynchronous function inside the route handler
      const book = await (async () => {
        try {
          const books = require("./booksdb.js");
          const book = Object.values(books).find((b) => b.author === author);
          return book;
        } catch (error) {
          throw error;
        }
      })();
  
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
  
      // Define and immediately invoke the asynchronous function inside the route handler
      const book = await (async () => {
        try {
          const books = require("./booksdb.js");
          const booksByTitle = Object.values(books).filter((b) => b.title === title);
          return booksByTitle;
        } catch (error) {
          throw error;
        }
      })();
  
      if (book && book.length > 0) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const reviews = books[isbn]["reviews"];
  res.send(reviews)
 });

module.exports.general = public_users;
