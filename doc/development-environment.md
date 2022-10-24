# Node開発環境の設定

> 参考：https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/development_environment

この記事では、Windows, Linux (Ubuntu), macOS上で、Node/Express開発環境をセットアップする方法や、Expressアプリケーション開発の開始に必要なものを見ていきます。

### Express開発環境概要

NodeとExpressがあるおかげで、ウェブアプリケーションの開発に必要なコンピュータのセットアップが簡単になります。

**Express開発環境とは**

Express開発環境には、Nodejs、NPMパケージマネージャがインストールされています。またオプションでExpress Application Generatorも付けることが可能です。

`Node, NPM`は、準備されたバイナリパッケージ、インストーラ、OSのパッケージマネージャ、またはソースから一緒にインストールされます。Expressは、NPMの依存関係としてインストールされます。依存関係には、テンプレートエンジン、データベースドライバ、認証ミドルウェア、静的ファイルなどのミドルウェアやライブラリが含まれます。

NPMは、Express Application Generatorという、MVCパターンに従ったスケルトンのExpressアプリケーションを作成する便利なツールをインストールすることができます。これを使用することで、開発が楽になります。

テキストエディタ、IDE、Gitなどの開発環境の周辺ツールもインストールすると便利です。というか必須です。

**どのOSがサポートされているか**

Nodeは、Windows, macOS, Linux, Dockerなどで実行できます。

**どのバージョンを使用すべきか**

Nodeにはたくさんのバージョンがあります。新しいバージョン（リリース）にはバグ修正、ECMAScript標準の最新のバージョンのサポート、Node APIの改良などが含まれています。

一般的には最新のバージョンである、LTS（長期サポート）バージョンを使用すべきです。理由は、最新の機能を持ちながら最新のバージョンよりも安定しているからです。もしもLTS (Long Term Support)バージョンにまだない機能が必要な場合は最新バージョンを使用しましょう。

**データベースやその他の依存関係はどうなのか**

データベースドライバ、テンプレートエンジン、認証エンジンなどの依存関係はアプリケーションの一部であり、NPMパッケージマネージャを使用してアプリケーション環境にインポートされます。

### Nodeのインストール

Expressを使用するには、NodejsとNPMをインストールします。

**macOS, Windows**

1. https://nodejs.org/ja/を開き、LTSをダウンロードします。
2. ダウンロードしたファイルを開き、インストールします。

**Ubuntu**

以下のコマンドを実行します。

```shell
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Node, NPMがインストールのチェック**

以下のコマンドを実行して、それぞれのアプリケーションがちゃんとインストールされているかチェックします。

```shell
node -v # v16.x.x
npm -v # 6.x.x
```

次に実際にコードを書いてみて、動作するか見てみましょう。

```javascript
/* hellonode.js */
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
```

最後に、コマンドを実行してエラーが出なければ、http://127.0.0.1:3000にアクセスしてみましょう！

```shell
node hellonode.js
```

### NPMの使用

NPMは、Nodeアプリケーションを操作するのに最も重要なツールです。開発、テスト、運用に必要なパッケージ（JavaScriptライブラリ）を取得するために使用されます。また、開発プロセスで使用されるテストやツールを実行するために使用されることもあります。

NPMコマンドを使用して、必要なパッケージを手動でとってくることはできますが、通常は`package.json`を使用して依存関係を管理します。package.jsonには、パッケージ名、バージョン、説明、実行する初期ファイル、プロダクション依存関係、開発依存関係、動作可能なNodeバージョンなど、特定のJavaScriptパッケージの依存関係が書かれています。

**依存関係の追加**

次の手順に従って、NPMを使用したパッケージのダウンロード、アプリの依存関係に保存、Nodeアプリケーションで実行の流れを見ていきます。

1. まずは新しいディレクトリを作成します。

```shell
mkdir mynodeapp
```

2. 次のコマンドを実行して、`package.json`を作成します。

```shell
npm init
```

3. Expressをインストールします。

```shell
npm install express --save
```

4. `index.js`を作成し、以下のコードを書きます。

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!');
});
```

5. 次のコマンドを実行して、http://127.0.0.1:8000を開きます。

```shell
node index.js
```

**開発の依存関係**

依存関係が開発環境でのみ使用される場合は、開発依存関係として保存する必要があります。例えば、JavaScript Lintingツールのeslintを使用する時には、次のコマンドを実行します。こうすることで、eslintは開発環境でのみインストールされます。本番環境ではインストールされません。

```shell
npm install eslint --save-dev
```

**タスクの実行**

package.jsonに名前付きスクリプトを定義して、NPMでインストールされたパッケージのコマンドを実行することができます。これは、実行中のテスト、開発の自動化、ツールチェーン（JavaScriptの縮小、画像の縮小、コードの解析など）を構築する場合に使用されます。

例えば、eslint開発依存関係のスクリプトを定義するには、`package.json`に次のコードを挿入します。

```json
"ecripts": {
  "lint": "eslint src/js"
}
```

### Express Application Generator

[Express Application Generator](https://expressjs.com/ja/starter/generator.html)は、Expressアプリケーションのスケルトンを生成します。このツールは、グローバルにインストールします。グローバルインストールとは、自分のパソコンでのみインストールするということです。

```shell
npm install express-generator -g
```

そして、以下のコマンドを実行してExpressアプリを作成します。

```shell
express helloworld
```

依存関係をインストールします。

```shell
npm install
```

アプリを実行します。DEBUGは有用なロギングを作成します。そして、http://127.0.0.1:3000/を開きます。

```shell
# Windows
SET DEBUG=helloworld:* & npm start

# Windows PowerShell
SET DEBUG=helloworld:* | npm start

# Linux, macOS
DEBUG=helloworld:* npm start
```

### まとめ

開発環境構築はもう慣れたものさ🙃
