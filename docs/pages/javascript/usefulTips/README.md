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