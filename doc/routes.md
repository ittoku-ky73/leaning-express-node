# ルートとコントローラ

> 参考：https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/routes

この記事では、Expressのモジューラルートを作成する方法についてみていきます。

### 概要

前回の記事で、データベースと対話するモデルを定義し、レコードを作成しました。次のステップは、そのレコードをページに表示できるようにし、そのための適切なURLを定義します。これらを実装するには、ルート（URLハンドラ）とビュー（テンプレート）を作成する必要があります。

レコードをページに表示するのに必要なものは次のとおりです。

- サポートされているリクエストを適切なコントローラ関数に転送するルート。
- モデルからデータを取得し、表示するHTMLを作成し、それをユーザのブラウザに表示するコントローラー関数。
- コントローラがレンダリングするためのビュー。

最終的には、本、ジャンル、著者、書籍インスタンス用のリスト、詳細情報、レコード作成、更新、削除するページを作ります。これらを実装するには大きな労力が必要になるので、まずはルートを定義するところから、少しずつ進めていきます。

### ルート入門

ルートは、HTTP動詞（`GET, POST, PUT, DELETE`など）、URLパス、パターンを処理するために呼び出されるExpressコードです。

ルートを作成するにはいろいろありますが、今回は`express.Router()`ミドルウェアを使用して、サイトの特定の部分をルートハンドラでグループ化し、共通のルートを使用してアクセスできるようにします。

### 個別のルートモジュールの定義と使用

以下のコードは、ルートモジュールを作成してExpressアプリで使用する方法が書いてあります。

```javascript
// wiki.js
var express = require('express')
var router = express.Router();

// GET /wiki
router.get('/', function (req, res) {
  res.send('Wiki home page');
});

// GET /wiki/about
router.get('/about', function (req, res) {
  res.send('About this wiki');
});

module.exports = router;
```

次に、app.jsでwikiのルーターを使用します。

```javascript
var wiki = require('./wiki.js');
// ...
app.use('/wiki', wiki);
```

### ルート機能

`res.send()`関数は、ルートがしっかり通っているか確認するのに使えます。

**HTTP動詞**

`express.Router()`にはさまざまなメソッドがあります。

`checkout(), copy(), delete(), get(), head(), lock(), merge(), mkactivity(), mkcol(), move(), m-search(), notify(), options(), patch(), post(), purge(), put(), report(), search(), subscribe(), trace(), unlock(), unsubscribe()`

**ルートパス**

要求をするエンドポイントを定義します。これは「`/, /about, /book`」などのことです。ルートパスは、文字列パターンも使用することができます。文字列パターンとは、正規表現構文のサブセットを使用して、一致するエンドポイントのパターンを定義するものです。サブセットには次のようなものがあります。

| 文字列パターン | 説明                                             | 正規表現                                 |
| -------------- | ------------------------------------------------ | ---------------------------------------- |
| ?              | エンドポイントに先行する文字が0または1が必要。   | `ab+cd`<br />acd abcd                    |
| +              | エンドポイントに先行する文字が1つ以上必要。      | `ab+cd`<br />abcd abbcd abbbcd           |
| *              | エンドポイントに任意の文字列を含めることができる | `ab*cd`<br />abqwer abhogebar abnanndemo |
| ()             | 別の操作を実行する文字セットのグループ化一致。   | `ab(cd)?e`<br />abe abcde                |

ルートパスは、JavaScriptの正規表現にもすることができます。この中ではアスタリスク（*）がよく使用されます。

### ルートパラメータ

URL内の位置で指定された値を取得するために使用される名前付きURLセグメント。名前付きセグメントとは、コロンと名前がつけられたキャプチャされた値です。以下のように使用します。

```javascript
app.get('/users/:userId/books/:bookId', function (req, res) {
  // access userId via: req.params.userId
  // access bookId via: req.params.bookId
  res.send(req.params)
});
```

### 地域図書館で使用するルート

Webページで表示する（GETメソッド）次のように定義します。

- `/catalog`、ホームページ・インデックスページ
- `/catalog/<objects>/`、著者、本、インスタンス、ジャンルのリスト
- `/catalog/<object>/<id>`、idで指定されたフィールド値を持つオブジェクトの詳細ページ。
- `/catalog/<object>/create`、新しいオブジェクトを作成するためのウェブフォームのページ。
- `/catalog/<object>/<id>/delete`、idで指定されたフィールド値を持つオブジェクトを削除するためのウェブフォームのページ。

初めは、`res.send()`を使って、ルートがしっかりと定義されているかチェックします。ルートが定義されていることが確認できてから機能を実装していきます。

### ルートハンドラのコールバック関数を作成する

ルートを定義する前に、ルートが呼び出すすべてのダミー・スケルトンコールバック関数を作成します。コールバックは、`Books, BookInstances, Genres, Authors`のコントローラモジュールに格納されます。

まずは以下のようにフォルダとファイルを作成します。

```txt
/locallibrary
	/controllers
		authors.js
		books.js
		bookInstances.js
		genres.js
```

**/controllers/authors.js**

```javascript
var Author = require('../models/author');

// Display list of all Authors.
exports.author_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Author list');
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update POST');
};
```

**controllers/bookinstances.js**

```javascript
const BookInstance = require("../models/bookinstance");

// Display list of all BookInstances.
exports.bookinstance_list = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance list");
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance create GET");
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance create POST");
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
};

```

**/controllers/genres.js**

```javascript
const Genre = require("../models/genre");

// Display list of all Genre.
exports.genre_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre list");
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre create GET");
};

// Handle Genre create on POST.
exports.genre_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
};

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
```

**/controllers/books.js**

```javascript
const Book = require("../models/book");

exports.index = (req, res) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
};

// Display list of all books.
exports.book_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Book list");
};

// Display detail page for a specific book.
exports.book_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
};

// Display book create form on GET.
exports.book_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create GET");
};

// Handle book create on POST.
exports.book_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create POST");
};

// Display book delete form on GET.
exports.book_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
exports.book_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update POST");
};
```

### カタログルートモジュール

地域と旅館ウェブサイトで必要なすべてのURLルートを作成します。

**/routes/catalog.js**

```javascript
const express = require("express");
const router = express.Router();

// Require controller modules.
const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const genre_controller = require("../controllers/genreController");
const book_instance_controller = require("../controllers/bookinstanceController");

/// BOOK ROUTES ///

// GET catalog home page.
router.get("/", book_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/book/create", book_controller.book_create_get);

// POST request for creating Book.
router.post("/book/create", book_controller.book_create_post);

// GET request to delete Book.
router.get("/book/:id/delete", book_controller.book_delete_get);

// POST request to delete Book.
router.post("/book/:id/delete", book_controller.book_delete_post);

// GET request to update Book.
router.get("/book/:id/update", book_controller.book_update_get);

// POST request to update Book.
router.post("/book/:id/update", book_controller.book_update_post);

// GET request for one Book.
router.get("/book/:id", book_controller.book_detail);

// GET request for list of all Book items.
router.get("/books", book_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/author/create", author_controller.author_create_get);

// POST request for creating Author.
router.post("/author/create", author_controller.author_create_post);

// GET request to delete Author.
router.get("/author/:id/delete", author_controller.author_delete_get);

// POST request to delete Author.
router.post("/author/:id/delete", author_controller.author_delete_post);

// GET request to update Author.
router.get("/author/:id/update", author_controller.author_update_get);

// POST request to update Author.
router.post("/author/:id/update", author_controller.author_update_post);

// GET request for one Author.
router.get("/author/:id", author_controller.author_detail);

// GET request for list of all Authors.
router.get("/authors", author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get(
  "/bookinstance/create",
  book_instance_controller.bookinstance_create_get
);

// POST request for creating BookInstance.
router.post(
  "/bookinstance/create",
  book_instance_controller.bookinstance_create_post
);

// GET request to delete BookInstance.
router.get(
  "/bookinstance/:id/delete",
  book_instance_controller.bookinstance_delete_get
);

// POST request to delete BookInstance.
router.post(
  "/bookinstance/:id/delete",
  book_instance_controller.bookinstance_delete_post
);

// GET request to update BookInstance.
router.get(
  "/bookinstance/:id/update",
  book_instance_controller.bookinstance_update_get
);

// POST request to update BookInstance.
router.post(
  "/bookinstance/:id/update",
  book_instance_controller.bookinstance_update_post
);

// GET request for one BookInstance.
router.get("/bookinstance/:id", book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get("/bookinstances", book_instance_controller.bookinstance_list);

module.exports = router;
```

### indexルートモジュールを更新

ルートパス（`/`）が指定された場合に、カタログパス（`/catalog`）へリダイレクトするようにします。

```javascript
router.get('/', function (req, res) {
  res.redirect('/catalog');
});
```

### app.jsを更新

最後に、`app.js`でカタログルートを追加します。

```javascript
const catalogrouter = require('./routes/catalog');

// ...

app.use('/catalog', catalogRouter);
```

### ルートのテスト

**MDNの方法**

サーバーを立ち上げます。

```shell
DEBUG=express-locallibrary-tutorial:* npm run dev
```

そして、次のURLにアクセスして、エラーページが表示されないことを確認します。

- http://localhost:3000/
- http://localhost:3000/catalog
- http://localhost:3000/catalog/books
- http://localhost:3000/catalog/bookinstances/
- http://localhost:3000/catalog/authors/
- http://localhost:3000/catalog/genres/
- http://localhost:3000/catalog/book/5846437593935e2f8c2aa226
- http://localhost:3000/catalog/book/create

**ittoku-ky73の方法**

テストフレームワークをインストールします。

```shell
npm install jest supertest --save-dev
```

そして以下のコマンドを実行して、テスト用のディレクトリを作成します。

```shell
mkdir test
```

テスト環境が作れたら、`test/catalog.test.js`を作成し、以下のようなコードを実装します。

```javascript
const request = require('supertest');
const app = require('../app.js');

describe('GET /catalog', function () {
  it('it should response the GET catalog', function () {
    return request(app)
      .get('/catalog')
      .expect(200)
//      .expect('Content-Type', /html/)
  });
});

// ...
```

そして、テストを実行します。

```shell
npx jest test/catalog.test.js
```

エラーを吐かなければOK👍

### まとめ

書く量が多い😭
