require('dotenv').config();

/**
 * mongoose setup
 */
const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB;

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Author = require('../models/author');
const Book = require('../models/book');
const Bookinstance = require('../models/bookinstance');
const Genre = require('../models/genre');

/* your code here */
