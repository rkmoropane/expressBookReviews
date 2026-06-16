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
public_users.get('/',async function (req, res) {
    //Write your code here
    try {

        // simulate async behavior using Promise
        const getBooks = async () => {
            return new Promise((resolve, reject) => {
                resolve(books);
            });
        };
    
        const allBooks = await getBooks();
    
        return res.send(
            JSON.stringify(allBooks, null, 4)
        );
    
    } catch (error) {
    
        return res.status(500).json({
            message: 'Error fetching books'
        });
    
    }
    // return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    try {

        const isbn = req.params.isbn;
    
        // Simulated async operation using Promise
        const getBookByISBN = async () => {
            return new Promise((resolve, reject) => {
    
                const book = books[isbn];
    
                if (book) {
                    resolve(book);
                } else {
                    reject('Book not found');
                }
    
            });
        };
    
        const data = await getBookByISBN();
    
        return res.send(JSON.stringify(data, null, 4));
    
    } catch (error) {
    
        return res.status(404).json({
            message: error
        });
    
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    try {

        const authorName = req.params.author;
    
        const getBooksByAuthor = async () => {
            return new Promise((resolve) => {
    
                let result = {};
    
                const allBooks = Object.keys(books);
    
                allBooks.forEach((isbn) => {
    
                    if (books[isbn].author === authorName) {
                        result[isbn] = books[isbn];
                    }
    
                });
    
                resolve(result);
    
            });
        };
    
        const data = await getBooksByAuthor();
    
        if (Object.keys(data).length > 0) {
            return res.send(JSON.stringify(data, null, 4));
        } else {
            return res.status(404).json({
                message: 'No books found for this author'
            });
        }
    
    } catch (error) {
    
        return res.status(500).json({
            message: 'Error retrieving books'
        });
    
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here
    try {

        const titleName = req.params.title;
    
        const getBooksByTitle = async () => {
            return new Promise((resolve) => {
    
                let result = {};
    
                const allBooks = Object.keys(books);
    
                allBooks.forEach((isbn) => {
    
                    if (books[isbn].title === titleName) {
                        result[isbn] = books[isbn];
                    }
    
                });
    
                resolve(result);
    
            });
        };
    
        const data = await getBooksByTitle();
    
        if (Object.keys(data).length > 0) {
            return res.send(JSON.stringify(data, null, 4));
        } else {
            return res.status(404).json({
                message: 'No books found for this title'
            });
        }
    
    } catch (error) {
    
        return res.status(500).json({
            message: 'Error retrieving books'
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
