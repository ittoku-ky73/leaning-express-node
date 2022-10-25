# スケルトンウェブサイトの作成

> 参考：https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/skeleton_website

この記事では、スケルトンウェブサイトプロジェクトの作成、サイト固有のルート、テンプレートビュー、データベース呼び出しなどをみていきます。

### 概要

ここでは、地域図書館ウェブサイト用のフレームワークを作成します。

### アプリケーションジェネレータを使用する

前の記事で説明しましたが、以下のコマンドを実行してツールをインストールします。

```shell
npm install express-generator -g
```

ジェネレータにはオプションがついており、`--help`で見ることができます。

```shell
express --help
```

### ビューエンジンを選ぶ

Express Application Generatorには、利用可能なテンプレートエンジンがいろいろあります。デフォルトでは`Jade`が選択されています。選ぶ基準は、自分自身が必要としている機能が全てあるものを選ぶべきです。テンプレートエンジンを比較するときに考慮すべき点は次のとおりです。

- 生産性、あなたがすでにそのテンプレート言語を使用したことがあるなら、それを使うことで生産的になります。
- 人気度とアクティビティ、これらはバージョンやサポートに影響します。
- スタイル、テンプレートエンジンの中には通常のHTML内にコンテンツを挿入するタイプと、別の構文でHTMLを構成するものがあります。
- パフォーマンス・レンダリング時間。
- 機能、利用を検討しているエンジンが以下の機能を持っているかどうか考慮する必要があります。
  - レイアウトの継承：ベーステンプレートを定義してから、特定のページに対して異なる部分だけを継承する機能。
  - Includeのサポート：他のテンプレートを含めることでテンプレートを構築する機能。
  - 簡潔な変数、ループ制御構文。
  - テンプレートレベルで変数値をフィルタリングする機能。
  - HTML以外の出力フォーマットを生成する機能。
  - 非同期操作とストリーミングのサポート。
  - サーバーだけでなくクライアントでも使用することができること。

地域図書館では、Pugではなく、Ejsを使用します。MDNではPugを使用しています。

### CSSスタイルシートエンジンを選ぶ

`Less, Sass, Compass, Stylus`の中から選ぶことができます。デフォルトはCSSです。ここではSassを使用し~~ます~~ません。MDNではCSSを使っています。

### データベースを選ぶ

後で選びます。

### プロジェクトを作成する

これから作成する地域図書館ウェブサイトでは、EJSテンプレートエンジン、SASSスタイルシートエンジンを使用します。そして以下のコマンドを実行します。

```shell
express locallibrary --view=ejs
```

`--css=sass`オプションを指定すると、警告が表示されて怖いので、`node-sass`をインストールします。

```shell
npm install node-sass
```

と思いましたが、ややこしそうなのでデフォルトのCSSで行きます。

### スケルトンウェブサイトを実行する

まずは、依存関係をインストールします。

```shell
npm install
```

アプリを実行します。エラーがなければ、http://localhost:3000にアクセスします。

```shell
DEBUG=locallibrary:* npm start
```

> DEBUG変数を指定すると、コンソールロギング・デバッグが有効になります。

### ファイル変更時にサーバを再起動させる

現在のExpressアプリの環境では、コードを変更してもサーバーが再起動するまで、変更は反映されません。非常に不便です。

そこで`nodemon`の出番です。このツールをインストールすることでこの問題は解決されます。以下のどちらかのコマンドを実行しましょう。

```shell
# プロジェクト上にインストール
npm install nodemon --save-dev

# 自分のパソコンにインストール
npm install -g nodemon
```

そして、package.jsonのscriptsに以下のコードを挿入します。

```json
"scripts": {
  "start": "node ./bin/www",
  "dev": "nodemon ./bin/www"
}
```

以下のコマンドを実行して、開発用のサーバーを起動させます。

```shell
DEBUG=locallibrary:* npm run dev
```

### 生成されたプロジェクトの中身

**ディレクトリ構造**

スラッシュのついているのがディレクトリで、ついていないのがファイルになっています。package.jsonのscriptsのstartで、`./bin/www`が書いてあります。これはアプリのエントリーポイントで、アプリケーションのエラー処理を行なったり、app.jsを読み込んだりしています。

```text
/locallibrary
  app.js
  /bin
    www
  package.json
  /node_modules
    [about 4,500 subdirectories and files]
  /public
    /images
    /javascripts
    /stylesheets
      style.css
  /routes
    index.js
    users.js
  /views
    error.pug
    index.pug
    layout.pug
```

**package.json**

アプリケーションの依存関係とその他の情報を定義します。

```json
{
  "name": "locallibrary",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "ejs": "^3.1.8",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

依存関係には、ビューエンジンやツールなどがあり、下記のようなウェブアプリケーションで役立つパッケージがあります。

- [cookie-parser](https://www.npmjs.com/package/cookie-parser)：Cokieヘッダーを解析し、`req.cookies`を生成するのに使用します。
- [debug](https://www.npmjs.com/package/debug)：Nodeコアのデバッグ技術をモデルにしています。
- [morgan](https://www.npmjs.com/package/morgan)：Node用のHTTPリクエストロガーミドルウェアです。
- [http-errors](https://www.npmjs.com/package/http-errors)：HTTPエラーを提供します。

**WWWファイル**

このファイルは、アプリケーションのエントリーポイントです。また、app.jsファイルをrequire()しています。

**app.js**

このファイルは、expressアプリケーションオブジェクト（app）を作成し、さまざまな設定とミドルウェアを使用してアプリケーションを設定してから、モジュールからアプリケーションをエクスポートします。

上記のwwwエントリーポイントに戻ると、このファイルがインポートされたときに呼び出し元に渡されるのは、`module.exports`オブジェクトです。

app.jsファイルを詳しくみていきましょう。まず、NPMを使用してアプリケーションをダウンロードした`express, cookie-parser, morgan`などの便利なNodeライブラリを`require()`してインポートしています。`path`は、ファイルとディレクトリのパスを解析するコアNodeライブラリです。

```javascript
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
```

それから`routes/`ディレクトリから`require()`モジュールを呼び出します。

```javascript
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
```

次に、インポートしたExpressモジュールを使用して、アプリオブジェクトを作成し、テンプレートエンジンを設定します。

```javascript
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
```

次に、`app.use()`を呼び出してミドルウェアライブラリをリクエスト処理チェーンに追加します。また`/public`ディレクトリにあるすべての静的ファイルを処理するように`express.static`ミドルウェアを使用します。

```javascript
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
```

次に、ルート処理コードをリクエスト処理チェーンに追加します。

```javascript
app.use('/', indexRouter);
app.use('/users', usersRouter);
```

次に、エラーとHTTP 404レスポンス用のハンドラメソッドを追加します。

```javascript
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
```

最後にこれまでに設定してきた`app`をモジュールのエクスポートに追加します。

```javascript
module.exports = app;
```

### ルート

/routes/users.jsを例に見ていきます。まずはexpressをロードし、`express.Router()`オブジェクトを取得します。それからそのオブジェクトにルートを指定し、最後にモジュールからルーターをエクスポートします。

```javascript
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
```

このルートは、正しいパターンのHTTP GETリクエストが検出されたときに必ず呼び出されるコールバックを定義します。app.jsにて/usersでルート指定されているので、`users/`のURLが受信されたときにコードが実行されます。

またコールバック関数の3番目の引数の`next`があるということは、この関数はミドルウェア関数です。

### ビュー（テンプレート）

ビュー（テンプレート）は`/views`ディレクトリに保存され、`.ejs`が与えられます。`Response.render()`メソッドは、オブジェクトに渡された名前付き変数の値とともに指定されたテンプレートをレンダリングし、その結果をレスポンスとして送信するために使用されます。

```javascript
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
```

表示されるビューは次の通りになります。

```ejs
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>
  </body>
</html>
```

### チャレンジ

`/routes/users.js`に新しいルートを作成し、`/users/cool`に「You're so cool」というテキストを表示しましょう。サーバーを立ち上げブラウザで、http://localhost:3000/users/cool/にアクセスし、そのテキストが表示されれば成功です。

### まとめ

だんだんわかってきたかも☺️
