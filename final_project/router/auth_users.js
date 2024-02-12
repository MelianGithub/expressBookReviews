const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        username: "admin",
        password: "123123"
    }
];

const isValid = (username) => {
    // Check if the username exists in the users array
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    // Check if the username and password match a user in the users array
    return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (isValid(username) && authenticatedUser(username, password)) {
        // Create a token and store it in the session
        const token = jwt.sign({ username }, 'secret-key', { expiresIn: '1h' });
        req.session.token = token;
        return res.status(200).json({ message: "Logged in successfully" });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

/// Add a book review
regd_users.put("/auth/review/:id", (req, res) => {
    const { review } = req.query;
    const { id } = req.params;
    const { username } = jwt.verify(req.session.token, 'secret-key');

    // Find the book by ID
    const book = books[id];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the review
    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
