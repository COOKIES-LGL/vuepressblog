---
home: false
sidebar: false
---

### 代码输出

``` javascript
var b = 10;
(function b(){
    b = 20;
    console.log(b);
})();
// undefined
// 代码预解析时，会将var b进行变量提升，此时b没有被赋值(b=undefined) (这里有人会说这里明明有个函数表达式呀，为什么没有进入变量提升，因为IIFE自带有词法作用域(我们常理解得作用域))
// 碰到了b = 20，会顺着作用域链寻找是否存在b，发现IIFE作用域中存在b，将IIFE作用域中的b赋值为20(b=20)(因为函数表达式特性，标识符无法被修改，所以这里执行失败)
```
### promise.then的第二个参数写了， promise.catch就不会执行
