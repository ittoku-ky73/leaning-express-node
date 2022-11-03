const request = require('supertest');
const app = require('../app');

/**
 * book routes
 */

describe('GET /catalog', () => {
  test('it should GET book list', () => {
    request(app)
      .get('/catalog')
      .expect(200)
  });
});

describe('GET /catalog/books', () => {
  test('it should GET book list', () => {
    return request(app)
      .get('/catalog/books')
      .expect(200)
  });
});

describe('GET /catalog/book/create', () => {
  test('it should GET book create page', () => {
    return request(app)
      .get('/catalog/book/create')
      .expect(200)
  });
});

// describe('POST /catalog/book/create', () => {
//   test('it should POST book list', () => {
//     return request(app)
//   });
// });

describe('GET /catalog/book/:id/update', () => {
  test('it should GET update book page', () => {
    return request(app)
      .get('/catalog/book/:id/update')
      .expect(200)
  });
});

// describe('POST /catalog/book/:id/update', () => {
//   test('it should POST book update', () => {
//     return request(app)
//       .post('/catalog/book/:id/update')
//       .expect(200)
//   });
// });

describe('GET /catalog/book/:id/delete', () => {
  test('it should GET delete book page', () => {
    return request(app)
      .get('/catalog/book/:id/delete')
      .expect(200)
  });
});

// describe('POST /catalog/book/:id/delete', () => {
//   test('it should POST book delete', () => {
//     return request(app)
//       .post('/catalog/book/:id/delete')
//       .expect(200)
//   });
// });

describe('GET /catalog/book/:id', () => {
  test('it should GET book detail', () => {
    return request(app)
      .get('/catalog/book/:id')
      .expect(200)
  });
});

/**
 * author routes
 */

describe('GET /catalog/authors', () => {
  test('it should GET author list', () => {
    return request(app)
      .get('/catalog/authors')
      .expect(200)
  });
});

describe('GET /catalog/author/create', () => {
  test('it should GET author create page', () => {
    return request(app)
      .get('/catalog/author/create')
      .expect(200)
  });
});

// describe('POST /catalog/author/create', () => {
//   test('it should POST author list', () => {
//     return request(app)
//   });
// });

describe('GET /catalog/author/:id/update', () => {
  test('it should GET update author page', () => {
    return request(app)
      .get('/catalog/author/:id/update')
      .expect(200)
  });
});

// describe('POST /catalog/author/:id/update', () => {
//   test('it should POST author update', () => {
//     return request(app)
//       .post('/catalog/author/:id/update')
//       .expect(200)
//   });
// });

describe('GET /catalog/author/:id/delete', () => {
  test('it should GET delete author page', () => {
    return request(app)
      .get('/catalog/author/:id/delete')
      .expect(200)
  });
});

// describe('POST /catalog/author/:id/delete', () => {
//   test('it should POST author delete', () => {
//     return request(app)
//       .post('/catalog/author/:id/delete')
//       .expect(200)
//   });
// });

describe('GET /catalog/author/:id', () => {
  test('it should GET author detail', () => {
    return request(app)
      .get('/catalog/author/:id')
      .expect(200)
  });
});

/**
 * bookinstance route
 */

describe('GET /catalog/bookinstances', () => {
  test('it should GET bookinstance list', () => {
    return request(app)
      .get('/catalog/bookinstances')
      .expect(200)
  });
});

describe('GET /catalog/bookinstance/create', () => {
  test('it should GET bookinstance create page', () => {
    return request(app)
      .get('/catalog/bookinstance/create')
      .expect(200)
  });
});

// describe('POST /catalog/bookinstance/create', () => {
//   test('it should POST bookinstance list', () => {
//     return request(app)
//   });
// });

describe('GET /catalog/bookinstance/:id/update', () => {
  test('it should GET update bookinstance page', () => {
    return request(app)
      .get('/catalog/bookinstance/:id/update')
      .expect(200)
  });
});

// describe('POST /catalog/bookinstance/:id/update', () => {
//   test('it should POST bookinstance update', () => {
//     return request(app)
//       .post('/catalog/bookinstance/:id/update')
//       .expect(200)
//   });
// });

describe('GET /catalog/bookinstance/:id/delete', () => {
  test('it should GET delete bookinstance page', () => {
    return request(app)
      .get('/catalog/bookinstance/:id/delete')
      .expect(200)
  });
});

// describe('POST /catalog/bookinstance/:id/delete', () => {
//   test('it should POST bookinstance delete', () => {
//     return request(app)
//       .post('/catalog/bookinstance/:id/delete')
//       .expect(200)
//   });
// });

describe('GET /catalog/bookinstance/:id', () => {
  test('it should GET bookinstance detail', () => {
    return request(app)
      .get('/catalog/bookinstance/:id')
      .expect(200)
  });
});

/**
 * genre route
 */

describe('GET /catalog/genres', () => {
  test('it should GET genre list', () => {
    return request(app)
      .get('/catalog/genres')
      .expect(200)
  });
});

describe('GET /catalog/genre/create', () => {
  test('it should GET genre create page', () => {
    return request(app)
      .get('/catalog/genre/create')
      .expect(200)
  });
});

// describe('POST /catalog/genre/create', () => {
//   test('it should POST genre list', () => {
//     return request(app)
//   });
// });

describe('GET /catalog/genre/:id/update', () => {
  test('it should GET update genre page', () => {
    return request(app)
      .get('/catalog/genre/:id/update')
      .expect(200)
  });
});

// describe('POST /catalog/genre/:id/update', () => {
//   test('it should POST genre update', () => {
//     return request(app)
//       .post('/catalog/genre/:id/update')
//       .expect(200)
//   });
// });

describe('GET /catalog/genre/:id/delete', () => {
  test('it should GET delete genre page', () => {
    return request(app)
      .get('/catalog/genre/:id/delete')
      .expect(200)
  });
});

// describe('POST /catalog/genre/:id/delete', () => {
//   test('it should POST genre delete', () => {
//     return request(app)
//       .post('/catalog/genre/:id/delete')
//       .expect(200)
//   });
// });

describe('GET /catalog/genre/:id', () => {
  test('it should GET genre detail', () => {
    return request(app)
      .get('/catalog/genre/:id')
      .expect(200)
  });
});
