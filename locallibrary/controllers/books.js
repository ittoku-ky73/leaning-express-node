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
  Book
    .find({}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .exec((err, books) => {
      if (err) next(err);

      res.render('books/index', {
        title: 'Book List',
        books: books,
      });
    });
};

// display book detail
exports.book_detail = (req, res, next) => {
  let book_id = checkRequestParamsID(req.params.id);

  async.parallel(
    {
      book(callback) {
        Book.findById(book_id)
          .populate('author')
          .populate('genres')
          .exec(callback);
      },
      bookinstance(callback) {
        Bookinstance.find({ book: book_id }).exec(callback);
      }
    }, (err, results) => {
      if (err) next(err);

      // book not found
      if (results.book === null) {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }

      res.render('books/detail', {
        title: results.book.title,
        book: results.book,
        bookinstances: results.bookinstance,
      });
    }
  );
};

// display book create get
exports.book_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: book create get');
}

// handle book create post
exports.book_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: book create post');
}

// display book update get
exports.book_update_get = (req, res) => {
  let book_id = checkRequestParamsID(req.params.id);

  res.send('NOT IMPLEMENTED: book update get');
}

// handle book update post
exports.book_update_post = (req, res) => {
  let book_id = checkRequestParamsID(req.params.id);

  res.send('NOT IMPLEMENTED: book update post');
}

// display book delete get
exports.book_delete_get = (req, res) => {
  let book_id = checkRequestParamsID(req.params.id);

  res.send('NOT IMPLEMENTED: book delete get');
}

// handle book delete post
exports.book_delete_post = (req, res) => {
  let book_id = checkRequestParamsID(req.params.id);

  res.send('NOT IMPLEMENTED: book delete post');
}

function checkRequestParamsID(id) {
  return (id.match(/^[0-9a-fA-F]{24}$/))
    ? id
    : null;
}
