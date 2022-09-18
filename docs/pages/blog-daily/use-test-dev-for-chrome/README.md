### 背景

&nbsp;&nbsp;开发业务需求时，或者需要定位不同环境的前端问题时，除了其他debug与问题定位方案之外，最终都有可能需要在本地启动环境然后debug。
但是由于samesite的限制，会产生跨域问题，或者某些后端服务的限制，referer校验等等，都会对本地debug进行阻塞，为了解决这个问题

### 原理

通过代理我们需要的资源映射至本地文件，其他所有内容均正常请求，达到类似“替换个别资源”的效果。

核心代理点：

1、替换页面的html文件指向到本地  
2、间接的替换js与css资源文件，在代码更新重新编译后，页面刷新即可访问  
3、api相关依然访问生产环境，所以对于请求来说，属于同域，不存在跨域问题  
4、代理登陆路由，登陆相关操作继续走生产环境，一般本地开发不包含account模块  

### 实现

#### 浏览器内代理

**依赖whistle实现node服务**

```bash:no-line-numbers

npm install -g whistle // 安装
or
yarn add global whistle 

w2 start // 使用默认端口
or
w2 start -p 8080  //设置自定义端口

w2 stop //启动

127.0.0.1:8899 // 访问
```

**whistle配置:**
[(官方教程)](https://wproxy.org/whistle/quickstart.html)
访问 127.0.0.1:8899 -> Rules -> Default -> 粘贴下面的配置信息

匹配规则（以下规则为seller center项目联调时的配置）

::: tip
// 可根据不同环境要求自行调整域名和环境等信息
/^https:\/\/(seller\.|banhang\.)(.*\.)?shopee\.(com\.)?.*?\/(.*)/ localhost:4200/$4 excludeFilter:///(.*)?\/api\/.*/ excludeFilter:///favicon\.ico/ excludeFilter:///registration\/static\/translation/ 
excludeFilter:///\/account\/signin/ excludeFilter:///pfb/
:::

规则解释：

目标环境下，除了Api模块 Pfb模块 登陆功能 admin入口 以外的所有资源， 均匹配本地的localhost:4200端口（或者你其他项目的其他端口），  
至此， 页面访问的html文件，以及对应的js css文件都会实际请求本地

配置完成后需要安装证书以支持https

访问 127.0.0.1:8899 -> HTTPS -> Download root CA -> 完成安装

打开下载的文件，执行安装

然后重启服务(w2 stop w2 start)

[**SwitchyOmega 安装**](https://jingyan.baidu.com/article/219f4bf7a0b737de442d38e8.html)

**SwitchyOmega 配置**  
新增情景模式（代理服务器） 命名：Whistle 配置代理协议： http 代理服务器：127.0.0.1 代理端口： 8899

新增情景模式（切换规则） 命名： SellerCenter 条件配置：seller..shopee. 情景模式: 选择Whistle

可以按照配置多个项目的转发规则，灵活切换

到此，配置成功，   
需要确保whistle已经开启，whistle操作台的开关置为ON，上述配置均已完成后， 访问目标页面，使用chrome插件switchyomega切换情景模式至SellerCenter, 页面会刷新按照你配置的代理规则进行加载。