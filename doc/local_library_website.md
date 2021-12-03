# Local Library WebSite

### Overview

- use `Express Application Generator` tool, and create scelton website and application
- Start and Stop the Node webServer
- Use the Database to store Application's Data

- create routes for request various information, and create a template ('view') to render the data as HTML for display in the browser
- Manipulate the form
- Deploy the application to the production environment

### I'm stack. where can I get the source code?

[Sorce Code](https://github.com/mdn/express-locallibrary-tutorial)

## スケルトンweb siteの作成

-  [Express Application Generator](https://expressjs.com/ja/starter/generator.html) ツールを使用して "スケルトン" Web サイトを作成する

### アプリケーションジェネレータを使用する

1. run `npm install express-generator`
2. run `express express-locallibrary-tutorial --view=pug`

**どのビューエンジンを使うべきですか**？

> Kind: 、[EJS](https://www.npmjs.com/package/ejs)、[Hbs](http://github.com/donpark/hbs)、[Pug](https://pugjs.org/api/getting-started.html) (Jade)、[Twig](https://www.npmjs.com/package/twig)、[Vash](https://www.npmjs.com/package/vash)
>
>  Pug (Jade)を使う

**どの CSS スタイルシートエンジンを使うべきですか？**

> Kind: [LESS](https://lesscss.org/)、[SASS](https://sass-lang.com/)、[Compass](http://compass-style.org/)、[Stylus](http://stylus-lang.com/)
>
> CSSを使う

**どのデータベースを使うべきですか？**

> Kind: PostgreSQL、MySQL、Redis、SQLite、MongoDB
>
> mongodb (mongoose)を使う

### ファイルの変更時にサーバの再起動を有効にする

1. run `npm install --save-dev nodemon`
2. set scripts in `package.json`

```json
"scripts": {
  "start": "node ./bin/www",
  "devstart": "nodemon ./bin/www"
},
```

3. run `DEBUG=express-locallibrary-tutorial:* npm run devstart`

### 生成されたプロジェクト

`package.json`

- [cookie-parser](https://www.npmjs.com/package/cookie-parser): Cookie ヘッダーを解析し、`req.cookies` を生成するために使用されます (基本的に Cookie 情報にアクセスするための便利な方法を提供します)
- [debug](https://www.npmjs.com/package/debug): 小さなノードデバッグユーティリティは、Node コアのデバッグ技術をモデルにしています
- [morgan](https://www.npmjs.com/package/morgan): Node 用の HTTP リクエストロガーミドルウェア

## データベースの使用　(Mongoose)

#### データベースにインタラクティブにアプローチする2つの方法

- データベースのネイティブクエリ言語 (例：SQL)を使用する
- オブジェクトデータモデル ("ODM")／オブジェクトリレーショナルモデル ("ORM") を使用する。ODM/ORM は Web サイトのデータを JavaScript オブジェクトとして表し、それが基になるデータベースにマッピングされます。一部の ORM は特定のデータベースに関連付けられていますが、他のデータベースはデータベースに依存しないバックエンドを提供しています

#### どの ORM/ODM を使うべきですか？

- [Mongoose](https://www.npmjs.com/package/mongoose): Mongoose は、非同期環境で動作するように設計された [MongoDB](https://www.mongodb.org/) オブジェクトモデリングツールです
- [Waterline](https://www.npmjs.com/package/waterline): Express ベースの [Sails](http://sailsjs.com/) Web フレームワークから抽出された ORM。Redis、MySQL、LDAP、MongoDB、Postgres など、さまざまなデータベースにアクセスするための統一された API を提供します
- [Bookshelf](https://www.npmjs.com/package/bookshelf): Promise ベースおよび従来の callback インターフェイスの両方を備え、トランザクションのサポート、熱心な/入れ子になったリレーションの読み込み、多態的な関連付け、および1対1、1対多、および多対多のリレーションのサポートを提供します。PostgreSQL、MySQL、および SQLite3 で動作します
- [Objection](https://www.npmjs.com/package/objection): SQL とその基盤となるデータベースエンジン (SQLite 3、Postgres、および MySQL をサポート) の全機能を使用することを可能な限り簡単にします
- [Sequelize](https://www.npmjs.com/package/sequelize) は Node.js と io.js のための Promise ベースの ORM です。PostgreSQL、MySQL、MariaDB、SQLite、および MSSQL のダイアレクトをサポートし、堅実なトランザクションサポート、リレーション、リードレプリケーションなどを備えています
- [Node ORM2](https://node-orm.readthedocs.io/en/latest/) は NodeJS のオブジェクトリレーションマネージャです。MySQL、SQLite、Progres をサポートし、オブジェクト指向のアプローチを使用してデータベースを操作するのを助けます
- [JugglingDB](http://1602.github.io/jugglingdb/) は NodeJS 用のクロスDB ORM で、最も一般的なデータベースフォーマットにアクセスするための共通インターフェイスを提供します。現在 MySQL、SQLite3、Postgres、MongoDB、Redis および js-memory-storage をサポートしています (テスト用の自己記述エンジンのみ)

### ローカルライブラリモデルの設計

![Mongoose Library Model  with correct cardinality](https://mdn.mozillademos.org/files/15645/Library%20Website%20-%20Mongoose_Express.png)

### Mongoose入門書

1. run `npm install mongoose`

#### MongoDB への接続

```javascript
//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
```

#### Define the Schema

```javascript
var schema = new Schema(
{
  name: String,
  binary: Buffer,
  living: Boolean,
  updated: { type: Date, default: Date.now() },
  age: { type: Number, min: 18, max: 65, required: true },
  mixed: Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  array: [],
  ofString: [String], // 他の型でも配列にすることができます。
  nested: { stuff: { type: String, lowercase: true, trim: true } }
});
```

#### Create the model

```javascript
// Define schema
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
  a_string: String,
  a_date: Date
});

// Compile model from schema
var SomeModel = mongoose.model('SomeModel', SomeModelSchema );
```

#### Creating and modifying documents

```javascript
// Create an instance of model SomeModel
var awesome_instance = new SomeModel({ name: 'awesome' });

// Save the new model instance, passing a callback
awesome_instance.save(function (err) {
  if (err) return handleError(err);
  // saved!
});
```

#### Searching for records

```javascript
var Athlete = mongoose.model('Athlete', yourSchema);

// find all athletes who play tennis, selecting the 'name' and 'age' fields
Athlete.find({ 'sport': 'Tennis' }, 'name age', function (err, athletes) {
  if (err) return handleError(err);
  // 'athletes' contains the list of athletes that match the criteria.
});
```

## ルートとコントローラ

![img](https://mdn.mozillademos.org/files/14456/MVC%20Express.png)

#### Defining and using separate route module

```javascript
// route
var express = require('express');
var router = express.Router();

// Home page route.
router.get('/', function (req, res) {
  res.send('Wiki home page');
})

// About page route.
router.get('/about', function (req, res) {
  res.send('About this wiki');
})

module.exports = router;

// app.js
var wiki = require('./wiki.js');
// ...
app.use('/wiki', wiki);
```

