# ジャンル作成フォーム

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_genre_form

この記事では、Genreオブジェクトをウェブフォームで作成する方法を見ていきます。

### インポートの検証とサニタイズ方法

`express-validator`を使用して、検証とサニタイズを行います。

まずはインストールします。

```shell
npm install express-validator
```

次に、**/controllers/genres.js**に以下のコードを追加します。

```javascript
const { body, validationResult } = require('express-validator');

// 上記のコードは以下のコードと等価です
const validator = require('express-validator');
const body = validator.body;
const validationResult = validator.validationResult;
```

### コントローラ、ルートを取得

`genre_create_get()`コントローラメソッドを以下のコードに置き換えます。

```javascript
exports.genre_create_get = (req, res, next) => {
  res.render('genres/form', {
    title: 'Genre form',
  });
};
```

### コントローラ、ポストルート

`genre_create_create()`コントローラメソッドを以下のコードに置き換えます。

```javascript
exports.genre_create_create = [
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });

    // validation error
    if (!errors.isEmpty()) {
      res.render('genres/form', {
        title: 'Genre form',
        genre,
        errors: errors.array(),
      });
      return;
    }
    else {
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) next(err);

        if (found_genre) {
          res.redirect(found_genre.url);
        }
        else {
          genre.save((err) => {
            if (err) next(err);

            res.redirect(genre.url);
          });
        }
      });
    }
  },
];
```

最初に注意すべきことは、単一のミドルウェア関数ではなく、コントローラーがミドルウェア関数の**配列**を指定していることです。配列はルーター関数に渡され、各メソッドが順番に呼び出されます。バリデーターはミドルウェア関数であるため、このアプローチが必要です。

では最初のメソッドを見ていきましょう。ここでは、`body`を定義して、`trim`で末尾と先頭の空白を削除し、`isLength`で空ではないことを確認して、`escape`で危険なHTML文字を削除しています。

```javascript
[
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
]
```

次のメソッドでは、検証エラーを抽出するミドルウェア関数を作成します。ここでは、バリデーションで問題があった場合は戻り、問題がなかった場合、Genreを検索し、あれば詳細ページにリダイレクト、なければ新規作成してリダイレクトします。

### ビュー

以下のファイルを作成して、コードを追加します。

**/views/genres/form.ejs**

```ejs
<h1><%= title %></h1>
<% if (errors) { %>
  <ul>
    <% errors.forEach(error => { %>
      <li><%= error.msg %></li>
    <% }) %>
  </ul>
<% } %>
<form action="/catalog/genres/create" method="post">
  <div class="form-group">
    <label for="name">Genre:</label>
    <input type="text" name="name" id="name" placeholder="fantasy, Poetry etc ..." class="form-control" value=<%= (genre === undefined) ? '' : genre.name %>>
  </div>
  <input type="submit" class="btn btn-primary" value="Create genre">
</form>
```

### どのように見えるか

http://localhost:3000/catalog/genre/createを開いて、確認して見ましょう。以下の画像のようになっているはずです。

![locallibary_express_genre_create_empty](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_genre_form/locallibary_express_genre_create_empty.png)

### まとめ

この調子で行くぞ🤟
