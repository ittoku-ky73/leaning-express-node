const Author = require('../models/author');
const Book = require('../models/book');

const async = require('async');

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
  res.send('NOT IMPLEMENTED: author create get');
};

// handle author create post
exports.author_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: author create post');
};

// Display author delete get
exports.author_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: author delete get');
};

// handle author delete post
exports.author_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: author delete post');
};

// Display author update get
exports.author_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: author update get');
};

// handle author update post
exports.author_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: author update post');
};

function checkRequestParamsID(id) {
  return (id.match(/^[0-9a-fA-F]{24}$/))
    ? id
    : null;
}
