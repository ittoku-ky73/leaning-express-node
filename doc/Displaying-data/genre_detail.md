# ジャンルの詳細ページ

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Genre_detail_page

この記事では、自動生成された`_id`フィールド値を識別子として使用し、特定のジャンルインスタンスの情報をページに表示していきます。

### コントローラ

次のコードを追加します。ここでは、URLの識別子と一致したジャンルとそのジャンルを持つブックを非同期で処理して、最終的にそのデータをレンダーするという流れになっています。

**/controllers/genres.js**

```javascript
const Book = require('../models/book');
const async = require('async');

// display genre detail
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books(callback) {
        Book.find({ genres: req.params.id }).exec(callback);
      },
    }, (err, results) => {
      if (err) next(err);

      // genre not found
      if (results.genre === null) {
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }

      res.render('genres/detail', {
        title: 'Genre detail',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};
```

また、ジャンルがデータベースに存在しない場合（削除されている可能性がある場合）、`null`を返します。その場合、見つかりませんでした用のページを表示させたいので、Errorオブジェクトを生成し、それを`next`チェーン内のミドルウェア関数に渡します。

### ビュー

以下のコードを追加します。

**/views/genres/detail.ejs**

```ejs
<h1><%= `Genre: ${genre.name}` %></h1>
<h2>Books</h2>
<% if (genre_books.length) { %>
  <dl>
    <% genre_books.forEach(book => { %>
      <dt>
        <a href=<%= book.url %>><%= book.title %></a>
        <dd><%= book.summary %></dd>
      </dt>
    <% }) %>
  </dl>
<% } else { %>
  <p>this genre has no books</p>
<% } %>
```

### まとめ

やっと詳細ページの作成のところまできた😂
