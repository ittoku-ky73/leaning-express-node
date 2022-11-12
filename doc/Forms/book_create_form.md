# 書籍作成フォーム

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_book_form

この記事では、Bookオブジェクトを作成するウェブフォームを作っていきます。

### コントローラ、ルート

以下のコードを追加します。

**/controllers/books.js**

```javascript
const { check, validationResult } = require('express-validator');

// display book create get
exports.book_create_get = (req, res, next) => {
  async.parallel(
    {
      authors(callback) {
        Author
          .find({}, 'first_name family_name _id')
          .sort([['family_name', 'ascending']])
          .exec(callback);
      },
      genres(callback) {
        Genre
          .find({})
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) next(err);

      debug('authors: ', results.authors);
      debug('genres: ', results.genres);
      res.render('books/form', {
        title: 'Book create',
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
};
```

### コントローラ、ポスト

以下のコードを追加します。

**/controllers/books.js**

```javascript
// handle book create post
exports.book_create_post = [
  validationBook('book.title'),
  validationBook('book.summary'),
  validationBook('book.isbn'),
  validationBook('book.author'),
  validationBook('book.genres.*'),
  (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book(req.body.book);

    debug('book: ', book);
    // validation error
    if (!errors.isEmpty()) {
      debug('error!!!')
      async.parallel(
        {
          authors(callback) { Author.find(callback) },
          genres(callback) { Genre.find(callback) },
        },
        (err, results) => {
          if (err) next(err);

          results.genres.forEach(genre => {
            if (book.genres.includes(genre._id)) {
              genre.checked = 'true';
            }
          });

          res.render('books/form', {
            title: 'Book create',
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    book.save((err) => {
      debug('save!!!')
      if (err) next(err);

      res.redirect(book.url);
    });
  },
];

function validationBook(field) {
  switch (field) {
    case 'book.title':
      return check(field, 'Title must not be empty')
        .trim()
        .escape()
        .isLength({ min: 1 });
    case 'book.summary':
      return check(field, 'Summary must not be empty')
        .trim()
        .escape()
        .isLength({ min: 1 });
    case 'book.isbn':
      return check(field, 'ISBN must not be empty')
        .trim()
        .escape()
        .isLength({ min: 1 });
    case 'book.author':
      return check(field, 'Author must not be empty')
        .trim()
        .escape()
        .isLength({ min: 1 });
    case 'book.genres.*':
      return check(field)
        .escape();
  }
}
```

### ビュー

以下のファイルを作成してコードを追加します。

**/views/books/form.ejs**

```ejs
<h1><%= title %></h1>
<% if (typeof errors !== 'undefined') { %>
  <ul class="list-group mb-3">
    <% errors.forEach(error => { %>
      <li class="list-group-item list-group-item-danger"><%= error.msg %></li>
    <% }) %>
  </ul>
<% } %>
<form action="/catalog/book/create" method="post">
  <div class="form-group mb-3">
    <label for="book_title">Title:</label>
    <input
      type="text"
      name="book[title]"
      id="book_title"
      class="form-control"
      placeholder="Name of book"
      required
      value=<%= (typeof book === 'undefined') ? '' : book.title %>
    >
  </div>
  <div class="form-group mb-3">
    <label for="book_author">Author:</label>
    <select
      type="select"
      name="book[author]"
      id="book_author"
      class="form-control"
      placeholder="Select author"
      required
    >
      <% authors.forEach((author) => { %>
        <option value=<%= author._id %>><%= author.name %></option>
      <% }) %>
    </select>
  </div>
  <div class="form-group mb-3">
    <label for="book_summary">Summary:</label>
    <textarea
      name="book[summary]"
      id="book_summary"
      class="form-control"
      placeholder="Summary"
      required
    ><%= typeof book === 'undefined' ? '' : book.summary %></textarea>
  </div>
  <div class="form-group mb-3">
    <label for="book_isbn">ISBN:</label>
    <input
      type="text"
      name="book[isbn]"
      id="book_isbn"
      class="form-control"
      placeholder="ISBN13"
      required
      value=<%= typeof book === 'undefined' ? '' : book.isbn %>
    >
  </div>
  <div class="form-group mb-3">
    <label for="book_genres">Genres:</label>
    <ul>
      <% genres.forEach((genre) => { %>
        <li class="form-check form-check-inline">
          <input
            type="checkbox"
            name="book[genres]"
            id=<%= genre._id %>
            class="form-check-input"
            value=<%= genre._id %>
            <%= (genre.checked) ? 'checked' : '' %>
          >
          <label for=<%= genre._id %> class="form-check-label"><%= genre.name %></label>
        </li>
      <% }) %>
    </ul>
  </div>
  <input type="submit" class="btn btn-primary" value="Create book">
</form>
```

### まとめ

ここは結構複雑、なだけ👌難しくない
