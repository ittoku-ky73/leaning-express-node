# フォームの操作

> 参考：https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/forms

この記事では、EJSを使用してExpressでHTMLフォームを操作する方法、データベースからドキュメントを作成、更新、削除するフォームを作っていきます。

### 概要

HTMLフォームとは、ユーザーがサーバーへ情報を送るのに利用できるフィールドやグループのことです。テキストボックス、チェックボックス、ラジオボタン、日付選択などのタイプがあります。

フォームの処理は複雑です。ページを表示するだけでなく、送信した後の処理の結果をユーザに返さなければいけないからです。

> 地域図書館のウェブサイトは認証済みユーザのみに閲覧を制限する方法については書いていないので、どのユーザでもデータベースに変更を加えることができます。

### HTMLフォーム

基本的な書き方は次のようになります。

```html
<form action="/team_name_url" method="post">
  <label for="team_name">Enter name:</label>
  <input type="text" name="name_field" id="team_name" value="Default name for team">
  <input type="submit" value="OK">
</form>
```

formのactionには、データを送信するURLを指定します。methodには、データを送信するHTTPメソッドを指定します。

### フォームの処理工程

ルートはリクエストを、コントローラ関数、モデル、データベース、の順番で移動します。フォームが複雑なのは、ユーザのデータを処理し、問題があればエラー情報を返す必要があることです。

**フォーム処理のコードに必要なもの、流れ**

- ユーザが最初に見るデフォルトのフォーム
- 送信されたデータをPOSTで受信。
- データの検証、ハッキング防止のための特殊文字置換（サニタイズ）。
- データが有効の場合のアクションを実行。
- すべてのアクションが終了後、ユーザを別のページへ移動させる。

Expressでは、フォーム操作のサポートを提供しており、ミドルウェアを使った`GET, POST`などのパラメータを処理や、その値の検証、サニタイズなどもできます。

### 検証とサニタイズ

フォームからのデータを保存する前に、検証やサニタイズは必須です。

- 検証は、入力された値が各フィールドに対して適切であるか、すべての必須フィールドに対して値が提供されているか確認をします。
- サニタイズは、悪意のあるコンテンツをサーバーに送信のに使用される可能性のある文字を削除したり、置き換えを行います。

これらを行うために、人気のある`express-validator`を使ってフォームデータの検証とサニタイズを行います。

### express-validator

インストールするには次のコマンドを実行します。

```shell
npm install express-validator
```

> ドキュメント：https://github.com/express-validator/express-validator#express-validator

コントローラでバリデータを使用するには、以下のコードをコントローラに記述します。

```javascript
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
```

**express-validatorの機能**

`body(fields[, message])`は、検証と、検証に失敗したときにエラーメッセージを定義します。以下のように書きます。

```javascript
body('name', 'Empty name').isLength({ min: 1 });

body('age', 'Invalid age').optional({ checkFalsy: true }).isISO8601();

body('name').idLength({ min: 1 }).trim().withMessage('Name empty').isAlpha().withMessage('Name must be alphabet letters');
```

`sanitizeBody(fields)`は、サニタイズします。

```javascript
sanitizeBody('name').trim().escape();
sanitizeBody('date').toDate();
```

`validationResult(req)`は、検証と、オブジェクトの形式でエラーを利用できるようにします。

```javascript
(req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // invalid data
  }
  else {
    // valid data
  }
}
```

検証チェーンとサニタイズチェーンは、Expressルートハンドラに渡す必要があるミドルウェアです。ミドルウェアが実行されると、書くバリデーター、サニタイザーが指定された順序で実行されます。

### フォームデザイン

書いてあることがよくわからない。

### ルート

フォーム処理コードを実装するには、同じURLパターンが2つ必要です。

1つはGETルートで、オブジェクトを作成するための新しい空のフォームを表示するためのものです。

2つ目はPOSTルートで、ユーザーが入力したデータの検証と、情報を保存して詳細ページにリダイレクトするか、エラーのあるフォーム再表示するためのものです。

### サブ記事

次の記事は、アプリケーションに必要なフォームを追加するプロセスを説明しています。順番に読んで実装してから先に進んでください。

- [ジャンル作成フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/genre_create_form.md)
- [著者作成フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/author_create_form.md)
- [書籍作成フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/book_create_form.md)
- [書籍コピー作成フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/bookinstance_create_form.md)
- [著者削除フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/author_delete_form.md)
- [書籍更新フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/book_update_form.md)

### 挑戦する

サブ記事を読み終えたら、次は自分の手で、Book, BookInstaceの削除ページの実装を行いましょう。

### まとめ

まだ書かない。
