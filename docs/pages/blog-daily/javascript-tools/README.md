---
sidebar: auto
---
``` javascript
function var() {
    console.log(1)
    return 1;
}
function varr(params = var()){
    return 22;
}
```

``` javascript
Math.floor(4.8) === 4;
~~4.9 === 4
```

``` javascript
// 以下代码就可以实现同源跨tab页的数据共享
// 通过自执行函数来确保在新开tab中直接执行
// 方法一：同步已有标签页的sessionStorage数据到新开tab页
(function() {
  // 新打开一个tab标签页并通知其他标签页同步sessionStorage的数据到本标签页
 if (!sessionStorage.length) {
  // 这个调用能触发storage事件，从而达到共享数据的目的
  localStorage.setItem('syncSessionStorage', Date.now());
 };

 // 该事件是核心
 window.addEventListener('storage', function(event) {
  if (event.key == 'syncSessionStorage') {
   // 已存在的标签页会收到这个事件
   localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
   localStorage.removeItem('sessionStorage');

  } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
   // 新开启的标签页会收到这个事件
   var data = JSON.parse(event.newValue);
   for (key in data) {
    sessionStorage.setItem(key, data[key]);
   }
  }
 });
})();
```
----------------------------------------------------------------
Object.seal() 和 Object.freeze()共同点：  
作用的对象变得不可扩展，这意味着不能再添加新属性。
作用的对象中的每个元素都变得不可配置，这意味着不能删除属性。
如果在 ‘use strict’ 模式下使用，这两个方法都可能抛出错误。  
不同点:  
Object.seal() 能让你修改属性的值，但 Object.freeze() 不能。

--------------------------------
开始二分查找问题  
git bisect start  
标记当前有问题  
git bisect bad  
标记哪个 commit 或 tag 时是没问题的  
git bisect good v1.0.0  

此时 git 会 checkout 两个点之间的某个 commit，  
如果此时还是有问题：  
git bisect bad  
如果此时没有问题：  
git bisect good  
接着 git 会 checkout 下一个「有问题」和「没问题」之间的 commit  

直到定位到问题，git 会提示：xxxxxxx is first bad commit

----------  
ES6为new命令引入了new.target属性，该属性用在构造函数之中，返回new命令作用于的构造函数。  
如果构造函数不是通过new命令或Reflect.construct()调用的，new.target会返回undefined，
因此这个属性可以用来确定构造函数是怎么调用的。  
可用于设置只能通过new 实例化的对象和类, 子类继承父类,该属性指向子类,
因此也可用于书写不能被实例化,只能被继承的类.

---------- 
<details>
    <summary>Click Here to get the user details</summary>
    <table>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Location</th>
            <th>Job</th>
        </tr>
        <tr>
            <td>1</td>
            <td>Adam</td>
            <td>Huston</td>
            <td>UI/UX</td>
        </tr>
    </table>
</details>
----------------
创建一个挂在到vue实例上的组件
const install = function(vueInstance: VueConstructor, options: any) {
  const AdModalConstructor = vueInstance.extend(AdModal);
  const instance = new AdModalConstructor({
    i18n: options.i18n
  });
  instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.$el);
  vueInstance.prototype.$adModal = function(base: RegionUrl, to?: string) {
    instance.$data.visible = true;
    instance.$data.base = base;
    instance.$data.to = to;
  };
};