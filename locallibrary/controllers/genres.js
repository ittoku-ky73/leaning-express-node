const Genre = require('../models/genre');
const Book = require('../models/book');

const async = require('async');
const { body, validationResult } = require('express-validator');
const debug = require('debug')('locallibrary:genre');

// display genre list
exports.genre_list = (req, res, next) => {
  Genre
    .find()
    .sort([['name', 'ascending']])
    .exec((err, genres) => {
      if (err) next(err);

      res.render('genres/index', {
        title: 'Genre list',
        genres: genres,
      });
    });
};

// display genre detail
exports.genre_detail = (req, res, next) => {
  let genre_id = checkRequestParamsID(req.params.id);

  async.parallel(
    {
      genre(callback) {
        Genre.findById(genre_id).exec(callback);
      },
      genre_books(callback) {
        Book.find({ genres: genre_id }).exec(callback);
      },
    }, (err, results) => {
      if (err) next(err);

      // genre not found
      if (results.genre === null) {
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }

      res.render('genres/detail', {
        title: 'Genre detail',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// display genre create get
exports.genre_create_get = (req, res, next) => {
  res.render('genres/form', {
    title: 'Genre form',
  });
};

// handle genre create post
exports.genre_create_post = [
  body('name', 'Genre name required')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Genre name required')
    .isLength({ max: 100})
    .withMessage('Genre name max length is 100 characters')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });

    // validation error
    if (!errors.isEmpty()) {
      debug('validation error');
      res.render('genres/form', {
        title: 'Genre form',
        genre,
        errors: errors.array(),
      });
      return;
    }
    else {
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) next(err);

        if (found_genre) {
          debug('genre found')
          res.redirect(found_genre.url);
        }
        else {
          genre.save((err) => {
            debug('genre create')
            if (err) next(err);

            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

// display genre update get
exports.genre_update_get = (req, res) => {
  let genre_id = checkRequestParamsID(req.params.id);

  res.send('NOT IMPLEMENTED: genre update get');
}

// handle genre update post
exports.genre_update_post = (req, res) => {
  let genre_id = checkRequestParamsID(req.params.id);

  res.send('NOT IMPLEMENTED: genre update post');
}

// display genre delete get
exports.genre_delete_get = (req, res) => {
  let genre_id = checkRequestParamsID(req.params.id);

  res.send('NOT IMPLEMENTED: genre delete get');
}

// handle genre delete post
exports.genre_delete_post = (req, res) => {
  let genre_id = checkRequestParamsID(req.params.id);

  res.send('NOT IMPLEMENTED: genre delete post');
}

function checkRequestParamsID(id) {
  return (id.match(/^[0-9a-fA-F]{24}$/))
    ? id
    : null;
}
