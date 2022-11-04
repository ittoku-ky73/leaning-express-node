# コントローラ非同期処理

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/flow_control_using_async

この記事では、Asyncを使ってコントローラに非同期処理を追加したり、Asyncについても見ていきます。

Asyncの詳細は、[ドキュメント](https://caolan.github.io/async/v3/docs.html)を参照してください。

### なぜ非同期が必要なのか

Expressで使用するメソッドのほとんどは非同期です。実行する操作を指定してコールバックを渡します。メソッドはすぐに戻り、要求された操作が完了するとコールバックが呼び出されます。Expressの慣例により、コールバック関数はエラー値を最初のパラメータ（成功時には`null`）を渡し、関数からの結果を2つ目のパラメータとして渡します。

コントローラが1つの非同期操作を実行するのみの場合、実装は簡単です。

```javascript
exports.some_model_count = (req, res, next) => {
  SomeModel.countDocuments(
    { a_model_field: "match_value" },
    (err, count) => {
      // Do something if there is an err.
      res.render('the_template', { data: count });
    }
  );
};
```

では2つ以上の非同期操作を実行する場合どうでしょう。上記のようなコードでは不可能です。リクエストをデイジーチェーンする方法もありますが、コールバック地獄になりがちです。

理想は、すべてのリクエストを並行に実行し、すべてのクエリが完了したときに実行される単一のコールバックを持つことです。そのために、Asyncモジュールが使われます。

### 並列の非同期操作

[async.parallel()](https://caolan.github.io/async/v3/docs.html#parallel)は、複数の非同期操作を並行して実行するために使用されます。

最初の引数に非同期関数のコレクション（配列、オブジェクト、イテラブル）を渡します。2つ目の引数に関数を渡します。これは非同期関数の勝利が全て終わった後に呼び出される関数（コールバック関数）です。コールバック関数の引数には、`err, result`があります。

```javascript
async.parallel([
  function(callback) {
    setTimeout(function() {
      callback(null, 1);
    }, 200);
  },
  function(callback) {
    setTimeout(function() {
      callback(null, 2);
    }, 100);
  }
], function(err, results) {
  if (err) throw err;
  console.log(results);
  // results is equal to: { 1, 2 }
});
```

### 一連の非同期操作

[async.series()](https://caolan.github.io/async/v3/docs.html#series)は、後続の関数が前の関数の出力に依存しない場合、複数の非同期操作を順番に実行するために使用されます。

```javascript
async.series([
  function(callback) {
    setTimeout(function() {
      callback(null, 'one');
    }, 200);
  },
  function(callback) {
    setTimeout(function() {
      callback(null, 'two');
    }, 100);
  }
], function(err, results) {
  console.log(results);  // ['one','two']
});

```

### 依存する一連の非同期操作

[async.waterfall()](https://caolan.github.io/async/v3/docs.html#waterfall)は、各操作が前の捜査の結果に依存している場合、複数の非同期操作を順番に実行するために使用されます。

```javascript
async.waterfall([
  function(callback) {
    setTimeout(function() {
      callback(null, 'one', 'two');
    }, 1000);
  },
  function(arg1, arg2, callback) {
    // arg1 now equals 'one' and arg2 now equals 'two'
    setTimeout(function() {
      callback(null, 'three');
    }, 2000);
  },
  function(arg1, callback) {
    // arg1 now equals 'three'
    callback(null, 'done');
  }
], function (err, results) {
  console.log(results); // 'done'
});

```

### 地域図書館にAsyncをインストール

Asyncをインストールします。

```shell
npm install async
```

### まとめ

Node/Expressで非同期を使うのは分かったけど、他のruby on railsとかでは、非同期って使わなくていいのかな（疑問）🧐ていうか、Asyncって依存関係なしなのかよ🥸
