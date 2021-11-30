# Set development environment to Node

1. `brew install n`
2. run `n` and selcted lts version

## Nodejs および NPM インストールのテスト

1. `npm init` or `yarn init`
2. run `npm install express --save` or `yarn add express`
3. express test

```javascript
// src/js/helloexpress.js
const express = require('express')
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});
```

4. run `node src/js/helloexpress.js`
5. open `http://localhost:8000`

## 開発の依存関係

**install eslint**

1. run `npm install eslint --save-dev` or `yarn add -D eslint `
2. add scripts to `package.json`

```javascript
"scripts": {
  "lint": "eslint src/js"
}
```

3. run `npm run lint` or `yarn lint`

## Express Application Generatorのインストール

[Express Application Generator](https://expressjs.com/ja/starter/generator.html) ツールは Express アプリケーションの「スケルトン」を生成します。

1. run `npm install express-generator -g`
2. `express helloworld`
3. `DEBUG=helloworld:* npm start`