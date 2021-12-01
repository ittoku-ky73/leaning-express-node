var Author = require('../models/author');

// Display list of all Authors
exports.author_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Author list')
};

// Display detail page for a specific Author
exports.author_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
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

