# 著者作成フォーム

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_author_form

この記事では、Authorオブジェクトをウェブフォームで生成する方法を見ていきます。

### 検証とサニタイズ

以下のコードを追加します。

**/controllers/authors.js**

```javascript
const { body, validationResult } = require('express-validator');
```

### コントローラ、ルートを取得

以下のコードを追加します。

**/controllers/authors.js**

```javascript
exports.author_create_get = (req, res, next) => {
  res.render('authors/form', { title: 'Author create' });
};
```

### コントローラ、ポストルート

以下のコードを追加します。

**/controllers/authors.js**

```javascript
const { check, validationResult } = require('express-validator');
const debug = require('debug')('locallibrary:author');

exports.author_create_post = [
  validationAuthor('author.first_name'),
  validationAuthor('author.family_name'),
  validationAuthor('author.date_of_birth'),
  validationAuthor('author.date_of_death'),
  (req, res, next) => {
    const errors = validationResult(req);
    const author = new Author(req.body.author);
    debug(author);

    // validation error
    if (!errors.isEmpty()) {
      debug('validation error')
      res.render('authors/form', {
        title: 'Author create',
        author: author,
        errors: errors.array(),
      });
      return;
    }

    author.save((err) => {
      if (err) next(err);

      res.redirect(author.url);
    });
  },
];

function validationAuthor(name) {
  switch (name) {
    case 'author.first_name':
      return check(name)
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('First name must be specified')
        .isLength({ max: 100 })
        .withMessage('First name is too long')
        .isAlphanumeric()
        .withMessage('First name has non-alphabetnumeric characters')
    case 'author.family_name':
      return check(name)
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Family name must be specified')
        .isLength({ max: 100 })
        .withMessage('Family name is too long')
        .isAlphanumeric()
        .withMessage('Family name has non-alphabetnumeric characters')
    case 'author.date_of_birth':
      return check(name, 'Invalid ' + name)
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate()
    case 'author.date_of_death':
      return check(name, 'Invalid ' + name)
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate()
  }
}
```

> アルファベット以外の文字セットが多く使用されるケースでは、`isAlphanumeric()`を使用して検証しないでください。

上記のコードの中の日付のバリデーションについて詳しく説明します。ここでは、optional()で空でもエラーが出ないようにし、`isISO8601()`で生年月日がISO8601準拠の日付であることを確認し、`toDate()`で適切なJavaScriptにキャストします。

### ビュー

以下のファイルを作成してコードを追加します。

**/views/authors/form.ejs**

```ejs
<h1><%= title %></h1>
<% if (typeof errors !== 'undefined') { %>
  <ul class="list-group mb-3">
    <% errors.forEach(error => { %>
      <li class="list-group-item list-group-item-danger"><%= error.msg %></li>
    <% }) %>
  </ul>
<% } %>
<form action="/catalog/author/create" method="post">
  <div class="form-group mb-3">
    <label for="first_name">First name:</label>
    <input
      type="text"
      name="author[first_name]"
      id="first_name"
      placeholder="First name"
      class="form-control"
      <%# required %>
      value=<%= typeof author !=='undefined' ? author.first_name : '' %>
    >
  </div>
  <div class="form-group mb-3">
    <label for="family_name">First name:</label>
    <input
      type="text"
      name="author[family_name]"
      id="family_name"
      placeholder="family name"
      class="form-control"
      <%#required %>
      value=<%=typeof author !=='undefined' ? author.family_name : '' %>
    >
  </div>
  <div class="form-group mb-3">
    <label for="date_of_birth">Date of birth:</label>
    <input
      type="date"
      name="author[date_of_birth]"
      id="date_of_birth"
      class="form-control"
      placeholder="dd/mm/yyyy"
      value=<%=typeof author !=='undefined' ? author.date_of_birth : '' %>
    >
  <div class="form-group mb-3">
    <label for="date_of_birth">Date of death:</label>
    <input
      type="date"
      name="author[date_of_death]"
      id="date_of_death"
      class="form-control"
      placeholder="dd/mm/yyyy"
      value=<%=typeof author !=='undefined' ? author.date_of_death : '' %>
    >
  </div>
  <input type="submit" class="btn btn-primary" value="Create author">
</form>

```

### どのように見えるか

http://localhost:3000を開いて、確認して見ましょう。以下の画像のようになっていればOKです。

![locallibary_express_author_create_empty](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_author_form/locallibary_express_author_create_empty.png)

### まとめ

どんどんいこう🤘
