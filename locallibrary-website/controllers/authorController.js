const Author = require('../models/author');
const async = require('async');
const Book = require('../models/book');

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
  res.send('NOT IMPLEMENTED: AUTHOR create GET');
};

// Handle Author create on POST
exports.author_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: AUTHOR create POST');
};

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

