const Author = require('../models/author');
const async = require('async');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

// GET /catalog/authors
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

// GET /catalog/author/:id
// Display detail page for a specific Author
exports.author_detail = function(req, res, next) {
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

// GET /catalog/author/:id/create
// Display Author create from on GET
exports.author_create_get = function(req, res) {
  res.render('author_form', { title: 'Create Author' });
};

// POST /catalog/author/:id/create
// Handle Author create on POST
exports.author_create_post = new Array(
  // validate and sanitize the author field
  authorValidateAndSanitize(),

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
      if (err) 
        return next(err);
      // author saved. redirect to author detail page
      res.redirect(author.url);
    });
  }
);

// GET /catalog/author/:id/delete
// Display Author delete from on GET
exports.author_delete_get = function(req, res, next) {
  async.parallel(
    {
      author: function(callback) {
        Author.findById(req.params.id)
          .exec(callback);
      },
      author_books: function(callback) {
        Book.find({ 'author': req.params.id })
          .exec(callback);
      }
    }, function(err, results) {
      if (err) throw err;
      // no results author
      if (results.author == null) {
        res.redirect('/catalog/authors');
      }
      // successful, so render
      res.render('author_delete', {
        title: 'Delete Author',
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};

// POST /catalog/author/:id/delete
// Handle Author delete on POST
exports.author_delete_post = function(req, res, next) {
  async.parallel(
    {
      author: function(callback) {
        Author.findById(req.params.id)
          .exec(callback);
      },
      author_books: function(callback) {
        Book.find({ 'author': req.body.author_id })
          .exec(callback);
      },
    }, function(err, results) {
      if (err) throw err;
      if (results.author_books.length > 0) {
        // author has books. render in same way as for GET route
        res.render('author_delete', {
          title: 'Delete Author',
          author: results.author,
          author_books: results.author_books
        });
      }
      else {
        // author has no books. delete object and redirect to the list of authors
        Author.findByIdAndRemove(req.body.author_id, function(err) {
          if (err)
            next(err);
          // successful, go to author list
          res.redirect('/catalog/authors');
        });
      }
    }
  );
};

// GET /catalog/author/:id/update
// Display Author update from on GET
exports.author_update_get = function(req, res, next) {
  updateRenderAuthorForm(req, res, next);
};

// POST /catalog/author/:id/update
// Handle Author update on POST
exports.author_update_post = [
  // validate and sanitize fields
  authorValidateAndSanitize(),

  // process request after validation and sanitization
  function(req, res, next) {
    // extract the validation errors form a request
    const errors = validationResult(req);
    // create a book object with escaped/trimmed data and old id
    var author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id // this is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      updateRenderAuthorForm(req, res, next, errors.array());
    } else {
      // data from is valid. update the record
      Author.findByIdAndUpdate(req.params.id, author, {}, function(err, updatedAuthor) {
        if (err)
          next(err);
        // successful, redirect to author detail page
        res.redirect(updatedAuthor.url);
      });
    }
  }
];

/*
 * ############# refactor ##########
 */

function authorValidateAndSanitize() {
  return [
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
      .toDate()
  ];
}

function updateRenderAuthorForm(req, res, next, ...errors) {
  // get author
  async.parallel(
    {
      author: function(callback) {
        Author.findById(req.params.id).exec(callback)
      },
    }, function(err, results) {
      if (err) throw err;
      if (results.author == null) {
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }

      var authorHash = {
        title: 'Update Author',
        author: results.author,
      };
      if (errors)
        authorHash['errors'] = errors.flat();
      // successful, so render
      res.render('author_form', authorHash);
    }
  );
}

