const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
        users.push({'username': username, 'password': password});
        return res.status(200).json({message: 'Customer successfully registred. Now you can login'});
    } else {
        return res.status(404).json({message: 'Customer already exists!'});
    }
  }
  return res.status(404).json({message: 'Unable to register user.'});
});

let myPromise = new Promise((resolve, reject) => {
    setTimeout(()=>{
        resolve(books);
    }, 3000);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  myPromise.then((books) => {
    res.send(JSON.stringify({'books': books}, null, 4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  myPromise.then((books) => {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
  });
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  myPromise.then((books) => {
    const author = req.params.author;
    const booksbyauthor = [];
    for (const [isbn, details] of Object.entries(books)) {
        if (details.author === author) {
            booksbyauthor.push(details);
        }
    }
    res.send(JSON.stringify({'booksbyauthor': booksbyauthor}, null, 4));
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  myPromise.then((books) => {
    const title = req.params.title;
    const booksbytitle = [];
    for (const [isbn, details] of Object.entries(books)) {
        if (details.title === title) {
            booksbytitle.push(details);
        }
    }
    res.send(JSON.stringify({'booksbytitle': booksbytitle}, null, 4));
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]['reviews']);
});

module.exports.general = public_users;
