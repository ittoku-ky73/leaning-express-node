# luxonを使った日付の書式設定

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Date_formatting_using_moment

Bookinstanceのリストのビューで日付をページに表示させました。がとても読みにくいものになっています（`Tue Oct 06 2020 15:49:58 GMT+1100 (AUS Eastern Daylight Time)`）。これはなんとかしなくてはいけません。

ここでは、Bookinstanceモデルに`due_date`仮想プロパティを定義して、日付を読みやすい形で返すようにします。

> 以前のMDNのチュートリアルでは、[Moment](https://www.npmjs.com/package/moment)ライブラリを使用していました。しかしそのMomentがレガシーを宣言したため、ここではLuxonを使用します。

### luxonをインストール

以下のコマンドを実行します。

```shell
npm install luxon --save
```

### 仮想プロパティを作成

以下のコードを追加します。

**/models/bookinstance.js**

```javascript
const { DateTime } = require('luxon');

BookInstanceSchema.virtual('due_date').get(function() {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});
```

### ビューを更新

以下のコードに書き換えます。

**/views/bookinstances/index.ejs**

```ejs
<% if bookinstance.status !== 'Available' { %>
  <span>(Due: <%= bookinstance.due_date %>)</span>
<% } %>
```

### まとめ

簡単✌️
