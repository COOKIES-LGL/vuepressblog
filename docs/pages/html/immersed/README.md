
沉浸式状态栏是指在应用程序中，将状态栏的背景色和应用程序的背景色融合在一起，从而让应用程序的界面更加整洁美观

### H5页面设置沉浸式状态栏`theme-color`

theme-color 是一个专门为移动设备设计的 meta 标签，用于设置网站的主题色，可以改变浏览器地址栏、任务管理器等的颜色。  
目前，theme-color 标签的兼容性已经非常好，几乎所有主流的移动设备和浏览器都支持它。  
H5页面可以通过设置meta标签来设置浏览器顶部状态栏颜色。具体的做法是在页面的head标签中添加以下meta标签：  
``` html
// head头meta标签
<meta name="theme-color" content="#ffffff" />
<script>
// 获取meta标签  
var meta = document.querySelector('meta[name="theme-color"]');  
// 修改颜色值  
meta.setAttribute('content', '#颜色值');  
</script>
```

### 获取到状态栏高度后，就可以设置页面的根布局组件的 paddingTop 值了
