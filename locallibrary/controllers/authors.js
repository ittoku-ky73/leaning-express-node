const Author = require('../models/author');
const Book = require('../models/book');

const async = require('async');
const { check, validationResult } = require('express-validator');
const debug = require('debug')('locallibrary:author');

// Display author list
exports.author_list = (req, res, next) => {
  Author
    .find()
    .sort([['family_name', 'ascending']])
    .exec((err, authors) => {
      if (err) next(err);

      res.render('authors/index', {
        title: 'Author list',
        authors: authors,
      });
    });
};

// Display author detail
exports.author_detail = (req, res, next) => {
  let author_id = checkRequestParamsID(req.params.id);

  async.parallel(
    {
      author(callback) {
        Author.findById(author_id).exec(callback);
      },
      author_books(callback) {
        Book.find({ author: author_id }, 'title summary').exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);

      // author not found
      if (results.author === null) {
        const err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }

      res.render('authors/detail', {
        title: 'Author detail',
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};

// Display author create get
exports.author_create_get = (req, res) => {
  res.render('authors/form', {
    title: 'Author create',
  });
};

// handle author create post
exports.author_create_post = [
  validationAuthor('author.first_name'),
  validationAuthor('author.family_name'),
  validationAuthor('author.date_of_birth'),
  validationAuthor('author.date_of_death'),
  (req, res, next) => {
    const errors = validationResult(req);
    const author = new Author(req.body.author);
    debug(author);

    // validation error
    if (!errors.isEmpty()) {
      debug('validation error')
      res.render('authors/form', {
        title: 'Author create',
        author: author,
        errors: errors.array(),
      });
      return;
    }

    author.save((err) => {
      if (err) next(err);

      res.redirect(author.url);
    });
  },
];

// Display author update get
exports.author_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: author update get');
};

// handle author update post
exports.author_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: author update post');
};

// Display author delete get
exports.author_delete_get = (req, res, next) => {
  let author_id = checkRequestParamsID(req.params.id);

  async.parallel(
    {
      author(callback) { Author.findById(author_id).exec(callback); },
      author_books(callback) { Book.find({ author: author_id }).exec(callback); },
    },
    (err, results) => {
      if (err) next(err);

      // author not found
      if (results.author === null) {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }

      res.render('authors/delete', {
        title: 'Author delete',
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};

// handle author delete post
exports.author_delete_post = (req, res) => {
  let author_id = checkRequestParamsID(req.body.author.id);

  async.parallel(
    {
      author(callback) { Author.findById(author_id).exec(callback); },
      author_books(callback) { Book.find({ author: author_id }).exec(callback); },
    },
    (err, results) => {
      if (err) next(err);

      if (results.author_books.length > 0) {
        res.render('authors/delete', {
          title: 'Author delete',
          author: results.author,
          author_books: results.author_books,
        });
        return;
      }

      Author.findByIdAndRemove(author_id, (err) => {
        if (err) next(err);

        res.redirect('/catalog/authors');
      });
    }
  );
};

function checkRequestParamsID(id) {
  return (id.match(/^[0-9a-fA-F]{24}$/))
    ? id
    : null;
}

function validationAuthor(name) {
  switch (name) {
    case 'author.first_name':
      return check(name)
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('First name must be specified')
        .isLength({ max: 100 })
        .withMessage('First name is too long')
        .isAlphanumeric()
        .withMessage('First name has non-alphabetnumeric characters')
    case 'author.family_name':
      return check(name)
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Family name must be specified')
        .isLength({ max: 100 })
        .withMessage('Family name is too long')
        .isAlphanumeric()
        .withMessage('Family name has non-alphabetnumeric characters')
    case 'author.date_of_birth':
      return check(name, 'Invalid ' + name)
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate()
    case 'author.date_of_death':
      return check(name, 'Invalid ' + name)
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate()
  }
}
