const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const { body, validationResult } = require('express-validator');

// GET /catalog/genres
// Display list of all Genre.
exports.genre_list = function(req, res) {
  Genre.find()
    .sort([ ['name', 'ascending'] ])
    .exec(function(err, genres) {
      if (err) throw err;

      // successful, so render
      res.render('genre_list', {
        title: 'Genre List',
        genre_list: genres
      });
    });
};

// GET /catalog/genre/:id
// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
  async.parallel(
    {
      genre: function(callback) {
        Genre.findById(req.params.id)
          .exec(callback);
      }, 
      genre_books: function(callback) {
        Book.find({ 'genre': req.params.id })
          .exec(callback);
      },
    }, function(err, results) {
      if (err) throw err;

      if (results.genre == null) { // No results
        var err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }

      // successful, so render
      res.render('genre_detail', {
        title: 'Genre Detail',
        genre: results.genre,
        genre_books: results.genre_books
      });
    }
  );
};

// GET /catalog/genre/create
// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next, ...errors) {
  let genreHash = {
    title: 'Create Genre',
  };

  if (errors)
    genreHash['errors'] = errors.flat();

  res.render('genre_form', genreHash);
};

// POST /catalog/genre/create
// Handle Genre create on POST.
exports.genre_create_post = new Array(
  // validate and sanitize the name field
  genreValidationAndSanitization(),

  // process request after validation and sanitization
  function(req, res, next) {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data
    let genre = new Genre({
      name: req.body.name
    });

    // there are errors. render the form again with sanitized values/error messages
    if (!errors.isEmpty()) {
      exports.genre_create_get(req, res, next, errors.array());
      return;
    }

    // check if genre with same name already exists
    Genre.findOne({ 'name': req.body.name })
      .exec(function(err, found_genre) {
        if (err) throw err;

        // genre exists, redirect to its detail page
        if (found_genre) {
          return res.redirect(found_genre.url);
        }

        // data from form is valid
        genre.save(function(err) {
          if (err) throw err;
          // genre saved. redirect to genre detail page
          console.log(genre);
          res.redirect(genre.url);
        });
      });
  }
);

// Display Genre update form on GET.
exports.genre_update_get = function(req, res, next, ...errors) {
  Genre.findById(req.params.id, function(err, genre) {
    if (err) throw err;

    if (genre == null) {
      let error = new Error('Genre not found');
      error.status = 404;
      next(err);
    }

    genreHash = {
      title: 'Update Genre',
      genre: genre
    }

    if (errors)
      genreHash['errors'] = errors.flat();

    res.render('genre_form', genreHash);
  });
};

// Handle Genre update on POST.
exports.genre_update_post = new Array(
  // validate and sanitized fields
  genreValidationAndSanitization(),

  function(req, res, next) {
    const errors = validationResult(req);

    let genre = new Genre({
      name: req.body.name,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      return exports.genre_update_get(req, res, next, errors.array());
    }

    // data form is valid. update genre
    Genre.findByIdAndUpdate(req.params.id, genre, {}, function(err, updatedGenre) {
      if (err) throw err;
      // successful, redirect updated genre detail page
      return res.redirect(updatedGenre.url);
    });
  }
);

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next, ...errors) {
  Genre.findById(req.params.id, function(err, genre) {
    if (err) throw err;

    if (genre == null) {
      let error = new Error('Genre not found');
      error.status = 404;
      next(err);
    }

    genreHash = {
      title: 'Delete Genre',
      genre: genre
    }

    if (errors)
      genreHash['errors'] = errors.flat();

    res.render('genre_delete', genreHash);
  });

};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
  Genre.findByIdAndRemove(req.params.id, function(err) {
    if (err) throw err;
    // successful, go to genre list
    res.redirect('/catalog/genres');
  })
};

/*
 * Genre Helper
 */
function genreValidationAndSanitization() {
  return [
    body('name', 'Genre name required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  ];
}
