const Author = require('../models/author');
const async = require('async');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

// Display list of all Authors
exports.author_list = function(req, res) {
  Author.find()
    .sort({name: 1})
    .exec(function(err, list_authors) {
      if (err) { return next(err); }
      // successful, so render
      res.render('author_list', { title: 'Author List', author_list: list_authors });
    });
};

// Display detail page for a specific Author
exports.author_detail = function(req, res) {
  async.parallel(
    {
      author: function(callback) {
        Author.findById(req.params.id)
          .exec(callback);
      },
      author_books: function(callback) {
        Book.find({'author': req.params.id}, 'title summary')
          .exec(callback);
      }
    }, function(err, results) {
      if (err) { return next(err); }
      if (results.author == null) {
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }
      // successful, so render
      res.render('author_detail', {
        title: 'Author Detail',
        author: results.author,
        author_books: results.author_books
      });
    }
  );
};

// Display Author create from on GET
exports.author_create_get = function(req, res) {
  res.render('author_form', { title: 'Create Author' });
};

// Handle Author create on POST
exports.author_create_post = new Array(
  // validate and sanitize the name field
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  // process request after validation and sanitization
  function(req, res, next) {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // there are errors. render the form again with sanitized values/error messages
      res.render('author_form', {
        title: 'Create Author',
        author: req.body,
        errors: errors.array()
      });
      return;
    }

    // create an author object with escaped and trimmed data
    var author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death
    });

    author.save(function(err) {
      if (err) { return next(err); }
      // genre saved. redirect to genre detail page
      res.redirect(author.url);
    });
  }
);

// Display Author delete from on GET
exports.author_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: AUTHOR delete GET');
};

// Handle Author delete on POST
exports.author_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: AUTHOR delete POST');
};

// Display Author update from on GET
exports.author_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: AUTHOR update GET');
};

// Handle Author update on POST
exports.author_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: AUTHOR update POST');
};

