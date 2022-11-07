# 著者とジャンルのリストページ

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Author_list_page

この記事では、著者とジャンルのリストページを作成します。

### コントローラ

Authorリストコントローラ関数では、すべてのAuthorインスタンスのリストを所得し、レンダリングするためにテンプレートを渡す必要があります。

**/controllers/authors.js**

```javascript
exports.author_list = (req, res, next) => {
  Author
    .find()
    .sort([["family_name", "ascending"]])
    .exec((err, authors) => {
      if (err) next(err);

      res.render('authors/index', {
        title: 'Author list',
        authors: authors,
      });
    });
};
```

### ビュー

以下のファイルを作成し、コードを追加します。

**/views/authors/index.ejs**

```ejs
<h1><%= title %></h1>
<ul>
  <% if (authors) { %>
    <% authors.forEach((author) => { %>
      <li>
        <a href=<%= author.url %>>
          <%= `${author.name} (${author.date_of_birth} - ${author.date_of_death})` %>
        </a>
      </li>
    <% }) %>
  <% } else { %>
    <li>There are no authors</li>
  <% } %>
</ul>
```

上記のコードは少し問題があります。時間の表示がとても醜いことです。これを前の記事を参考に改善して見ましょう。

**/models/author.js**

```javascript
AuthorSchema.virtual('birth_date').get(function () {
  return formattedDate(this.date_of_birth);
});

AuthorSchema.virtual('death_date').get(function () {
  return formattedDate(this.date_of_death);
});

function formattedDate(date) {
  return (date)
    ? DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED)
    : 'unknown';
}
```

### ジャンル一覧ページチャレンジ

では次に自分の手でジャンルリストのページを実装して見ましょう。

**/controllers/genres.js**

```javascript
exports.genre_list = (req, res, next) => {
  Genre
    .find()
    .sort([['name', 'ascending']])
    .exec((err, genres) => {
      if (err) next(err);

      res.render('genres/index', {
        title: 'Genre list',
        genres: genres,
      });
    });
};
```

**/views/genres/index.ejs**

```ejs
<h1><%= title %></h1>
<ul>
  <% if (genres) { %>
    <% genres.forEach((genre)=> { %>
      <li>
        <a href=<%=genre.url %>>
          <%= genre.name %>
        </a>
      </li>
    <% }) %>
  <% } else { %>
    <li>There are no genres</li>
  <% } %>
</ul>
```

### まとめ

モデルのリストはこれで終わりda!
