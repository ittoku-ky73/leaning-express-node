# 書籍コピー作成フォーム

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_BookInstance_form

この記事では、BookInstanceオブジェクトをウェブフォームで作成する方法を見ていきます。

### コントローラ、ゲット

以下のコードを追加します。

**/controllers/bookinstances.js**

```javascript
const { check, validationResult } = require('express-validator');
const Book = require('../models/book');

exports.bookinstance_create_get = (req, res, next) => {
  Book.find({}, 'title').exec((err, books) => {
    if (err) next(err);

    res.render('bookinstances/form', {
      title: 'Bookinstance create',
      books: books,
    });
  });
};
```

### コントローラ、ポスト

以下のコードを追加します。

**/controllers/bookinstances.js**

```javascript
exports.bookinstance_create_post = [
  validationBookinstance('bookinstance.book'), 
  validationBookinstance('bookinstance.imprint'),
  validationBookinstance('bookinstance.status'),
  validationBookinstance('bookinstance.due_back'),
  (req, res, next) => {
    const errors = validationResult(req);
    const bookinstance = new BookInstance(req.body.bookinstance);

    if (!errors.isEmpty()) {
      Book.find({}, 'title').exec((err, books) => {
        if (err) next(err);

        res.render('bookinstances/form', {
          title: 'Bookinstance create',
          books: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance: bookinstance,
        });
      });
      return;
    }

    bookinstance.save((err) => {
      if (err) next(err);

      res.redirect(bookinstance.url);
    });
  },
];

function validationBookinstance(field) {
  switch (field) {
    case 'bookinstance.book':
      return check(field, 'book must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape()
    case 'bookinstance.imprint':
      return check(field, 'imprint must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape()
    case 'bookinstance.status':
      return check(field)
        .escape()
    case 'bookinstance.due_back':
      return check(field, 'Invalid date')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate()
  }
}
```

### ビュー

以下のファイルを作成してコードを追加します。

**/views/bookinstances/form.ejs**

```ejs
<h1><%= title %></h1>
<% if (typeof errors !== 'undefined') { %>
  <ul class="list-group mb-3">
    <% errors.forEach(error => { %>
      <li class="list-group-item list-group-item-danger"><%= error.msg %></li>
    <% }) %>
  </ul>
<% } %>
<form action="/catalog/bookinstance/create" method="post">
  <div class="form-group mt-3">
    <label for="bookinstance_book">Book:</label>
    <select
      type="select"
      name="bookinstance[book]"
      id="bookinstance_book"
      class="form-control"
      placeholder="Select book"
      required
    >
      <% books.forEach((book) => { %>
        <option
          value=<%= book._id %>
          <% if(typeof selected_book !== 'undefined') { %>
            <% if(selected_book === book._id.toString()) { %>
                  <%= 'selected' %>
            <% } %>
          <% } %>
        ><%= book.title %></option>
      <% }) %>
    </select>
  </div>
  <div class="form-group mt-3">
    <label for="bookinstance_imprint">Imprint:</label>
    <input
      type="text"
      name="bookinstance[imprint]"
      id="bookinstance_imprint"
      class="form-control"
      placeholder="Publisher and date information"
      required
      value=<%= (typeof bookinstance === 'undefined') ? '' : bookinstance.imprint %>
    >
  </div>
  <div class="form-group mt-3">
    <label for="bookinstance_due_back">Date when book available:</label>
    <input
      type="date"
      name="bookinstance[due_back]"
      id="bookinstance_due_back"
      class="form-control"
      value=<%= (typeof bookinstance === 'undefined') ? '' : bookinstance.due_back %>
    >
  </div>
  <div class="form-group mt-3">
    <label for="bookinstance_status">Status:</label>
    <select
      type="select"
      name="bookinstance[status]"
      id="bookinstance_status"
      class="form-control"
      placeholder="Select status"
      required
    >
      <option value="Maintenance">Maintenance</option>
      <option value="Available">Available</option>
      <option value="Loaned">Loaned</option>
      <option value="Reserved">Reserved</option>
    </select>
  </div>
  <input type="submit" class="btn btn-primary mt-3" value="Create bookinstance">
</form>
```

### まとめ

慣れたら簡単✌️
