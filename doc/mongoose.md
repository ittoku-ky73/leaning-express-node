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

MDNの方ではMongooseを使用していますが、こちらではPrismaを使用します。Prismaの方が今では有名だからです。

### LocalLibraryにMongooseを使用する

Mongooseは、ドキュメント思考のデータモデルを使用するオープンソースのNoSQLデータベースであり、MongoDBのフロントエンドとして機能します。MongoDBデータベースのドキュメントとコレクションは、リレーショナルデータベースの行とテーブルに似ています。

### LocalLibraryモデルの設計

モデルをコーディングする前に、保存するデータと、オブジェクト感の関係について考えてみましょう。

こういうことは字で説明するより、絵を使った方がわかりやすいです。

![library_website_-_mongoose_express](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose/library_website_-_mongoose_express.png)

関係性については、Bookモデルは他のモデルと関連があって、他のモデル同士には関連がありません。

