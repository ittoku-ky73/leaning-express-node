const BookInstance = require('../models/bookinstance');
const { body, validationResult } = require('express-validator');
const Book = require('../models/book');
const async = require('async');

// GET /catalog/bookinstances
// Display list of all BookInstances.
exports.bookinstance_list = function(req, res) {
  BookInstance.find()
    .populate('book')
    .exec(function(err, bookinstances) {
      if (err) throw err;

      // successful, so render
      res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: bookinstances
      });
    });
};

// GET /catalog/bookinstance/:id
// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res) {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function(err, bookinstance) {
      if (err) throw err;

      if (bookinstance == null) { // no results
        var err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }

      // successful, so render
      res.render('bookinstance_detail', {
        title: 'Book:',
        bookinstance: bookinstance
      });
    });
};

// GET /catalog/bookinstance/create
// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next, ...errors) {
  Book.find({}, 'title')
    .exec(function(err, books) {
      if (err) throw err;

      let bookinstanceHash = {
        title: 'Create BookInstance',
        book_list: books
      };

      if (errors)
        bookinstanceHash['errors'] = errors.flat();

      // successful, so render
      res.render('bookinstance_form', bookinstanceHash);
    });
};

// POST /catalog/bookinstance/create
// Handle BookInstance create on POST.
exports.bookinstance_create_post = new Array(
  // validate and sanitise fields
  bookInstanceValidationAndSanitization(),

  // Process request after validation and sanitization
  function(req, res, next) {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a BookInstance object
    let bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    // There are errors. Render from again with sanitized values and error messages
    if (!errors.isEmpty()) {
      exports.bookinstance_create_get(req, res, next, errors.array());
    } else {
      // Data from form is valid
      bookinstance.save(function(err) {
        if (err) throw err;

        // successful, so render
        res.redirect(bookinstance.url);
      });
    }
  }
);

// GET /catalog/bookinstance/:id/update
// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res, next, ...errors) {
  async.parallel(
    {
      books: function(callback) {
        Book.find({}, 'title')
          .exec(callback);
      },
      bookinstance: function(callback) {
        BookInstance.findById(req.params.id)
          .exec(callback);
      },
    }, function(err, results) {
      if (err) throw err;

      if (results.bookinstance == null) {
        var error = new Error('BookInstance not found');
        error.status = 404;
        next(err);
      }

      let bookinstanceHash = {
        title: 'BookInstance Update',
        book_list: results.books,
        bookinstance: results.bookinstance
      };

      if (errors)
        bookinstanceHash['errors'] = errors.flat();

      res.render('bookinstance_form', bookinstanceHash);
    }
  );
};

// POST /catalog/bookinstance/:id/update
// Handle bookinstance update on POST.
exports.bookinstance_update_post = new Array(
  // validation and sanitization
  bookInstanceValidationAndSanitization(),

  function(req, res, next) {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a BookInstance object
    let bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id
    });

    // There are errors. Render from again with sanitized values and error messages
    if (!errors.isEmpty()) {
      exports.bookinstance_update_get(req, res, next, errors.array());
    } else {
      // Data from form is valid
      BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function(err, updateBookinstance) {
        if (err) throw err;

        // successful, so render
        res.redirect(updateBookinstance.url);
      });
    }
  }
);

// GET /catalog/bookinstance/:id/delete
// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next, ...errors) {
  // find bookinstance from params id
  BookInstance.findById(req.params.id, function(err, bookinstance) {
    if (err) throw err;
    // not found
    if (bookinstance == null) {
      let error = new Error('BookInstance not found');
      error.status = 404;
      next(err);
    }

    let bookinstanceHash = {
      title: 'Delete BookInstance',
      bookinstance: bookinstance
    }

    // add error messages if exist errors
    if (errors)
      bookinstanceHash['errors'] = errors.flat();

    // successful, so render
    res.render('bookinstance_delete', bookinstanceHash);
  });
};

// POST /catalog/bookinstance/:id/delete
// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
  BookInstance.findByIdAndRemove(req.params.id, function(err, bookinstance) {
    if (err) throw err;

    // redirect bookinstance list
    res.redirect('/catalog/bookinstances');
  });
};

/*
 * BookInstance Helper
 */
function bookInstanceValidationAndSanitization() {
  return [
    body('book', 'Book must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('status')
    .escape(),
    body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  ];
}
