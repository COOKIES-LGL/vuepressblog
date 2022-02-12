---
sidebar: auto
---

### JS 高级使用技巧

```javascript
function var() {
    console.log(1)
    return 1;
}
function varr(params = var()){
    return 22;
}
```

```javascript
Math.floor(4.8) === 4;
~~4.9 === 4;
```

```javascript
// 以下代码就可以实现同源跨tab页的数据共享
// 通过自执行函数来确保在新开tab中直接执行
// 方法一：同步已有标签页的sessionStorage数据到新开tab页
(function () {
  // 新打开一个tab标签页并通知其他标签页同步sessionStorage的数据到本标签页
  if (!sessionStorage.length) {
    // 这个调用能触发storage事件，从而达到共享数据的目的
    localStorage.setItem('syncSessionStorage', Date.now());
  }

  // 该事件是核心
  window.addEventListener('storage', function (event) {
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

---

Object.seal() 和 Object.freeze()共同点：  
作用的对象变得不可扩展，这意味着不能再添加新属性。
作用的对象中的每个元素都变得不可配置，这意味着不能删除属性。
如果在 ‘use strict’ 模式下使用，这两个方法都可能抛出错误。  
不同点:  
Object.seal() 能让你修改属性的值，但 Object.freeze() 不能。

---

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

---

ES6 为 new 命令引入了 new.target 属性，该属性用在构造函数之中，返回 new 命令作用于的构造函数。  
如果构造函数不是通过 new 命令或 Reflect.construct()调用的，new.target 会返回 undefined，
因此这个属性可以用来确定构造函数是怎么调用的。  
可用于设置只能通过 new 实例化的对象和类, 子类继承父类,该属性指向子类,
因此也可用于书写不能被实例化,只能被继承的类.

---

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

---

```javascript
// 创建一个挂在到vue实例上的组件
const install = function (vueInstance: VueConstructor, options: any) {
  const AdModalConstructor = vueInstance.extend(AdModal);
  const instance = new AdModalConstructor({
    i18n: options.i18n,
  });
  instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.$el);
  vueInstance.prototype.$adModal = function (base: RegionUrl, to?: string) {
    instance.$data.visible = true;
    instance.$data.base = base;
    instance.$data.to = to;
  };
};
```

---

```javascript
private download(res: any, fileName: string) {
  const downloadLink = document.createElement('a');
  downloadLink.style.display = 'none';
  downloadLink.setAttribute('download', fileName);
  let binaryBlob = [];
  binaryBlob.push(res);
  let objectUrl = URL.createObjectURL(new Blob(binaryBlob));
  downloadLink.href = objectUrl;
  downloadLink.click();
  URL.revokeObjectURL(objectUrl);
  downloadLink.remove();
}
```

---

```javascript
// blob对象转json
var reader = new FileReader();
reader.readAsText(res as Blob, 'utf-8');
reader.onload = () => {
console.log(reader.result);
console.log(JSON.parse(reader.result as string));
}
```

```javascript
/**
 * 描述如下
同时发多个相同的请求，如果第一个请求成功，那么剩余的请求都不会发出，成功的结果作为剩余请求返回
如果第一个请求失败了，那么接着发编号为2的请求，如果请求成功，那么剩余的请求都不会发出，成功的结果作为剩余请求返回
如果第二个请求失败了，那么接着发编号为3的请求，如果请求成功，那么剩余的请求都不会发出，成功的结果作为剩余请求返回
...以此递推，直到遇到最坏的情况需要发送最后一个请求
 * 
const cacheAsync = (promiseGenerator, symbol) => {
  const cache = new Map();
  return async (params) => {
    return new Promise((resolve, reject) => {
      // 可以提供键值
      symbol = symbol || params;
      let cacheCfg = cache.get(symbol);
      if (!cacheCfg) {
        cacheCfg = {
          res: null,
          exector: [{ resolve, reject }],
        };
        cache.set(symbol, cacheCfg);
      } else {
        // 命中缓存
        if (cacheCfg.res) {
          return resolve(cacheCfg.res);
        }
        cacheCfg.exector.push({ resolve, reject });
      }

      const { exector } = cacheCfg;

      // 处理并发，在请求还处于pending过程中就发起了相同的请求
      // 拿第一个请求
      if (exector.length === 1) {
        const next = async () => {
          try {
            if (!exector.length) return;
            const response = await promiseGenerator(params);
            // 如果成功了，那么直接resolve掉剩余同样的请求
            while (exector.length) {
              exector.shift().resolve(response); // 清空栈
            }
            // 缓存结果
            cacheCfg.res = response;
          } catch (error) {
            // 如果失败了 那么这个promise的则为reject
            const { reject } = exector.shift();
            reject(error);
            next();
          }
        };
        next();
      }
    });
  };
};
```
``` Javascript
// base64转Blob对象
function base64dataURLtoBlob(dataUrl: string) {
  const char = `"`; //去除首尾双引号
  dataUrl = dataUrl.replace(
    new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'),
    ''
  );
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const blobStr = atob(arr[1]);
  let blobStrLength = blobStr.length;
  const u8arr = new Uint8Array(blobStrLength);
  while (blobStrLength--) {
    u8arr[blobStrLength] = blobStr.charCodeAt(blobStrLength);
  }
  return new Blob([u8arr], {
    type: mime
  });
}
```
``` javascript
// base64转file对象
function base64dataURLtoBlob(dataUrl: string) {
  const char = `"`; //去除首尾双引号
  dataUrl = dataUrl.replace(
    new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'),
    ''
  );
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const blobStr = atob(arr[1]);
  let blobStrLength = blobStr.length;
  const u8arr = new Uint8Array(blobStrLength);
  while (blobStrLength--) {
    u8arr[blobStrLength] = blobStr.charCodeAt(blobStrLength);
  }
  return new File([u8arr], 'fileName', {
    type: mime
  });
}
```