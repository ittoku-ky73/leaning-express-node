# 本の詳細ページ

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Book_detail_page

この記事では、自動生成された`_id`フィールド値を使用して、特定のBookインスタンスを表示していきます。

### コントローラ

以下のコードを追加します。

**/controllers/books.js**

```javascript
exports.book_detail = (req, res, next) => {
  let book_id = checkRequestParamsID(req.params.id);

  async.parallel(
    {
      book(callback) {
        Book.findById(book_id)
          .populate('author')
          .populate('genres')
          .exec(callback);
      },
      bookinstance(callback) {
        Bookinstance.find({ book: book_id }).exec(callback);
      }
    }, (err, results) => {
      if (err) next(err);

      // book not found
      if (results.book === null) {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }

      res.render('books/detail', {
        title: results.book.title,
        book: results.book,
        bookinstances: results.bookinstance,
      });
    }
  );
};

function checkRequestParamsID(id) {
  return (id.match(/^[0-9a-fA-F]{24}$/))
    ? id
    : null;
}
```

> `checkRequestParamsID(id)`は、`req.params.id`が、「0から9、aからz、AからZの24文字」かどうか見ています。なぜかというと、この条件以外のIDで検索をかけると、`castError`が起きてしまうためです。そうなってしまうと本があるかどうか判定する前にこのエラーが起きてしまうためこの関数を定義しています。
>
> 参考：https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id

### ビュー

以下のコードを追加します。

**/views/books/detail.ejs**

```ejs
<h1><%= book.title %></h1>
<ul class="list-group">
  <li class="list-group-item">
    <strong>Author:</strong>
    <a href=<%= book.author.url %>><%= book.author.name %></a>
  </li>
  <li class="list-group-item">
    <strong>Summary:</strong>
    <span><%= book.summary %></span>
  </li>
  <li class="list-group-item">
    <strong>ISBN:</strong>
    <span><%= book.isbn %></span>
  </li>
  <li class="list-group-item">
    <strong>Genres:</strong>
    <% if (book.genres.length) { %>
      <% book.genres.forEach(genre => { %>
        <a href=<%= genre.url %>><%= genre.name %></a>
      <% }) %>
    <% } else { %>
      <span>none</span>
    <% } %>
  </li>
</ul>
<div class="mt-3 ms-3">
  <h2>Copies:</h2>
  <% if (bookinstances.length) { %>
    <% bookinstances.forEach(bookinstance => { %>
      <hr>
      <% switch(bookinstance.status) {
        case 'Available': %>
          <p class="text-success"><%= bookinstance.status %></p>
          <% break;
        case 'Maintenance': %>
          <p class="text-danger"><%= bookinstance.status %></p>
          <% break;
        default: %>
          <p class="text-warning"><%= bookinstance.status %></p>
          <% break;
      } %>
      <p>
        <strong>Imprint:</strong>
        <%= bookinstance.imprint %>
      </p>
      <% if (bookinstance.status !== 'Available') { %>
        <p>
          <strong>Due back:</strong>
          <%= bookinstance.due_date %>
        </p>
      <% } %>
      <p>
        <strong>Id:</strong>
        <%= bookinstance._id %>
      </p>
    <% }) %>
  <% } else { %>
    <p>There are no copies of this book in the library</p>
  <% } %>
</div>
```

### まとめ

IDチェックするところが時間かかった😭
