const Genre = require('../models/genre');

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
exports.genre_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: genre detail: ' + req.params.id);
}

// display genre create get
exports.genre_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: genre create get');
}

// handle genre create post
exports.genre_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: genre create post');
}

// display genre delete get
exports.genre_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: genre delete get');
}

// handle genre delete post
exports.genre_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: genre delete post');
}

// display genre update get
exports.genre_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: genre update get');
}

// handle genre update post
exports.genre_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: genre update post');
}
