# 地域図書館テンプレート

> 参考：https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/LocalLibrary_base_template

この記事では、プロジェクトの基本テンプレートを作成していきます。

この基本テンプレートには、Bootstrapを使用しており、headに追加しています。

**views/layout.ejs**

```ejs
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
  <%= typeof title !=='undefined' ? title : 'Error' %>
  </title>
  <!-- bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
  <link rel='stylesheet' href='/stylesheets/style.css' />
</head>

<body>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-2">
        <ul class="sidebar-nav">
          <li><a href="/catalog">Home</a></li>
          <li><a href="/catalog/books">All books</a></li>
          <li><a href="/catalog/authors">All authors</a></li>
          <li><a href="/catalog/genres">All genres</a></li>
          <li><a href="/catalog/bookinstances">All book-instances</a></li>
          <li><hr></li>
          <li><a href="/catalog/author/create">Create new author</a></li>
          <li><a href="/catalog/book/create">Create new book</a></li>
          <li><a href="/catalog/genre/create">Create new genre</a></li>
          <li><a href="/catalog/bookinstance/create">Create new book-instance (copy)</a></li>
        </ul>
    </div>
    <div class="col-sm-10">
        <%- body %>
    </div>
  </div>
</div>
</body>

</html>
```

### まとめ

ここではlayout.ejsに上のコードをコピペするだけ😎