# Introduction of Express/Node

**references**: https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/Introduction

**What's Node**

- Node.js is open source, cross platform. execution environment that allows developers to create any server-side tool or application in JavaScript.
- 利点
  - ウェブアプリケーションのスループットとスケーラビリティを最適化するように設計されており、多くの一般的なウェブ開発の問題 (リアルタイムウェブアプリケーションなど) に非常に適しています
  - コードは "plain old JavaScript" で書かれています。つまり、ブラウザーとウェブサーバーの両方のコードを記述しているときに、言語間の "コンテキストシフト" に費やす時間が短くなります 
  - JavaScript は比較的新しいプログラミング言語であり、他の従来の ウェブサーバー言語 (Python、PHPなど) と比較して言語設計の改善のメリットがあります。CoffeeScript、ClosureScript、Scala、LiveScript などを使用できるように、新しく普及している多くの言語が JavaScript にコンパイル/変換されます。
  - Node パッケージマネージャー (NPM) は、何十万もの再利用可能なパッケージへのアクセスを提供します。クラス最高の依存関係解決機能もあり、ほとんどのビルドツールチェーンの自動化にも使用できます。
  - Node.js は移植可能です。Microsoft Windows、macOS、Linux、Solaris、FreeBSD、OpenBSD、WebOS、および NonStop OS で利用できます。さらに、多くの ウェブホスティングプロバイダが、Node サイトをホスティングするための特定のインフラストラクチャとドキュメントが提供しています。

**Hello Node.js**

```javascript
// load HTTP module
let http = require('http')

// create HTTP Server and listen to port 8000
http.createServer(function(request, response) {

  // Sets the HTTP header response with HTTP status and content type
  response.writeHead(200, {'Content-Type': 'text/plain'});

  // send response body "Hello World"
  response.end('Hello World\n');
}).listen(8000);

// output URL for server accesses
console.log('Server running at http://127.0.0.1:8000/');
```

1. run `node hello.js`
2. open `http://127.0.0.1:8000/`

## Express/Node introduction

Express は最も一般的な Node ウェブフレームワークであり、他の多くの一般的な Node ウェブフレームワークの基礎となるライブラリです。

- 利点
  - 異なる URL のパス (ルート) で異なる HTTP 動詞を使用してリクエストのハンドラを作成します。
  - テンプレートにデータを挿入してレスポンスを生成するために、「ビュー」レンダリングエンジンと統合します。
  - 接続に使用するポートやレスポンスのレンダリングに使用されるテンプレートの場所などの一般的なウェブアプリケーション設定値を設定します。
  - リクエスト処理パイプライン内の任意の時点で、追加のリクエスト処理「ミドルウェア」を追加します。

## Expressは指図をしたがりますか？

<details><summary>Express は指図をしません。</summary>リクエストを処理するチェインの中で、互換性のある好きなミドルウェアを、好きな順番で挿し込むことができます。1 つのファイルまたは複数のファイル、任意のディレクトリ構造を使ってアプリケーションを構成できます。ときに選択肢が多すぎるようにも感じられるでしょう！</details>

## モジュールのインポートと作成

```javascript
// app.js
const express = require('express')
const app = express()
```

```javascript
// square.js
exports.area = function(width) { return width * width };
exports.perimeter = function(width) { return 4 * width; };

// or
module.exports = {
  area: function(width) {
    return width * width;
  },
  
  perimeter: function(width) {
    return 4 * width;
  }
};
```

```javascript
// hoge.js
let square = require('./square');
console.log('The area of a square with a width of 4 is ' + square.area(4));
console.log('the perimeter is ' + square.perimeter(4));
```

## 非同期APIの使用

```javascript
// sync
console.log('First');
console.log('Second');

// async
setTimeout(function() {
  console.log('First');
}, 3000);
console.log('Second');
```

## ルートハンドラの作成

```javascript
app.get('/', function(req, res) {
  res.send('Hello World!');
});

// This method is called in response to any HTTP method
// and load middleware functions into specific path in all request methods
app.all('/secret', function(req, res, next) {
  console.log('Accessing the secret section ...')
  next();
});
```

## ミドルウェアの使用

```javascript
const express = require('express')
const app = express()

// example for middleware function
let a_middleware_function = function(req, res, next) {
  // .. perform some operations
  next() // calling next() will cause Express to call the next middleware function in the chain
}

// add function to use() for all roots and verbs
app.use(a_middleware_function)

// add middleware function to the specified route with use()
app.use('/someroute', a_middleware_function)

// add middleware function to the specified HTTP vervbs and root
app.get('/', a_middleware_function)

app.listen(3000)
```

## 静的ファイルの提供

```javascript
// be able to use files under /public 
app.use(express.static('public'))
```

## エラーの処理

```javascript
app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

## データベースの使用

run `npm install mongodb`

```javascript
// This work is older versions up to mondodb version 2.2.33
let MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/animals', function(err, db) {
  if (err) throw err;
  
  db.collection('mammals').find().toArray(function(err, result) {
    if (err) throw err;
    
    console.log(result);
  })
})

// Code for mongodb version 3.0 and above
let MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/animals', function(err, client) {
  if (err) throw err;
  
	db.collection('mammals').find().toArray(function(err, result) {
    if (err) throw err;
    
    console.log(result);
    client.close();
  })
})
```

## データのレンダリング (ビュー)

```javascript
const express = require('express');
const app = express();

// set directory containing ('views') template
app.set('views', path.join(__dirname, 'views'));

// use to view engine: 'some_template_engine_name'
app.set('view engine', 'some_template_engine_name')

appget('/', function(req, res) {
  res.render('index', { title: 'About dogs', message: 'Dogs rock!' });
});
```

## ファイル構造
