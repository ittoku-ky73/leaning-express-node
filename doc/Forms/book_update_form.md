# 書籍更新フォーム

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Update_Book_form

この記事では、Bookオブジェクトをウェブフォームを使って更新する方法を見ていきます。

### コントローラ、ゲット

以下のコードを追加します。

**/controllers/books.js**

```javascript
// display book update get
exports.book_update_get = (req, res, next) => {
  let book_id = checkRequestParamsID(req.params.id);

  async.parallel(
    {
      book(callback) {
        Book
          .findById(book_id)
          .populate('author')
          .populate('genres')
          .exec(callback);
      },
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

      // book not found
      if (results.book === null) {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }

      results.genres.forEach(genre => {
        if (results.book.genres.includes(genre._id)) {
          genre.checked = 'true';
        }
      });

      res.render('books/update', {
        title: 'Book update',
        authors: results.authors,
        genres: results.genres,
        book: results.book,
      });
    }
  );
}
```

### コントローラ、ポスト

以下のコードを追加します。

**/controllers/books.js**

```javascript
// handle book update post
exports.book_update_post = [
  validationBook('book.title'),
  validationBook('book.summary'),
  validationBook('book.isbn'),
  validationBook('book.author'),
  validationBook('book.genres.*'),
  (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book(req.body.book);
    const book_id = checkRequestParamsID(req.params.id);

    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors(callback) { Author.find(callback); },
          genres(callback) { Genre.find(callback); },
        },
        (err, results) => {
          if (err) next(err);

          results.genres.forEach(genre => {
            if (book.genres.includes(genre._id)) {
              genre.checked = 'true';
            }
          });

          res.render('books/update', {
            title: 'Book update',
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    Book.findByIdAndUpdate(book_id, book, {}, (err, doc) => {
      if (err) next(err);

      res.redirect(doc.url);
    });
  },
];
```

### ビュー

以下のファイルを作成してコードを追加します。

**/views/books/update.ejs**

```ejs
<h1><%= title %></h1>
<% if (typeof errors !== 'undefined') { %>
  <ul class="list-group mb-3">
    <% errors.forEach(error => { %>
      <li class="list-group-item list-group-item-danger"><%= error.msg %></li>
    <% }) %>
  </ul>
<% } %>
<form action="" method="post">
  <input type="hidden" name="book[_id]" value=<%= book._id %>>
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
        <option 
          value=<%= author._id %>
          <%= (author === book.author) ? 'selected' : '' %>
        >
          <%= author.name %>
        </option>
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
  <input type="submit" class="btn btn-primary" value="Update book">
</form>
```

### 更新ボタンを追加する

以下のコードを追加します。

**/views/books/detail.ejs**

```ejs
<p><a href=<%= book.url + '/update' %>>Update book</a></p>
<p><a href=<%= book.url + '/delete' %>>Delete book</a></p>
```

### どのように見えるか

以下のURLにアクセスして、ちゃんと動作するか確認しましょう。

http://localhost:3000/catalog/books

### まとめ

これでフォームの章は終わり。バイバイ👋
