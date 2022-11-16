const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const Bookinstance = require('../models/bookinstance');

const async = require('async');
const { check, validationResult } = require('express-validator');
const debug = require('debug')('locallibrary:genre');

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
exports.book_list = (req, res, next) => {
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
exports.book_create_get = (req, res, next) => {
  async.parallel(
    {
      authors(callback) {
        Author
          .find({}, 'first_name family_name _id')
          .sort([['family_name', 'ascending']])
          .exec(callback);
      },
      genres(callback) {
        Genre
          .find({})
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) next(err);

      debug('authors: ', results.authors);
      debug('genres: ', results.genres);
      res.render('books/create', {
        title: 'Book create',
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
};

// handle book create post
exports.book_create_post = [
  validationBook('book.title'),
  validationBook('book.summary'),
  validationBook('book.isbn'),
  validationBook('book.author'),
  validationBook('book.genres.*'),
  (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book(req.body.book);

    debug('book: ', book);
    // validation error
    if (!errors.isEmpty()) {
      debug('error!!!')
      async.parallel(
        {
          authors(callback) { Author.find(callback) },
          genres(callback) { Genre.find(callback) },
        },
        (err, results) => {
          if (err) next(err);

          results.genres.forEach(genre => {
            if (book.genres.includes(genre._id)) {
              genre.checked = 'true';
            }
          });

          res.render('books/create', {
            title: 'Book create',
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    book.save((err) => {
      debug('save!!!')
      if (err) next(err);

      res.redirect(book.url);
    });
  },
];

// display book update get
exports.book_update_get = (req, res, next) => {
  let book_id = checkRequestParamsID(req.params.id);

  async.parallel(
    {
      book(callback) {
        Book
          .findById(book_id)
          .populate('author')
          .populate('genres')
          .exec(callback);
      },
      authors(callback) {
        Author
          .find({}, 'first_name family_name _id')
          .sort([['family_name', 'ascending']])
          .exec(callback);
      },
      genres(callback) {
        Genre
          .find({})
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) next(err);

      // book not found
      if (results.book === null) {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }

      results.genres.forEach(genre => {
        if (results.book.genres.includes(genre._id)) {
          genre.checked = 'true';
        }
      });

      res.render('books/update', {
        title: 'Book update',
        authors: results.authors,
        genres: results.genres,
        book: results.book,
      });
    }
  );
}

// handle book update post
exports.book_update_post = [
  validationBook('book.title'),
  validationBook('book.summary'),
  validationBook('book.isbn'),
  validationBook('book.author'),
  validationBook('book.genres.*'),
  (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book(req.body.book);
    const book_id = checkRequestParamsID(req.params.id);

    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors(callback) { Author.find(callback); },
          genres(callback) { Genre.find(callback); },
        },
        (err, results) => {
          if (err) next(err);

          results.genres.forEach(genre => {
            if (book.genres.includes(genre._id)) {
              genre.checked = 'true';
            }
          });

          res.render('books/update', {
            title: 'Book update',
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    Book.findByIdAndUpdate(book_id, book, {}, (err, doc) => {
      if (err) next(err);

      res.redirect(doc.url);
    });
  },
];

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

function validationBook(field) {
  switch (field) {
    case 'book.title':
      return check(field, 'Title must not be empty')
        .trim()
        .escape()
        .isLength({ min: 1 });
    case 'book.summary':
      return check(field, 'Summary must not be empty')
        .trim()
        .escape()
        .isLength({ min: 1 });
    case 'book.isbn':
      return check(field, 'ISBN must not be empty')
        .trim()
        .escape()
        .isLength({ min: 1 });
    case 'book.author':
      return check(field, 'Author must not be empty')
        .trim()
        .escape()
        .isLength({ min: 1 });
    case 'book.genres.*':
      return check(field)
        .escape();
  }
}
