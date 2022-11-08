const Genre = require('../models/genre');
const Book = require('../models/book');

const async = require('async');

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
exports.genre_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: genre create get');
}

// handle genre create post
exports.genre_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: genre create post');
}

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
