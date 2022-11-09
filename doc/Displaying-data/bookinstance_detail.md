# 本のコピー詳細ページ

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/BookInstance_list_page

この記事では、Bookinstanceの詳細ページを実装していきます。

### コントローラ

次のコードを追加します。

**/controllers/bookinstances.js**

```javascript
// display bookinstance detail
exports.bookinstance_detail = (req, res, next) => {
  let bookinstance_id = checkRequestParamsID(req.params.id);

  Bookinstance
    .findById(bookinstance_id)
    .populate('book')
    .exec((err, bookinstance) => {
      if (err) return next(err);

      if (bookinstance === null) {
        const err = new Error('Bookinstance not found');
        err.status = 404;
        return next(err);
      }

      res.render('bookinstances/detail.ejs', {
        title: `Copy: ${bookinstance.book.title}`,
        bookinstance: bookinstance,
      });
    });
};

function checkRequestParamsID(id) {
  return (id.match(/^[0-9a-fA-F]{24}$/))
    ? id
    : null;
}
```

### ビュー

次のファイルを作成してコードを追加します。

**/views/bookinstances/detail.ejs**

```ejs
<h1>ID: <%= bookinstance._id %></h1>

<ul>
  <li>
    <strong>Title:</strong>
    <a href=<%= bookinstance.book.url %>><%= bookinstance.book.title %></a>
  </li>
  <li>
    <strong>Imprint:</strong>
    <%= bookinstance.imprint %>
  </li>
  <li>
    <strong>Status:</strong>
    <% if (bookinstance.status === 'Available') { %>
      <span class="text-success"><%= bookinstance.status %></span>
    <% } else if (bookinstance.status === 'Maintenance') { %>
      <span class="text-danger"><%= bookinstance.status %></span>
    <% } else { %>
      <span class="text-warning"><%= bookinstance.status %></span>
    <% } %>
  </li>
  <% if (bookinstance.status !== 'Available') { %>
    <li>
      <strong>Due back:</strong>
      <%= bookinstance.due_date %>
    </li>
    <% } %>
</ul>
```

### チャレンジ

Authorの寿命の日付表示を改善し、2016年10月6日のような形式で表示して見ましょう。

次のように実装していきます。

1. `views/bookinstances/detail.ejs`の`due_date`を`due_back_formatted`に置き換える。
2. `models/author.js`に、`lifespan`という寿命を出力する仮想プロパティを追加します。
3. viewsのファイルで、`date_of_birth, date_of_death`の部分を、`lifespan`に置き換えます。

### まとめ

次は、ウェブフォームの部分をやっていくぜ🤩
