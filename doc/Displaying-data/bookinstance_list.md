# 本のリストページ

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/BookInstance_detail_page_and_challenge

この記事では、Bookinstanceモデルのデータベースからレコードを取得し、それをブラウザで表示していきます。

### コントローラ

次のコードを追加します。

**/controllers/bookinstances.js**

```javascript
exports.bookinstance_list = (req, res, next) => {
  BookInstance
    .find()
    .populate('book')
    .exec((err, bookinstances) => {
      if (err) next(err);

      res.render('bookinstances/index', {
        title: 'Bookinstance list',
        bookinstances: bookinstances,
      });
    });
};
```

### ビュー

以下のコードを追加します。

```ejs
<h1><%= title %></h1>

<% if (bookinstances) { %>
  <% bookinstances.forEach(bookinstance => { %>
    <li>
      <a href=<%= bookinstance.url %>>
        <%= bookinstance.book.title %>
        (<%= bookinstance.imprint %>)
        -
      </a>
      <% switch (bookinstance.status) {
        case 'Available': %>
          <span class="text-success"><%= bookinstance.status %></span>
          <% break;
        case 'Maintenance': %>
          <span class="text-danger"><%= bookinstance.status %></span>
          <% break;
        default: %>
          <span class="text-warning"><%= bookinstance.status %></span>
          <% break;
      } %>
      <% if (bookinstance.status !== 'Available') { %>
        <span>(Due: <%= bookinstance.due_back %>)</span>
      <% } %>
    </li>
  <% }) %>
<% } else { %>
  <li>There are no books</li>
<% } %>
```

### どのように見えるか

ウェブサーバーを立ち上げ、http://localhost:300/catalog/bookinstancesにアクセスして、以下の画像のようになっているか確認してください。

![locallibary_express_bookinstance_list](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/BookInstance_list_page/locallibary_express_bookinstance_list.png)

### まとめ

作業ゲー😫
