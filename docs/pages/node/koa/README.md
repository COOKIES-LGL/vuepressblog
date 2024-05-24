
### koa-sslify koa配置证书

``` js
const Koa = require('koa');
const sslify = require('koa-sslify');
const app = new Koa();
// ... 其他中间件和路由配置 ...
// 使用sslify中间件
app.use(sslify());
// 启动服务器
const port = process.env.PORT || 443;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```
