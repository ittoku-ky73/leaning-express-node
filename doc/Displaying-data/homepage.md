# ホームページ

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Home_page

この記事では、コントローラ関数を更新して、データベースからのレコードの数を取得し、それをページに表示していきます。

### ルート

以下のコードを追加します。

**/routes/catalog.js**

```javascript
router.get('/', book_controller.index);
```

**/controllers/books.js**

```javascript
exports.index = (req, res, next) => {
  res.send('NOT IMMPLEMENTED: Site home page');
};
```

### コントローラ

`book_controller.index`関数に、[countDocuments()](https://mongoosejs.com/docs/api.html#model_Model.countDocuments)メソッドを使用して、 データベースから`Book, BookInstance, Author Genre`モデルのレコードの数を取得する処理を書いていきます。

**/controllers/books.js**

```javascript
const Book = require('../models/book');
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

const async = require('async');

exports.index = (req, res, next) => {
  async.parallel(
    {
      book_count(callback) {
        Book.countDocuments({}. callback);
      },
      author_count(callback) {
        Author.countDocuments({}, callback);
      },
      genre_count(callback) {
        Genre.countDocuments({}, callback);
      },
      bookinstance_count(callback) {
        BookInstance.countDocuments({}, callback);
      },
      bookinstance_available_count(callback) {
        BookInstance.countDocuments({ status: 'Available' }, callback);
      },
    }, (err, results) => {
      res.render('index', {
        title: 'Local Library Home',
        error: err,
        data: results,
      });
    }
  );
};
```

### ビュー

以下のコードを追加します。

**/views/index.ejs**

```ejs
<h1><%= title %></h1>
<p>
  Welcome to <em>LocalLibrary</em>, a very basic Express website developed
  as a tutorial example on the Mozilla Developer Network.
</p>
<h2>Dynamic content</h2>
<% if(err) { %>
  <p>Error getting dynamic content.</p>
<% } else { %>
  <p>The library has the following record counts:</p>
  <ul>
    <li><strong>Books</strong>: <%= data.book_count %></li>
    <li><strong>Authors</strong>: <%= data.author_count %></li>
    <li><strong>Genres</strong>: <%= data.genre_count %></li>
    <li><strong>Copies</strong>: <%= data.bookinstance_count %></li>
    <li><strong>Copies available</strong>: <%= data.bookinstance_available_count %></li>
  </ul>
<% } %>
```

### どのように見えるか

上記のコードを記述したら、`npm run dev`を実行して、http://localhost:3000を開いて見ましょう。次のような見た目になるはずです。

![locallibary_express_home](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Home_page/locallibary_express_home.png)

### まとめ

だんだん分かってきたぞ😎
