# EJS

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Template_primer

この記事では、Expressのテンプレートエンジンの1つである`EJS (Enbedded JavaScript)`を見ていきます。またMDNの記事では、Pugについて書かれているので、それをEJSに置き換えたらどうなるのかを書いていきます。

### テンプレートの選択

Expressではさまざまな[テンプレートレンダリングエンジン](https://expressjs.com/en/guide/using-template-engines.html)が使用できます。ここでは、EJSについて見ていきます。

テンプレート言語が異なれば、レイアウトの定義、データのプレースホルダーのマーキングが違ってきます。HTMLでレイアウトを定義するものもあれば、HTMLにトランスパイルできるさまざまなマークアップ形式を使用するものもあります。EJSは1番目のタイプです。

### テンプレート構成

スケルトンウェブサイトを作成したときにMDNではPugを使うように構成されました。package.jsonとapp.jsに次の設定が含まれているはずです。EJSも同じようにしますが、デフォルトだと継承機能がついていないため、`express-ejs-layouts`モジュールも追加しています。

```javascript
var expressLayouts = require('express-ejs-layouts');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
```

viewディレクトリには`.ejs`ファイルが含まれます。

```txt
/locallibrary
  /views
    error.ejs
    index.ejs
    layout.ejs
```

### テンプレート構文

EJSの構文は次のとおりです。

```ejs
<!DOCTYPE html>
<html lang="en">

<head>
  <title>
    <%= title %>
  </title>
  <script type='text/javascript'></script>
</head>

<body>
  <h1><%= title %></h1>
  <p>
    This is a line with <em>some emphasis</em>
    and <strong>strong text</strong> markup.
  </p>
  <p>
    This line has un-escaped data: <em> is emphasized</em>
    and escaped data: <%= "<em> is not emphasized</em>" %>
    This line follows on.
  </p>
  <p>
    'Evaluated and <em>escaped expression</em>:' <%= title %>
  </p>
  <!-- You can add HTML comments directly -->
  <!-- You can add single line JavaScript comments and they are generated to HTML comments -->
  <%# Introducing a single line JavaScript comment with "//-" ensures the comment isn't rendered to HTML %>
  <p>
    A line with a link
    <a href='/catalog/authors'>Some link text</a>
    and some extra text.
  </p>
  <div id="container" class="col">
    <% if(title) { %>
      <p>A variable named "title" exists.</p>
    <% } else { %>
      <p>
        A variable named "title" does not exist.
      </p>
    <% } %>
    <p>
      Pug is a terse and simple template language with a
      strong focus on performance and powerful features.
    </p>
  </div>
  <h2>Generate a list</h2>
  <ul>
    <% for(let i=1; i<=5; i++) { %>
      <li><%= i %></li>
    <% } %>
  </ul>
</body>

</html>
```

- `<%= %>`は、文字列を出力する。
- `<% %>`は、条件式や、ネストするときに使う。出力はされない。
- `<#% %>`は、コメント。HTMLにも出力されない。

### テンプレートの拡張

ヘッダー、フッター、ナビゲーションなどの標準HTMLマークアップを、サイト全体、すべてのページで、共通の構造を持つことは当たり前になっています。開発者に「ボイラープレート」をすべてのページで複製するのではなく、EJSを使用して、基本テンプレートを拡張し、特定のページごとに異なる部分だけ書き換えるようにます。

layout.ejsを次のように書き換えます。

```ejs
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel="stylesheet" href="/stylesheets/style.css">
  </head>
  <body>
    <%- body %>
  </body>
</html>
```

### まとめ

PugよりEJSの方が好きだなぁ🤪
