const Author = require('../models/author');

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
exports.author_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: author detail: ' + req.params.id);
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
