# データベースの使用（Mongoose）

> 参考：https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/mongoose

この記事では、Node/Expressを使用したデータベースを使用する方法を見ていきます。データベースはPrismaを使用します。またPrismaでの、スキーマ、モデル、フィールドタイプ、検証、アクセス方法についてみていきます。

### 概要

地域図書館のスタッフは、本と借り手に関する情報を保存します。メンバーは、本の閲覧、検索、予約、借りたりします。それらの情報を効率的に保存、取得のためにデータベースを使用します。

Expressではさまざまなデータベースを使用でき、作成、読み取り、更新、削除（CRUD）操作を行うことができます。

### どのデータベースを使用するか

Expressでは、Nodeでサポートされているデータベースを使用できます。データベースには`PostgreSQL、MySQL、Redis、SQLite、MongoDB`などがあります。

データベースを選ぶ基準は、生産性が向上するまでの学習時間、パフォーマンス、レプリケーション・バックアップの容易さ、コスト、コミュニティサポートなどを考慮すると良いでしょう。

### データベースの対話

データベースと対話する方法は、2つあります。

- データベースのネイティブクエリ言語（SQLなど）を使用する。
- オブジェクトデータモデル（ODM）、オブジェクトリレーショナルモデル（ORM）を使用する。ODM/ORMとは、ウェブサイトのデータをJavaScriptオブジェクトとして表し、基盤となるデータベースにマップされます。特定のデータベースに関連づけられるORMもあれば、データベースに依存しないバックエンドを提供するORMもあります。

SQLは、データベースでサポートしているクエリ言語を使用するので処理が早いです。ODMは、変換コードを使用してオブジェクトとデータベース形式をマッピングするため処理が遅くなります。

ORMの利点は、プログラマがデータベースのセマンティクスではなく、JavaScriptオブジェクトで考えることができる点です。

### どのORM/ODMを使うべきか

NPMには、多数のODM/ORMソリューションがあり、一般的なものは次の通りです。

- [Mongoose](https://www.npmjs.com/package/mongoose)：非同期環境で動作するように設計された[MongoDB](https://www.mongodb.com/)オブジェクトモデリングツール。
- [Sequelize](https://www.npmjs.com/package/sequelize)：`Node.js, io.js`用のPromiseベースのORM。`PostgreSQL、MySQL、MariaDB、SQLite、MSSQL`をサポートしており、堅牢なトランザクションサポート、リレーション、読み取りレプリケーションなどを備えています。

ここではMongooseを使用します。

### LocalLibraryにMongooseを使用する

Mongooseは、ドキュメント思考のデータモデルを使用するオープンソースのNoSQLデータベースであり、MongoDBのフロントエンドとして機能します。MongoDBデータベースのドキュメントとコレクションは、リレーショナルデータベースの行とテーブルに似ています。

### LocalLibraryモデルの設計

モデルをコーディングする前に、保存するデータと、オブジェクト感の関係について考えてみましょう。

こういうことは字で説明するより、絵を使った方がわかりやすいです。

![library_website_-_mongoose_express](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose/library_website_-_mongoose_express.png)

関係性については、Bookモデルは他のモデルと関連があって、他のモデル同士には関連がありません。

## Mongoose入門

ここでは、MongooseをMongoDBデータベースに接続する方法、スキーマとモデルを定義する方法、基本的なクエリ作成方法の概要を見ていきます。

> これから見ていく概要は、[Mongoose（npm）](https://www.npmjs.com/package/mongoose)、[mongoosejs.com](https://mongoosejs.com/docs/guide.html)、を参考に書いたものです。

### Mongoose, MongoDBのインストール

次のコマンドでMongooseをインストールします。

```shell
npm install mongoose
```

Mongooseはインストールされましたが、MongoDBはまだインストールされていません。このチュートリアルでは、[MongoDB Atlas](https://www.mongodb.com/)クラウドベースのデータベースサービスの無料利用枠を使用します。これは開発に適しており、OSに依存しないためチュートリアルに適しています。

### MongoDBの接続

Mongooseには、MongoDBデータベースの接続が必要です。以下のようなコードを実装することで可能になります。

```javascript
// 定義
const mongoose = require('mongoose');

// 接続
const mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// インスタンス生成
const db = mongoose.connection;

// イベント追加
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
```

### モデルの定義と作成

Schemaモデルはインターフェースを使用して定義されます。スキーマを使用すると、各ドキュメントに格納されているフィールドを、検証要件とデフォルト値を一緒に定義することができます。さらに、静的、インスタンスヘルパーメソッドを定義して、データ型の操作を簡単にすることもできます。また、他のフィールドと同様に使用することができ、データベースに格納されない仮想プロパティも定義することができます。

Schemaは、`mongoose.model()`メソッドでコンパイルされます。それを使用してオブジェクトの、検索、作成、更新、削除が可能になります。

### スキーマの定義

以下のように定義します。

```javascript
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SomeModelSchema = new Schema({
  a_string: String,
  a_date: Date,
});
```

### モデルの作成

上記のコードの下に以下のコードを追加します。

```javascript
const SomeModel = mongoose.model('SomeModel', SomeModelSchema);
```

### スキーマタイプ（フィールド）

一般的なスキーマのフィールドタイプの宣言は次のように書きます。

```javascript
const schema = new Schema({
  name: String,
  binary: Buffer,
  living: Boolean,
  updated: { type: Date, default: Date.now() },
  age: { type: Number, min: 18, max: 65, required: true },
  mixed: Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  array: [],
  ofString: [String],
  nested: { stuff: { type: String, lowercase: true, trim: true } },
});
```

- `ObjectId`は、データベース内の特定のモデルのインスタンスを表します。使用例は、指定されたオブジェクトの一意のIDが実際に含まれ、populate()メソッドで、それに関連する情報を取得するなどです。
- `Mixed`は、任意のスキーマタイプ。
- `[]`は、アイテムの配列。JavaScriptの配列操作が可能。

オプションの詳細は、[SchemaTypes](https://mongoosejs.com/docs/schematypes.html)を参照してください。

### 検証

Mongooseは、組み込み、カスタムバリデーター、同期・非同期バリデーターを提供しています。

**組み込みのバリデーター**

- 必須項目。
- 数値の最小値、最大値。
- 文字列の、`enum, match, maxLength, minLength`

```javascript
const breakfastSchema = new Schema({
  eggs: {
    type: Number,
    min: [6, 'too few eggs'],
    max: 12,
    required: [true, 'Why no eggs?'],
  },
  drink: {
    type: String,
    enum: ['Coffee', 'Tea', 'Water'],
  },
});
```

フィールド検証の詳細は、[検証](https://mongoosejs.com/docs/validation.html)を参照してください。

### 仮想プロパティ

取得、設定はできるがMongoDBには保存されていないドキュメントプロパティのこと。ゲッターはフィールドの書式設定と結合に使え、セッターは単一の値を複数の値に分解して保存するのに使えます。仮想プロパティを使用することで。MongoDBに保存されるデータの数が減り、通信量を減らすことができます。

詳細については、[Virtuals](https://mongoosejs.com/docs/guide.html#virtuals)を参照してください。

### メソッドとクエリヘルパー

スキーマには、インスタンスメソッド、静的メソッド、クエリヘルパーを含めることができます。クエリヘルパーを使用すると、Mongooseの連鎖可能なクエリビルダーAPIを拡張できます。例えば、`find(), findOne()`メソッドをベースに、`findMyMethod()`メソッドなどを作成できます。

詳細については、[モデル](https://mongoosejs.com/docs/models.html)を参照してください。

### ドキュメントの作成と変更

レコードを作成するには、`save()`メソッドを使用します。またレコード作成に関する操作は非同期で行われます。

```javascript
const awesome_instance = new SomeModel({ name: 'awesome' });

awesome_instance.save((err) => if (err) return handleError(err));
```

`create()`メソッドは、保存とモデルインスタンスの定義を同時に行います。

```javascript
SomeModel.create({ name: 'also_awesome' }, (err, awesome_instance) => if (err) return handleError(err));
```

`save(), update`メソッドと、ドット構文を使用して、新しいレコードのフィールドにアクセスして、値を変更することもできます。

```javascript
console.log(awesome_instance.name); // 'also_awesome'

awesome_instance.name = 'New cool name';
awesome_instance.save((err) => if (err) return handleError(err));
awesome_instance.update((err) => if (err) return handleError(err));
```

### レコードの検索

JSONでクエリ条件を指定し、クエリメソッドを使用してレコードを検索できます。

```javascript
const Athlete = mongoose.model('Athlete', yourSchema);

Athlete.find({ sport: 'Tennis' }, 'name age', (err, athletes) => {
  if (err) return handleError(err);
});
```

コールバックを指定しない書き方もあります。

```javascript
const query = Athlete.find({ sport: 'Tennis' });

query.select('name age');
query.limit(5);
query.sort({ age: -1 });
query.exec((err, athletes) => if (err) return handleError(err));
```

`where()`メソッドを使用して、ドット演算子でチェインさせる書き方もあります。

```javascript
Athlete.find()
  .where('sport')
  .equals('Tennis')
  .where('age')
  .gt(17)
  .lt(50)
  .limit(5)
  .sort({ age: -1 })
  .select('name age')
  .exec(callback);
```

`find()`メソッドは、一致するすべてのレコードを取得しますが、1つだけレコードを取得したい場合は次のメソッドを使用します。

- `findById()`、指定された`id`を持つドキュメントを検索する。
- `findOne()`、指定された条件に一致する1つのドキュメントを検索する。
- `findByIdAndRemove(), findByIdUpdate(), findOneAndRemove(), findOneAndUpdate()`、検索し、更新や削除をします。

詳細については、[クエリ](https://mongoosejs.com/docs/queries.html)を参照してください。

### 関連ドキュメントの操作

Schemaフィールドでは、1つのドキュメント・モデルインスタンスから別のドキュメント・モデルインスタンスの参照を作成したり、1つのドキュメントから多数のドキュメントの参照を作成できたりします。

```javascript
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authorSchema = Schema({
  name: String,
  stories: [
    { type: Schema.Types.ObjectId, ref: 'Story' }
  ],
});

const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Author'},
  title: String,
});

const Story = mongoose.model('Story', storySchema);
const Author = mongoose.model('Author', authorSchema);
```

関連ドキュメントの参照を保存するには次のように書きます。

```javascript
const bob = new Author({ name: 'Bob Smith' });

bob.save((err) => {
  if (err) return handleError(err));

  const story = new Story({
    title: 'Bob goes sledding',
    author: bob._id,
  });

  story.save((err) => {
    if (err) return handleError(err)
  });
}
```

ストーリの結果で著者情報を取得するには、`populate()`メソッドを使用します。

```javascript
Story.findOne({ title: 'Bob goes sledding' })
  .populate('author')
  .exec((err, story) => {
  if (err) return handleError(err);
  console.log('The author is ' + story.author.name); // The author is Bob Smith
});
```

詳細については、[populate](https://mongoosejs.com/docs/populate.html)を参照してください。

### ファイルごとに1つのスキーマ・モデル

Expressでは任意のファイル構造でスキーマとモデルを作成できますが、各モデル・スキーマごとにファイルを用意してそこにエクスポートしてモデルを作成した方がいろいろとうまくいきます。

```javascript
// File: ./models/somemodel.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SomeModelSchema = new Schema({
  a_string: String,
  a_date: Date,
});

module.exports = mongoose.model('SomeModel', SomeModelSchema);
```

上記のスキーマを使用する場合は、次のように書きます。

```javascript
const SomeModel = require('../models/somemodel.js');
SomeModel.find(callback_function);
```

### MongoDBのセットアップ

[MongoDB Atlas](https://www.mongodb.com/atlas/database)クラウドホストサンドボックスデータベースを使用します。このデータベース層は、冗長性がないため、運用ウェブサイトには適していないとみなされますが、開発とプロトタイピングに最適です。また無料でセットアップでき簡単であること、サービスベンダーとして人気のデータベースであること、運用データベースに合理的に選択できることから、このデータベースを使用しています。

**セットアップ**

1. https://www.mongodb.com/cloud/atlas/registerにアクセスして、アカウントを作成します。
2. Database DeploymentsのCreate a databaseボタンをクリック。
3. Deploy a cloud databaseのShared項目のCreateをクリック。
4. Create a Shared Clusterでリージョンを選択。
5. Security Quickstartでユーザー名とパスワードを入力しユーザを作成する。そしてIPアドレスを追加する。
6. Go to Databasesボタンをクリックする。
7. Database DeploymentsのBrowse Collectionsをクリックする。
8. Add My Own Dataボタンをクリックする。
9. データベースの作成画面で次のように入力する。最後にCreateをクリック。
   1. Database nameにlocal_library
   2. Collection nameにCollection0
10. Cluster0のOverviewでCONNECTをクリックする。
11. Connect your applicationをクリックする。
12. 表示されたURLをコピーする。そして、コピーしたURLの、`dbUser, password, myFirstDatabase`の部分を`username, password, local_library`に置き換える。

### Mongooseをインストール

次は実際に地域図書館のウェブサイトで、以下のコマンドを実行して、Mongooseをインストールします。

```shell
npm install mongoose
```

### MongoDBに接続する。

app.jsに以下のコードを追加します。`insert_your_database_url_here`には先ほどコピーしてきて置き換えを行ったURLを置きます。

```javascript
const mongoose = require('mongoose');
const mongoDB = 'insert_your_database_url_here';
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
```

### LocalLibraryスキーマの定義

以下のようにファイルとフォルダを追加します。

```txt
/locallibrary
	/models
		author.js
		book.js
		bookinstance.js
		genre.js
```

**author.js**

```javascript
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual('name').get(() => {
  return (this.first_name && this.family_name)
    ? `${this.family_name}, ${this.first_name}`
    : '';
});

AuthorSchema.virtual('url').get(() => {
  return `/catalog/author/${this._id}`;
});

module.exports = mongoose.model('Author', AuthorSchema);
```

**book.js**

```javascript
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.types.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [ { type: Schema.Types.ObjectId, ref: 'Genre' } ],
});

bookSchema.virtual('url').get(() => {
  return `/catalog/book/${this._id}`;
});

module.exports = mongoose.model('Book', BookSchema);
```

**bookInstance.js**

```javascript
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
  book: { type: Schema.types.ObjectId, ref: 'Book', required: true },
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  due_back: { type: Date, default: Date.now },
});

bookInstanceSchema.virtual('url').get(() => {
  return `/catalog/bookinstance/${this._id}`;
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
```

**genre.js**

```javascript
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

bookInstanceSchema.virtual('url').get(() => {
  return `/catalog/genre/${this._id}`;
});

module.exports = mongoose.model('Genre', GenreSchema);
```

### モデルのテストを追加

1. [populatedb.js](https://raw.githubusercontent.com/mdn/express-locallibrary-tutorial/main/populatedb.js)を`locallibrary/`にダウンロードします。
2. populatedb.jsを動かすための非同期モジュールをインストールします。

```javascript
npm install async
```

3. 以下のコマンドを実行して、テストを行います。また`your_mongodb_url`に自分のデータベースURLを渡します。

```she
node populatedb your_mongodb_url
```

### まとめ

Mongooseは思ってたより使いやすくわかりやすかった。けど本番で使うとなると「うーん」って感じ🧐Node/Expressでデータベースを使うのは難しいね😗
