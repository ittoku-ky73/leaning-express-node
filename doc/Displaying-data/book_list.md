# 本のリストページ

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Book_list_page

この記事では、本のリストをコントローラで定義して、ビューでページに表示していきます。

### コントローラ

次のコードを追加します。

**/controllers/books.js**

```javascript
exports.book_list = (req, res, next) => {
  Book.find({}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .exec((err, books) => {
      if (err) next(err);

      res.render('book_list', {
        title: 'Book List',
        books: books,
      });
    });
}
```

### ビュー

以下のコードを追加します。

**/views/book_list.ejs**

```ejs
<h1><%= title %></h1>
<ul>
  <% if (books) { %>
    <% books.forEach(book => { %>
      <li>
        <a href="<%= book.url %>"><%= book.title %></a>
        <%= book.author.name %>
      </li>
    <% }) %>
  <% } else { %>
    <li>There are no books</li>
  <% } %>
</ul>
```

### まとめ

ここら辺は作業☀︎
