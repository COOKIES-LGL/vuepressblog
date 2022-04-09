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