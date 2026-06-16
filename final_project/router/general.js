const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    
    // 1. Check if both fields exist
    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }
    
    // 2. Check if user already exists
    const userExists = users.some(user => user.username === username);
    
    if (userExists) {
        return res.status(409).json({
            message: 'User already exists'
        });
    }
    
    // 3. Register new user
    users.push({
        username: username,
        password: password
    });
    
    return res.status(200).json({
        message: 'User successfully registered'
    });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.send(JSON.stringify(book, null, 4));
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const authorName = req.params.author;
    
    let result = {};

    // Get all book ISBN keys
    const allBooks = Object.keys(books);

    // Loop through each book
    allBooks.forEach((isbn) => {

        if (books[isbn].author === authorName) {
            result[isbn] = books[isbn];
        }
    });

    if (Object.keys(result).length > 0) {
        return res.send(JSON.stringify(result, null, 4));
    } else {
        return res.status(404).json({
            message: 'No books found for this author'
        });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const titleName = req.params.title;

    let result = {};

    // Get all ISBN keys
    const allBooks = Object.keys(books);

    // Loop through all books
    allBooks.forEach((isbn) => {
        if (books[isbn].title === titleName) {
            result[isbn] = books[isbn];
        }
    });

    if (Object.keys(result).length > 0) {
        return res.send(JSON.stringify(result, null, 4));
    } else {
        return res.status(404).json({
            message: 'No books found for this title'
        });
    }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    const book = books[isbn];

    if (book) {
        return res.send(
            JSON.stringify(book.reviews, null, 4)
        );
    } else {
        return res.status(404).json({
            message: 'Book not found'
        });
    }
});

module.exports.general = public_users;
