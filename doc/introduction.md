# Express/Node入門

> 参考：https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/Introduction

この記事では、Nodeとは何か、Expressとは何か、なぜExpressウェブフレームワークが特別なのか、Expressの主な特徴、主な基本要素についてみていきます。

### Nodeとは

[Node](https://nodejs.org/)は、オープンソースのクロスプラットフォーム実行環境です。開発者はあらゆるサーバーサイドのツールやアプリケーションをJavaScriptで作成することができます。この実行環境はブラウザコンテキスト外での使用、すなわちコンピュータ、またはサーバーOS上での直接実行を目的としています。

そのため、クライアントサイドではブラウザ固有のJavaScript APIが省略され、HTTPやファイルシステムライブラリを含む従来のOS APIがサポートされています。

**ウェブサーバー開発の観点からのNodeの利点**

- パフォーマンス。Nodeはウェブアプリケーションのスループットとスケーラビリティを最適化するように設計されており、多くの一般的なウェブ開発の問題（リアルタイムウェブアプリケーションなど）に非常に適しています。
- コードが「plain old JavaScript」で書かれている。これはブラウザとウェブサーバーの両方のコードを記述しているときに、言語間の「コンテキストシフト」に費やす時間が短くなります。
- JavaScript言語の設計の改善のメリット。`CoffeeScript, ClosureScript, Scala, LiveScript`などが使用できるように、新しく普及している多くの言語がJavaScriptにコンパイル・変換されます。
- Nodeパッケージマネージャー（NPM）。何十万もの再利用可能なパッケージへのアクセスを提供します。クラス最高の依存関係解決機能もあり、ほとんどのビルドツールチェーンの自動化にも使用できます。
- 移植可能。`Microsoft Windows, macOS, Linux, Solaris, FreeBSD, OpenBSD, WebOS, NonStop OS`で利用できます。さらに多くのウェブホスティングプロバイダが、Nodeのサイトをホスティングするための特定のインフラストラクチャとドキュメントを提供しています。
- コミュニティが充実している。

**Hello Node.js**

次の例では、`http://localhost:8000`にHTTPリクエストを待ち受けるウェブサーバーを作成します。リクエストが受信されると、スクリプトはHello Worldという文字列でレスポンスします。

1. ターミナルを開く。
2. `mkdir test-node && cd test-node`を実行。
3. `hello.js`ファイルを作成し、以下のコードを貼り付ける。

```javascript
var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});

  response.end('Hello World\n');
}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
```

4. ファイルを保存。
5. `node hello.js`を実行。
6. http://localhost:8000を開く。

### ウェブフレームワーク

その他の一般的なウェブ開発タスクは、Nodeでは直接サポートされていません。異なるHTTP動詞（`GET, POST, DELETE`など）に特定の処理を追加したい場合、別々のパスでリクエストを個別に処理したり、静的ファイルを提供したり、テンプレートを使用してレスポンスを動的に作成したり、自分自身の手でコードを書く必要があります。そうしないためにウェブフレームワークを使用して、車輪の再発明を避けるようにします。

### Expressとは

[Express](https://expressjs.com/ja/)は、最も一般的なNodeウェブフレーム枠であり、他の多くのNodeウェブフレームワークの基礎となるライブラリです。そして以下の機能を提供しています。

- 異なるURLで異なるHTTP動詞を使用して、リクエストのハンドラを作成。
- テンプレートにデータを挿入してレスポンスを生成するためにビューレンダリングエンジンと統合。
- 接続に使用するポートやレスポンスのレンダリングに使用されるテンプレートの場所などの一般的なウェブアプリケーションの値を設定。
- リクエスト処理パイプライン内の任意の時点で、追加のリクエスト処理。ミドルウェアを追加。

Express自体はかなりシンプルですが、開発者はほぼすべてのウェブ開発問題に対応する互換性のあるミドルウェアパッケージを作成しています。Cookie、セッション、ユーザーログイン、URLパラメータ、POSTデータ、セキュリティヘッダーなどを扱うライブラリなどです。Expressチームが管理するミドルウェアパッケージのリストは、[Express Middleware](http://expressjs.com/en/resources/middleware.html)にあります。

> この柔軟性は諸刃の剣です。ほぼすべての問題や用件に対応するミドルウェアパッケージがありますが、適切なパッケージを使用して作業することは時に挑戦となることがあります。アプリケーションを構造化する「正しい方法」もなく、インターネット上で見つかる多くの例は最適ではないし、ウェブアプリケーションを開発するために必要なことのほんの一部を示しているだけです。

### NodeとExpressの生まれ

- Node、2009年にLinux用にリリース。
- NPM、2010年にリリース、ネイティブWindowsサポートは2012年に追加される。
- Express、2010年11月にリリース。

### NodeとExpressの普及率

ウェブフレームワークの普及は、それが維持されるかどうかの指標であり、ドキュメンテーション、アドオンライブラリ、テクニカルサポートの面でどのようなリソースが利用される可能性が高いかという点で重要です。

サーバー側のフレームワークの普及率は、[Hot Frameworks](http://hotframeworks.com/)のようなサイトで見ることができます。Expressは一般的なフレームワークです。

### Expressは指図するか

ウェブフレームワークは指図をする、指図をしないと分けられることがあります。

指図をしたがるフレームワークは、特定のタスクを扱うのに正しい方法があるという考えを持っています。正しい方法であれば特定の領域における素早い開発をサポートします。しかし、その特定害の問題の解決にあたっては柔軟性に劣り、利用できるコンポーネントやアプローチの選択肢が限られたものになりがちです。

指図をしないフレームワークは、目的の達成のためにコンポーネントをつなぎ合わせる最善の方法や、どのコンポーネントを使うかにさえもあまり制約を設けません。開発者は、コンポーネントを自分自身で探す必要があり、特定のタスクを完了させるのに最適なツールの利用が簡単になります。

Expressは指図をしません。リクエストを処理するチェインの中で、互換性のある好きなミドルウェアを、好きな順番で差し込むことができます。

### Expressコードはどのように見れるか

従来のデータ駆動型ウェブサイトは、ウェブブラウザからのHTTPリクエストを待機します。リクエストが受信されると、アプリケーションはURLパターンと、POSTデータ、GETデータに含まれる可能性のある関連情報に基づいて、必要なアクションを実行します。

必要に応じてデータベースから情報を読み書きしたり、リクエストを満たすために必要な他のタスクを実行したりします。アプリケーションはブラウザにレスポンスを返し、検索されたデータをHTMLテンプレートのプレースホルダに挿入することによって、ブラウザが表示するHTMLページを動的に作成したりできます。

Expressは特定のHTTP動詞と、URLパターンに対してどの関数が呼び出されるかを指定するメソッドと、どのテンプレートエンジンが使用されるかを指定メソッドを提供します。テンプレートエンジンを使用するには、レスポンスにレンダリングするためのテンプレートファイルを配置します。またExpressミドルウェアを使用して、Cookie、セッション、ユーザー、GET/POSTパラメータなどのサポートを追加することができます。

**Hello world Express**

以下の例では、上記の**Hello Node.js**で書いたコードと機能が同じものExpressで書いています。

```javascript
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000');
  console.log('Open http://localhost:3000');
});
```

### モジュールのインポートと作成

モジュールとは、Nodeの`require()`関数を使って外のコードをインポートできるJavaScriptライブラリ・ファイルのことです。Express自体はモジュールです。Expressアプリケーションで使用するミドルウェア、データベースライブラリもモジュールになります。

> モジュールを使用すると、明示的にエクスポートした変数のみがインポートされるため、名前空間を管理するのに役立ちます。

1つの割り当てで完全なオブジェクトをエクスポートする場合は、`module.exports`に割り当てます。

```javascript
module.exports = {
  area: function (width) {
    return width * width;
  },
  perimeter: function (width) {
    return 4 * width;
  }
};
```

### 非同期APIの使用

JavaScriptコードでは、操作に関する処理を書くのに同期APIよりも非同期APIが頻繁に使用されます。Nodeは、シングルスレッドのイベント駆動型実行環境であるため、ノンブロッキングの非同期APIを使用することは、ブラウザよりもNodeにとってさらに重要です。

シングルスレッドは速度とサーバーリソースの点で非常に効率的ですが、完了に時間のかかる同期メソッドを呼び出す関数があるとそうではなくなります。非同期APIについては、JavaScriptで学んだことがここで活かすことができると思います。

### ルートハンドラの作成

ルートハンドラ関数は次のように定義します。

```javascript
app.get('/', function (req, res) {
  res.send('hello world!');
});
```

コールバック関数はリクエストとレスポンスオブジェクトを引数として取ります。この場合、メソッドはレスポンスに対して`send()`メソッドを呼び出して、`hello world!`を返しています。レスポンスメソッドは他にも多数あり、JSONレスポンスを送信する`res.json()`や、ファイルを送信する`res.sendFile()`などがあります。

Expressアプリケーションオブジェクトには、次のようなHTTP動詞のルートハンドラを定義するためのメソッドがあります。

`checkout(), copy(), delete(), get(), head(), lock(), merge(), mkactivity(), mkcol(), move(), m-search(), notify(), options(), patch(), post(), purge(), put(), report(), search(), subscribe(), trace(), unlock(), unsubscribe()`

`app.all()`という特別なルーティングメソッドがあります。これはあらゆるHTTPメソッドにレスポンスして呼び出されます。これはすべてのリクエストメソッドの特定のパスにミドルウェア機能をロードするために使用されます。

```javascript
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...');
  next();
});
```

ルートを使用すると、URL内の特定のパターンの文字と照合し、URLからいくつかの値を抽出し、それらをパラメータとしてルートハンドラに渡すことができます。

多くの場合、サイトの特定の部分のルートハンドラをまとめて、共通のルートプレフィクスを使用してそれらにアクセスすると便利です。Expressでは、`express.Router()`オブジェクトで実現できます。

```javascript
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.send('Wiki home page');
});

router.get('/about', function (req, res) {
  res.send('About this wiki');
});

module.exports = router;
```

メインアプリケーションファイルでルーターを使用するには、次のように書きます。こうすることで、`/wiki/, /wiki/about`からアクセス可能となります。

```javascript
var wikiRouter = require('./wiki');

app.use('/wiki', wikiRouter);
```

### ミドルウェアの使用

ミドルウェアは静的ファイルの提供からエラー処理、HTTPレスポンスの圧縮まで、Expressアプリケーションで広く使用されています。

ルート関数はHTTPクライアントにレスポンスを返すことでHTTPリクエスト、レスポンスサイクルを終了しますが、ミドルウェア関数は通常、リクエスト、レスポンスに対して何らかの操作を実行してから、スタック内の次の機能を呼び出します。これはより多くのミドルウェア、ルートハンドラの場合があります。ミドルウェアが呼び出される順序は開発者次第です。

> ミドルウェアは任意の操作やコードを実行し、リクエストおよびレスポンスオブジェクトに変更を加えることや、リクエスト、レスポンスサイクルを終了することもできます。サイクルが終了しない場合は、`next()`を呼び出して次のミドルウェア機能に制御を渡す必要があります。

Cookieの操作、セッション、ユーザ認証、リクエスト、POSTおよびJSONデータへのアクセス、ロギングなどの一般的なウェブ開発タスクを簡素化するために、ほとんどのアプリはサードパーティ製ミドルウェアを使用します。Expressにも[ミドルウェアパッケージ](https://expressjs.com/ja/resources/middleware.html)があり、NPMで入手できます。

サードパーティのミドルウェアを使用するには、NPMを使用してアプリをインストールする必要があります。例えば、[morgan](http://expressjs.com/en/resources/middleware/morgan.html)というHTTPリクエストロガーミドルウェアをインストールするには次のようにコマンドを入力します。

```shell
npm install morgan
```

つぎに、Expressアプリケーションオブジェクトで`use()`を呼び出してミドルウェアをスタックに追加します。

```javascript
var express = require('express');
var logger = require('morgan');
var app = express();
app.use(logger('dev'));
// ...
```

ミドルウェア関数とルートハンドラコールバックの唯一の違いは、ミドルウェア関数が`next`引数を持つ点です。これはリクエストサイクルを終了させない場合に呼び出します。

以下の例は、ルートの有無にかかわらずミドルウェア関数を追加する方法が書かれています。

```javascript
var express = require('express');
var app = express();

var a_middleware_function = function(req, res, next) {
  // some performance
  next();
}

app.use(a_middleware_function);
app.use('/someroute', a_middleware_function);
app.get('/', a_middleware_function);
app.listen(3000);
```

### 静的ファイルの提供

`express.static`ミドルウェアを使用して、画像、CSS、JavaScriptなどの静的ファイルを提供できます。例えば、Nodeを呼び出す場所と同じレベルで、`public`という名前のディレクトリから画像などを配信するには、次のように書きます。

```javascript
app.use(express.static('public'));
```

publicディレクトリ内のファイルはすべて、ベースURLにそのファイル名を追加することによって提供されます。

```text
http://localhost:3000/images/dog.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/about.html
```

### エラーの処理

エラーは、通常の3つの引数ではなく4つの引数を持つ1つ以上の特別なミドルウェア関数によって処理されます。

```javascript
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

この関数は、リクエスト処理プロセスの最後に書く必要があります。

> スタックトレースは実稼働環境に含まれていません。本番モードで実行するには、環境変数`NODE_ENV`を`production`にする必要があります。
>
> HTTP 404およびその他のエラーステータスコードはエラーとして扱われません。これらを処理したい場合は、ミドルウェア関数を追加して処理する必要があります。

### データベースの使用

Expressアプリケーションは、Nodeでサポートされているデータベースメカニズムを使用することができます。データベースドライバには、`PostgreSQL, MySQL, Redis, SQLite, MongoDB`などがあります。これらを使用するには、NPMを使用してデータベースドライバをインストールする必要があります。

```shell
npm install mongodb
```

データベース自体はローカルやクラウドサーバーにインストールすることができます。Expressコードではドライバが必要で、データベースの接続、作成、参照、更新、削除（CRUD）操作を実行します。以下の例では、MongoDBを使用してデータベースの操作を行なっています。

```javascript
let MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:5000/animals', function (err, db) {
  if (err) throw err;

  let db = client.db.collection('animals')
  db.collection('mammals').find().toArray(function (err, result) {
    if (err) throw err;
    console.log(result);
    client.close();
  });
});
```

もう1つの一般的な方法は、Object Relational Mapper（ORM）を介して間接的にデータベースにアクセスすることです。このアプローチではデータをオブジェクト、モデルとして定義し、ORMはそれらを基礎とするデータベース形式にマッピングします。こうすることで開発者はデータベースのセマンティクスではなく、JavaScriptオブジェクトの観点から考え続けることができ、受信データの検証とチェックを実行するための場所があるという利点があります。

### データのレンダリング（ビュー）

テンプレートエンジン（Expressではビューエンジン）を使用すると、ページの生成時に埋められるデータのプレースホルダを使用して、テンプレート内の出力ドキュメントの構造を指定できます。Expressにはいくつかの[テンプレートエンジン](https://expressjs.com/en/resources/template-engines.html)があります。

テンプレートエンジンを使用するには次のように書きます。

```javascript
var express = require('express');
var app = express();

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'some_template_engine_name');
```

### ファイル構造

Expressは、構造や使用するコンポーネントに関して何も想定していません、ルート、ビュー、静的ファイル、その他のアプリケーション固有のロジックは、任意のディレクトリ構造を持つ任意の数のファイルに存在します。Expressアプリケーション全体を1つのファイルにまとめることは可能ですが、通常は機能（アカウント管理、ブログ、ディスカッション掲示板など）、およびアーキテクチャ上の問題のドメインを使用している場合は、モデル、ビュー、コントローラに基づいてアプリケーションをファイルに分割します。

### まとめ

これでExpressとNodeの主な利点と、Expressの主要な部分の大まかなことは説明しました。Expressは指図しないフレームワークであるため、これらの部分をどのようにまとめるか、どのライブラリを使用するかは、開発者次第です。

そして意図的に非常に軽量なウェブアプリケーションフレームワークであるため、その利点と可能性の多くはサードパーティのライブラリと機能からもたらされています。今後の記事でそれらをより詳しく見ていきます。

普通にむずい🥺ぴえん。指図されないことは自由であり、自由ということは不自由である。
