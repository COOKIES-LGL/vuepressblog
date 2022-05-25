``` javascript
// 移除对象中的某个属性
let obj = {x: 45, y: 72, z: 68, p: 98};

// Longhand
delete obj.x;
delete obj.p;
console.log(obj); // {y: 72, z: 68}

// Shorthand
let {x, p, ...newObj} = obj;
console.log(newObj); // {y: 72, z: 68}

```

``` javascript
// 使用 URL 这个对象，URL 接口用于解析，构造，规范化和编码 URLs，用它可以很方便的获取链接上的 query 参数。
const url = new URL(window.location.href);
const paramValue = url.searchParams.get( paramName );
console.log(paramValue);

```

``` javascript
// 校验一个元素是否在可视区域内
const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // `entry.target` 是 dom 元素
      console.log(`${entry.target.id} is visible`);
    }
  });
};

const options = {
  threshold: 1.0,
};

const observer = new IntersectionObserver(callback, options);

const btn = document.getElementById( btn );
const bottomBtn = document.getElementById( bottom-btn );

observer.observe(btn);
observer.observe(bottomBtn);

```

``` javascript
// 监控卡顿的fps 如果浏览器卡顿，无法很好地保证渲染的频率，1s 中 frame 无法达到 60 帧
var lastTime = performance.now();
var frame = 0;
var lastFameTime = performance.now();
var loop = function(time) {
    var now =  performance.now();
    var fs = (now - lastFameTime);
    lastFameTime = now;
    var fps = Math.round(1000/fs);
    frame++;
    if (now > 1000 + lastTime) {
        var fps = Math.round( ( frame * 1000 ) / ( now - lastTime ) );
        frame = 0;
        lastTime = now;
    };
    window.requestAnimationFrame(loop);
}
```
::: warning
requestAnimationFrame 比起 setTimeout、setInterval的优势主要有两点：
1、requestAnimationFrame 会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒60帧。
2、在隐藏或不可见的元素中，requestAnimationFrame将不会进行重绘或回流，这当然就意味着更少的的cpu，gpu和内存使用量。
3、requestAnimationFrame默认返回一个id，cancelAnimationFrame只需要传入这个id就可以停止了.
:::

### Void
由于 void 总是返回 undefined，而 void 总是计算它旁边的表达式，你有一个非常简洁的方法从函数返回而不返回一个值，但仍然调用一个回调例如：
``` javascript
// 返回除 undefined 以外的其他内容会使程序崩溃 
function middleware(nextCallback) { 
  if(conditionApplies()) { 
    return void nextCallback(); 
  } 
} 

这让我想到了 void 最重要的通途：它是你程序的安全门。当你的函数总是应该返回 undefined 时，你可以确保始终如此。

button.onclick = () => void doSomething(); 
```
