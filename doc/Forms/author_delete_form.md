# 著者削除フォーム

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Delete_author_form

この記事では、Authorオブジェクトをウェブフォームで削除する方法を見ていきます。

地域図書館のフォーム設計では、オブジェクトを削除する際に他のオブジェクトに参照されているか確認し、参照がされていない場合に限り削除を許可するように設計します。それでもし参照がされているオブジェクトの場合は、先に参照しているオブジェクトを削除してから、そのオブジェクトを削除するようにします。

### コントローラ、ゲット

以下のコードを追加します。

**/controllers/authors.js**

```javascript
exports.author_delete_get = (req, res, next) => {
  let author_id = checkRequestParamsID(req.params.id);

  async.parallel(
    {
      author(callback) { Author.findById(author_id).exec(callback); },
      author_books(callback) { Book.find({ author: author_id }).exec(callback); },
    },
    (err, results) => {
      if (err) next(err);

      // author not found
      if (results.author === null) {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }

      res.render('authors/delete', {
        title: 'Author delete',
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};
```

### コントローラ、ポスト

次のコードを追加します。

**/controllers/authors.js**

```javascript
exports.author_delete_post = (req, res) => {
  let author_id = checkRequestParamsID(req.body.author.id);

  async.parallel(
    {
      author(callback) { Author.findById(author_id).exec(callback); },
      author_books(callback) { Book.find({ author: author_id }).exec(callback); },
    },
    (err, results) => {
      if (err) next(err);

      if (results.author_books.length > 0) {
        res.render('authors/delete', {
          title: 'Author delete',
          author: results.author,
          author_books: results.author_books,
        });
        return;
      }

      Author.findByIdAndRemove(author_id, (err) => {
        if (err) next(err);

        res.redirect('/catalog/authors');
      });
    }
  );
};
```

### ビュー

以下のファイルを作成して、コードを追加します。

**/views/authors/delete.ejs**

```ejs
<h1><%= `${title}: ${author.name}` %></h1>
<p><%= author.lifespan %></p>
<% if (author_books.length) { %>
  <p>
    <strong>Delete the following books before attempting to delete this author</strong>
  </p>
  <div class="mt-3 ms-3">
    <h4>Books</h4>
    <dl>
      <% author_books.forEach(book => { %>
        <dt><a href=<%= book.url %>><%= book.title %></a></dt>
        <dd><%= book.summary %></dd>
      <% }) %>
    </dl>
  </div>
<% } else { %>
  <p>Do you really want to delete this Author?</p>
  <form action="" method="post">
    <div class="form-group">
      <input
        type="hidden"
        name="author[id]"
        id="author_id"
        class="form-control"
        required
        value=<%= author._id %>
      >
    </div>
    <input type="submit" class="btn btn-primary" value="Delete author">
    <script>
      const deleteForm = document.querySelector('form');

      deleteForm.addEventListener('submit', (e) => {
        (window.confirm('削除してもよろしいですか？'))
          ? 'Delete'
          : e.preventDefault();
      });
    </script>
  </form>
<% } %>
```

### 削除コントロールを追加する

次に、著者の詳細ビューに削除コントロールを追加します。以下のコードは一番下に追加します。

**/views/authors/detail.ejs**

```ejs
<hr>
<p><a href=<% author.url + '/delete' %>>Delete author</a></p>
```

### どのように見えるか

ブラウザを開いて、「http://localhost:3000」を確認してみましょう。

### まとめ

