### 1、日期兼容性

安卓系统下 可以
Date.parse(new Date('2018-03-30 12:00:00'))  
ios系统下 报错
Date.parse(new Date('2018-03-30 12:00:00'))  

``` javascript
// 兼容写法
function formatTimeStamp (time) {
  return Date.parse(new Date('2018/03/30 12:00:00')) || Date.parse(new Date('2018-03-30 12:00:00'))
}

```

### 2、input框聚焦，ios出现outline或者阴影，安卓显示正常

``` css
input:focus{outline:none}
input:{-webkit-appearance: none;}
```

### 3、input 的placeholder属性会使文本位置偏上

``` css
line-height: （和input框的高度一样高）---pc端解决方法
line-height：normal ---移动端解决方法
```

### 4、ios 设置input 按钮样式会被默认样式覆盖
``` css
input,textarea {
  border: 0;
  -webkit-appearance: none;
}
```

### 5、关于 iOS 系统中，中文输入法输入英文时，字母之间可能会出现一个六分之一空格

``` javascript
this.value = this.value.replace(/\u2006/g,'');
```

### 6、移动端点透问题
::: tip
touchstart 早于 touchend 早于click。 亦即click的触发是有延迟的，这个时间大概在300ms左右，也就是说我们tap触发之后蒙层隐藏， 此时 click还没有触发，300ms之后由于蒙层隐藏，我们的click触发到了下面的a链接上。
解决：
- 1、尽量都使用touch事件来替换click事件。例如用touchend事件(推荐)。
- 2、用fastclick https://github.com/ftlabs/fastclick
- 3、用preventDefault阻止a标签的click
:::

### 7、android下取消输入语音按钮
``` css
input::-webkit-input-speech-button {display: none}
```
