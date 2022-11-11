# leaning-express-node

> 参考：https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs

ここでは、Expressウェブフレームワークの主な利点、開発環境の設定方法、一般的なウェブ開発と配置作業の実行方法についてみていきます。

### 前提条件

サーバーサイドのウェブプログラミングとウェブフレームワークが何かを理解する必要があります。

### 目次

1. [入門](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/introduction.md)
2. [開発環境の設定](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/development-environment.md)
3. Expressチュートリアル
   1. [地域図書館のウェブサイト](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/local-library-website.md)
   2. [スケルトンウェブサイトの作成](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/skeleton-website.md)
   3. [データベースの使用（Mongoose）](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/mongoose.md)
   4. [ルートとコントローラー](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/routes.md)
   5. [ライブラリデータの表示](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/displaying-data.md)
      1. [コントローラ非同期処理](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/async.md)
      2. [EJS](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/ejs.md)
      3. [地域図書館テンプレート](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/template.md)
      4. [ホームページ](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/homepage.md)
      5. [本のリストページ](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/book_list.md)
      6. [本のコピーリストページ](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/bookinstance_list.md)
      7. [luxon](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/luxon.md)
      8. [著者とジャンルのリストページ](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/author_genre_list.md)
      9. [ジャンルの詳細ページ](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/genre_detail.md)
      10. [本の詳細ページ](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/book_detail.md)
      11. [著者の詳細ページ](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/author_detail.md)
      12. [本のコピー詳細ページ](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Displaying-data/bookinstance_detail.md)
   6. [フォームの操作](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/forms.md)
      1. [ジャンル作成フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/genre_create_form.md)
      2. [著者作成フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/author_create_form.md)
      3. [書籍作成フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/book_create_form.md)
      4. [書籍コピー作成フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/bookinstance_create_form.md)
      5. [著者削除フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/author_delete_form.md)
      6. [書籍更新フォーム](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/Forms/book_update_form.md)
   7. [デプロイ](https://github.com/ittoku-ky73/leaning-express-node/blob/main/doc/deployment.md)

