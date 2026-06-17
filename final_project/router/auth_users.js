const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    return users.some(user =>
        user.username === username &&
        user.password === password
    );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    
    // 1. Validate input
    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password required'
        });
    }
    
    // 2. Authenticate user
    if (authenticatedUser(username, password)) {
    
        // Generate JWT access token
        let accessToken = jwt.sign(
            {
                data: password
            }, 
            'fingerprint_customer', 
            { expiresIn: 60 * 60 }
        );

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    
    } else {
        return res.status(401).json({
            message: 'Invalid username or password'
        });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;
    
    // ✅ SAFE session check
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }
    // 1. Get username from session
    const username = req.session.authorization.username;
    
    // 2. Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }
    
    // 3. Check if review is provided
    if (!review) {
        return res.status(400).json({
            message: 'Review is required'
        });
    }
    
    // 4. Add or update review
    books[isbn].reviews[username] = review;
    
    return res.status(200).json({
        message: 'Review added/updated successfully',
        reviews: books[isbn].reviews
    });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    // ✅ SAFE session check
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }
    // 1. Get logged-in username from session
    const username = req.session.authorization.username;
    
    // 2. Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }
    
    // 3. Check if user has a review
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({
            message: 'No review found for this user'
        });
    }
    
    // 4. Delete only this user's review
    delete books[isbn].reviews[username];
    
    return res.status(200).json({
        message: 'Review deleted successfully',
        reviews: books[isbn].reviews
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
