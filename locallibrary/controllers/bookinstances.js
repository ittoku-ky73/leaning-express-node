const Bookinstance = require('../models/bookinstance');

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
exports.bookinstance_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: bookinstance create get');
}

// handle bookinstance create post
exports.bookinstance_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: bookinstance create post');
}

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
