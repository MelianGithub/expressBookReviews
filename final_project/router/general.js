const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (users[username]) {
        return res.status(400).json({ message: "Username already exists. Please choose a different one." });
    }

    users[username] = password;

    return res.status(200).json({ message: "User registered successfully." });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json({ books: books });
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Obtén el ISBN de los parámetros de la solicitud
    const isbn = req.params.isbn;

    
    const isbnNumber = parseInt(isbn);

   
    const book = books[isbnNumber];

    if (book) {
       
        return res.status(200).json({ message: "Book details found", book: book });
    } else {
        
        return res.status(404).json({ message: "Book details not found for ISBN: " + isbn });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    
    const author = req.params.author;

    let matchingBooks = [];

    Object.values(books).forEach(book => {
        if (book.author === author) {
            matchingBooks.push(book);
        }
    });

    if (matchingBooks.length > 0) {
       
        return res.status(200).json({ message: "Books by author found", books: matchingBooks });
    } else {
        
        return res.status(404).json({ message: "No books found for author: " + author });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Get the title from the request parameters
    const title = req.params.title;

    // Array to store books with matching title
    let matchingBooks = [];

    
    Object.values(books).forEach(book => {
        if (book.title.toLowerCase() === title.toLowerCase()) {
            matchingBooks.push(book);
        }
    });

    if (matchingBooks.length > 0) {
        
        return res.status(200).json({ message: "Books with title found", books: matchingBooks });
    } else {
       
        return res.status(404).json({ message: "No books found with title: " + title });
    }
});


// Obtener las reseñas de un libro basado en el ISBN
public_users.get('/review/:isbn', function (req, res) {
    // Obtén el ISBN de los parámetros de la solicitud
    const isbn = req.params.isbn;

    // Convierte el ISBN a un número entero ya que las claves en el objeto 'books' son numéricas
    const isbnNumber = parseInt(isbn);

    // Obtenemos el libro correspondiente al ISBN proporcionado
    const book = books[isbnNumber];

    if (book) {
        // Si se encuentra el libro, obtenemos sus reseñas (si las tiene)
        const bookReviews = book.reviews || {}; // Si no hay reseñas, devuelve un objeto vacío

        // Devolvemos las reseñas en la respuesta
        return res.status(200).json({reviews: bookReviews });
    } else {
        // Si el libro con el ISBN proporcionado no se encuentra, devolvemos un mensaje indicando que no se encontraron detalles del libro
        return res.status(404).json({ message: "Book details not found for ISBN: " + isbn });
    }
});



module.exports.general = public_users;
