#! /usr/bin/env node

console.log('books, authors, bookinstances, genres model test');

var async = require('async')

var Author = require('./models/author')
var Book = require('./models/book')
var BookInstance = require('./models/bookinstance')
var Genre = require('./models/genre')

var authors = [];
var books = [];
var bookinstances = [];
var genres = [];

const authorsData = [
  {
    first_name: 'Patrick',
    family_name: 'Rothfuss',
    date_of_birth: '1973-06-06',
    date_of_death: null,
  },
  {
    first_name: 'Ben',
    family_name: 'Bova',
    date_of_birth: '1932-11-8',
    date_of_death: null,
  },
  {
    first_name: 'Isaac',
    family_name: 'Asimov',
    date_of_birth: '1920-01-02',
    date_of_death: '1992-04-06',
  },
  {
    first_name: 'Bob',
    family_name: 'Billings',
    date_of_birth: null,
    date_of_death: null,
  },
  {
    first_name: 'Jim',
    family_name: 'Jones',
    date_of_birth: '1971-12-16',
    date_of_death: null,
  },
];

const genresData = [
  {
    name: 'Fantasy',
  },
  {
    name: 'Science Fiction',
  },
  {
    name: 'French Poetry',
  },
];

/**
 * database setup
 */
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB;

require('dotenv').config();

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function authorCreate(data, callback) {
  let author = new Author(data);

  author.save((err, doc) => {
    if (err) throw err;

    console.log('Author: ', doc);
    authors.push(doc);
    callback(null, doc);
  });
}

function genreCreate(data, callback) {
  let genre = new Genre(data);

  genre.save((err, doc) => {
    if (err) throw err;

    console.log('Genre: ', doc);
    genres.push(doc);
    callback(null, doc);
  });
}

function bookCreate(data, callback) {
  let book = new Book(data);

  book.save((err, doc) => {
    if (err) throw err;

    console.log('Book: ', doc);
    books.push(doc);
    callback(null, doc);
  });
}

function bookinstanceCreate(data, callback) {
  let bookinstance = new BookInstance(data);

  bookinstance.save((err, doc) => {
    if (err) throw err;

    console.log('BookInstance: ', doc);
    bookinstances.push(doc);
    callback(null, doc);
  });
}

function authorsCreate(callback) {
  let series = [];

  authorsData.forEach(data => {
    series.push((callback) => authorCreate(data, callback));
  });
  async.parallel(series, callback);
}

function genresCreate(callback) {
  let series = [];

  genresData.forEach(data => {
    series.push((callback) => genreCreate(data, callback));
  });
  async.parallel(series, callback);
}

function booksCreate(callback) {
  const booksData = [
    {
      title: 'The Name of the Wind (The Kingkiller Chronicle, #1)',
      summary: 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.',
      isbn: '9781473211896',
      author: authors[0],
      genres: [
        genres[0],
      ],
    },
    {
      title: 'The Wise Man\'s Fear (The Kingkiller Chronicle, #2)',
      summary: 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.',
      isbn: '9788401352836',
      author: authors[0],
      genres: [
        genres[0]
      ],
    },
    {
      title: 'The Slow Regard of Silent Things (Kingkiller Chronicle)',
      summary: 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.',
      isbn: '9780756411336',
      author: authors[0],
      genres: [
        genres[0]
      ],
    },
    {
      title: 'Apes and Angels',
      summary: 'Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...',
      isbn: '9780765379528',
      author: authors[1],
      genres: [
        genres[1]
      ],
    },
    {
      title: 'Death Wave',
      summary: 'In Ben Bova\'s previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...',
      isbn: '9780765379504',
      author: authors[1],
      genres: [
        genres[1]
      ],
    },
    {
      title: 'Test Book 1',
      summary: 'Summary of test book 1',
      isbn: 'ISBN111111',
      author: authors[4],
      genres: [
        genres[0],
        genres[1],
      ],
    },
    {
      title: 'Test Book 2',
      summary: 'Summary of test book 2',
      isbn: 'ISBN222222',
      author: authors[4],
      genres: null,
    },
  ];

  let series = [];

  booksData.forEach(data => {
    series.push((callback) => bookCreate(data, callback));
  });
  async.parallel(series, callback);
}

function bookinstancesCreate(callback) {
  const bookinstancesData = [
    {
      book: books[0],
      imprint: 'London Gollancz, 2014.',
      status: 'Available',
    },
    {
      book: books[1],
      imprint: ' Gollancz, 2011.',
      status: 'Loadned',
    },
    {
      book: books[2],
      imprint: ' Gollancz, 2015.',
      // status: null,
    },
    {
      book: books[3],
      imprint: 'New York Tom Doherty Associates, 2016.',
      status: 'Available',
    },
    {
      book: books[3],
      imprint: 'New York Tom Doherty Associates, 2016.',
      status: 'Available',
    },
    {
      book: books[3],
      imprint: 'New York Tom Doherty Associates, 2016.',
      status: 'Available',
    },
    {
      book: books[4],
      imprint: 'New York, NY Tom Doherty Associates, LLC, 2015.',
      status: 'Available',
    },
    {
      book: books[4],
      imprint: 'New York, NY Tom Doherty Associates, LLC, 2015.',
      status: 'Maintenance',
    },
    {
      book: books[4],
      imprint: 'New York, NY Tom Doherty Associates, LLC, 2015.',
      status: 'Loadned',
    },
    {
      book: books[0],
      imprint: 'Imprint XXX2',
      // status: null,
    },
    {
      book: books[1],
      imprint: 'Imprint XXX3',
      // status: null,
    },
  ];

  let series = [];

  bookinstancesData.forEach(data => {
    series.push((callback) => bookinstanceCreate(data, callback));
  });
  async.parallel(series, callback);
}

async.series([
  authorsCreate,
  genresCreate,
  booksCreate,
  bookinstancesCreate
],
  (err, results) => {
    if (err) throw err;

    console.log('results: ', results);
    mongoose.connection.close();
  });
