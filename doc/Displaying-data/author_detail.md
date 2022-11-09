# 著者の詳細ページ

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Author_detail_page

この記事では、Authorの詳細ページを作っていきます。

### コントローラ

次のコードを追加します。

**/controllers/authors.js**

```javascript
const async = require('async');
const Book = require('../models/book');

// Display author detail
exports.author_detail = (req, res, next) => {
  let author_id = checkRequestParamsID(req.params.id);

  async.parallel(
    {
      author(callback) {
        Author.findById(author_id).exec(callback);
      },
      author_books(callback) {
        Book.find({ author: author_id }, 'title summary').exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);

      // author not found
      if (results.author === null) {
        const err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }

      res.render('authors/detail', {
        title: 'Author detail',
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};
```

### ビュー

次のファイルを作成してコードを追加します。

**/views/authors/detail.ejs**

```ejs
<h1>Author: <%= author.name %></h1>
<p><%= `${author.birth_date} - ${author.death_date}` %></p>
<div class="mt-3 ms-3">
  <h2>Books</h2>
  <dl>
    <% if (author_books.length) { %>
      <% author_books.forEach(book=> { %>
        <dt>
          <a href=<%= book.url %>><%= book.title %></a>
          <dd><%= book.summary %></dd>
        </dt>
      <% }) %>
    <% } else { %>
      <p>This author has no books</p>
    <% } %>
  </dl>
</div>

```

### まとめ

ここも作業🤪
