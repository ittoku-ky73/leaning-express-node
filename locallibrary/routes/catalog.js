const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');
const authorsController = require('../controllers/authors');
const genresController = require('../controllers/genres');
const bookinstancesController = require('../controllers/bookinstances');

// root
router.get('/', booksController.index);

/**
 * book routes
 */
router.get('/books', booksController.book_list);


router.get('/book/create', booksController.book_create_get);
router.post('/book/create', booksController.book_create_post);

router.get('/book/:id/update', booksController.book_update_get);
router.post('/book/:id/update', booksController.book_update_post);

router.get('/book/:id/delete', booksController.book_delete_get);
router.post('/book/:id/delete', booksController.book_delete_post);

router.get('/book/:id', booksController.book_detail);

/**
 * author routes
 */
router.get('/authors', authorsController.author_list);

router.get('/author/create', authorsController.author_create_get);
router.post('/author/create', authorsController.author_create_post);

router.get('/author/:id/update', authorsController.author_update_get);
router.post('/author/:id/update', authorsController.author_update_post);

router.get('/author/:id/delete', authorsController.author_delete_get);
router.post('/author/:id/delete', authorsController.author_delete_post);

router.get('/author/:id', authorsController.author_detail);

/**
 * bookinstance routes
 */
router.get('/bookinstances', bookinstancesController.bookinstance_list);

router.get('/bookinstance/create', bookinstancesController.bookinstance_create_get);
router.post('/bookinstance/create', bookinstancesController.bookinstance_create_post);

router.get('/bookinstance/:id/update', bookinstancesController.bookinstance_update_get);
router.post('/bookinstance/:id/update', bookinstancesController.bookinstance_update_post);

router.get('/bookinstance/:id/delete', bookinstancesController.bookinstance_delete_get);
router.post('/bookinstance/:id/delete', bookinstancesController.bookinstance_delete_post);

router.get('/bookinstance/:id', bookinstancesController.bookinstance_detail);

/**
 * genre routes
 */
router.get('/genres', genresController.genre_list);

router.get('/genre/create', genresController.genre_create_get);
router.post('/genre/create', genresController.genre_create_post);

router.get('/genre/:id/update', genresController.genre_update_get);
router.post('/genre/:id/update', genresController.genre_update_post);

router.get('/genre/:id/delete', genresController.genre_delete_get);
router.post('/genre/:id/delete', genresController.genre_delete_post);

router.get('/genre/:id', genresController.genre_detail);

module.exports = router;
