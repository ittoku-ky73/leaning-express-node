const Bookinstance = require('../models/bookinstance');
const Book = require('../models/book');

const { check, validationResult } = require('express-validator');

// display bookinstance list
exports.bookinstance_list = (req, res) => {
  Bookinstance
    .find()
    .populate('book')
    .exec((err, bookinstances) => {
      if (err) next(err);

      res.render('bookinstances/index', {
        title: 'Bookinstance list',
        bookinstances: bookinstances,
      });
    });
};

// display bookinstance detail
exports.bookinstance_detail = (req, res, next) => {
  let bookinstance_id = checkRequestParamsID(req.params.id);

  Bookinstance
    .findById(bookinstance_id)
    .populate('book')
    .exec((err, bookinstance) => {
      if (err) return next(err);

      if (bookinstance === null) {
        const err = new Error('Bookinstance not found');
        err.status = 404;
        return next(err);
      }

      res.render('bookinstances/detail.ejs', {
        title: `Copy: ${bookinstance.book.title}`,
        bookinstance: bookinstance,
      });
    });
};

// display bookinstance create get
exports.bookinstance_create_get = (req, res, next) => {
  Book
    .find({}, 'title')
    .sort([['title', 'ascending']])
    .exec((err, books) => {
      if (err) next(err);

      res.render('bookinstances/form', {
        title: 'Bookinstance create',
        books: books,
      });
    });
};

// handle bookinstance create post
exports.bookinstance_create_post = [
  validationBookinstance('bookinstance.book'),
  validationBookinstance('bookinstance.imprint'),
  validationBookinstance('bookinstance.status'),
  validationBookinstance('bookinstance.due_back'),
  (req, res, next) => {
    const errors = validationResult(req);
    const bookinstance = new Bookinstance(req.body.bookinstance);

    if (!errors.isEmpty()) {
      Book
        .find({}, 'title')
        .sort([['title', 'ascending']])
        .exec((err, books) => {
          if (err) next(err);

          res.render('bookinstances/form', {
            title: 'Bookinstance create',
            books: books,
            selected_book: bookinstance.book._id,
            errors: errors.array(),
            bookinstance: bookinstance,
          });
        });
      return;
    }

    bookinstance.save((err) => {
      if (err) next(err);

      res.redirect(bookinstance.url);
    });
  },
];

// display bookinstance delete get
exports.bookinstance_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: bookinstance delete get');
}

// handle bookinstance delete post
exports.bookinstance_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: bookinstance delete post');
}

// display bookinstance update get
exports.bookinstance_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: bookinstance update get');
}

// handle bookinstance update post
exports.bookinstance_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: bookinstance update post');
}

function checkRequestParamsID(id) {
  return (id.match(/^[0-9a-fA-F]{24}$/))
    ? id
    : null;
}

function validationBookinstance(field) {
  switch (field) {
    case 'bookinstance.book':
      return check(field, 'book must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape()
    case 'bookinstance.imprint':
      return check(field, 'imprint must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape()
    case 'bookinstance.status':
      return check(field)
        .escape()
    case 'bookinstance.due_back':
      return check(field, 'Invalid date')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate()
  }
}
