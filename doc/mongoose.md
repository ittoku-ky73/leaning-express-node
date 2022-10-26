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

## Prisma

> 参考：https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgres

ここからは、MDNから少し離れて、上記のサイトでPrismaを勉強していきます。参考URLを開いてください。

**インストール**

NodejsにPrismaをインストールしていきます。その前にDockerを使って、Postgresqlデータベースサーバーを立てます。

*docker-compose.yml*

```yml
version: "3"

services:
  db:
    image: postgres
    environment:
      POSTGRES_USER: ittoku
      POSTGRES_PASSWORD: password
      POSTGRES_DB: sample
    ports:
      - 5432:5432
    volumes:
      - db_data:/var/lib/postgresql/data
  web:
    build: ./src
    ports:
      - 3000:3000
    volumes: 
      - ./src:/app

volumes:
  db_data: {}
```

*src/Dockerfile*

```dockerfile
FROM node

WORKDIR /app
ADD ./package.json /app/package.json
ADD ./package-lock.json /app/package-lock.json
RUN npm install
ADD . /app

CMD ["npm", "run", "dev"]
```

次に、Prisma CLIを開発依存関係としてプロジェクトに追加します。

```shell
npm install prisma --save-dev
```

次に 、Prisma CLIを使用して、Prismaスキーマファイルテンプレートを作成します。

```shell
npx prisma init
```

**接続**

データベースに接続するには、Prismaスキーマurlブロックのフィールドに、データベース接続URLを設定する必要があります。

```javascript
datasource {
  provider = "postgresql"
  url      = env("DATABASE_URL");
}
```

この場合、`url`は、`.env`ファイルで定義されている環境変数を介して設定されます。

```shell
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

このDATABASE_URLは仮の値で、本番環境のデータベースが決まっている場合、値を変更する必要があります。

**イントロスペクト**

Prismaでデータベースをイントロスペクトします。地域図書館では、上記の4つのテーブルを持つSQLスキーマを定義します。

```sql
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AVAILABLE', 'MAINTENANCE', 'LOANED', 'RESERVED');

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "birthDate" TIMESTAMP(3) NOT NULL,
    "deathDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "summary" VARCHAR(10000) NOT NULL,
    "isbn" VARCHAR(255),
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookInstance" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'MAINTENANCE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" INTEGER,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookInstance" ADD CONSTRAINT "BookInstance_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Genre" ADD CONSTRAINT "Genre_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

次にデータベースをイントロスペクトします。つまりDatabase_URL環境変数の値へアクセスして、Prismaでデータベースを変更する準備をします。

```shell
npx prisma db pull
```

次に、地域図書館のデータモデルは次のようになりました。

```javascript
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Author {
  id        Int      @id @default(autoincrement())
  name      String?  @db.VarChar(255)
  birthDate DateTime
  deathDate DateTime
  books     Book[]
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
}

model Book {
  id           Int            @id @default(autoincrement())
  title        String?        @db.VarChar(255)
  summary      String         @db.VarChar(10000)
  isbn         String?        @db.VarChar(255)
  authorId     Int
  author       Author         @relation(fields: [authorId], references: [id])
  genres       Genre[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @default(now())
  BookInstance BookInstance[]
}

model BookInstance {
  id        Int      @id @default(autoincrement())
  bookId    Int
  book      Book     @relation(fields: [bookId], references: [id])
  status    Status   @default(MAINTENANCE)
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
}

model Genre {
  id        Int      @id @default(autoincrement())
  name      String?  @unique @db.VarChar(100)
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
  book      Book?    @relation(fields: [bookId], references: [id])
  bookId    Int?
}

enum Status {
  AVAILABLE
  MAINTENANCE
  LOANED
  RESERVED
}
```

**prisma/clientをインストール**

インストール。

```shell
npm install @prisma/client
```

次のコマンドで、Prismaスキーマを読み取り、Prismaクライアントライブラリを生成します。

```shell
npx prisma generate
```

### まとめ

一旦ここで区切ります。次の記事でもPrismaを進めていきます。

データベース難しい🤩
