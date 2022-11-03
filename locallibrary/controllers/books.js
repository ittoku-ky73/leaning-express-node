const Book = require('../models/book');

// display book list
exports.book_list = (req, res) => {
  res.send('NOT IMPLEMENTED: book list');
}

// display book detail
exports.book_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: book detail: ' + req.params.id);
}

// display book create get
exports.book_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: book create get');
}

// handle book create post
exports.book_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: book create post');
}

// display book delete get
exports.book_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: book delete get');
}

// handle book delete post
exports.book_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: book delete post');
}

// display book update get
exports.book_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: book update get');
}

// handle book update post
exports.book_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: book update post');
}
