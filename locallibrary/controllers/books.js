const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const Bookinstance = require('../models/bookinstance');

const async = require('async');

// display all model count
exports.index = (req, res, next) => {
  async.parallel(
    {
      book_count(callback) {
        Book.countDocuments({}, callback);
      },
      author_count(callback) {
        Author.countDocuments({}, callback);
      },
      genre_count(callback) {
        Genre.countDocuments({}, callback);
      },
      bookinstance_count(callback) {
        Bookinstance.countDocuments({}, callback);
      },
      bookinstance_available_count(callback) {
        Bookinstance.countDocuments({ status: 'Available' }, callback);
      },
    }, (err, results) => {
      res.render('index', {
        title: 'Local Library Home',
        error: err,
        data: results,
      });
    }
  );
};

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
