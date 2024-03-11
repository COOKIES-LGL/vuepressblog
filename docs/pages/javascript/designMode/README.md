## javascript设计模式

### 单例模式
``` javascript
function class1(name) {
  console.log('class1', name);
}
class1.getInstance = function() {
  if (this.instance) {
    return this.instance;
  }
  return this.instance = new class1(name); 
}
// 方式二
function class1(name) {
  this.store = {
    name: name,
  };
  if (class1.instance) {
    return class1.instance;
  }
  class1.instance = this;
}
class1.instance = null;
new class1('nihao');
```

### 单例模式
``` javascript
var Singleton = function(name) {
    this.name = name
    this.instance = null
};
Singleton.prototype.getName = function() {
    return this.name;
};
// 获取实例对象
Singleton.getInstance = function(name) {
        if (!this.instance) {
            this.instance = new Singleton(name)
        }
        return this.instance
}
//测试单例模式的实例
var a = Singleton.getInstance('aa')
var b = Singleton.getInstance('bb')
console.log(a === b); // true
```

``` javascript
(function() {
    // 管理单例的逻辑代码，如果没有数据则创建，有数据则返回
    var getSingle = function(fn) { // 参数为创建对象的方法
        var result;
        return function() { // 判断是null 或赋值
            return result || (result = fn.apply(this, arguments))
        };
    };
    // 创建登录窗口方法
    var createLoginLayer = function() {
        var div = document.createElement('div');
        div.innerHTML = '我是登录浮窗';
        div.style.display = 'none';
        document.body.appendChild(div);
        return div;
    };
    // 单例方法
    var createSingleLoginLayer = getSingle(createLoginLayer)
    // 使用惰性单例，进行创建
    document.getElementById('loginBtn').onClick = function() {
        var loginLayer = createSingleLoginLayer();
        loginLayer.style.display = 'block'
    };
})()

```

### 建造者模式

``` javascript
function class1() {
}
function class2() {
}
function class3() {
}
function factory(type) {
  this.class1 = new Class1();
  this.class2 = new Class2();
  if (type) {
    this.class3 = new Class3();
  }
}
```

### 观察者模式
``` javascript
var salesOffices = {}; // 定义售楼处
salesOffices.clientList = []; // 缓存列表，存放订阅者的回调函数
salesOffices.listen = function(fn) { // 增加订阅者
    this.clientList.push(fn) // 订阅的消息添加进缓存列表
};
salesOffices.trigger = function() { // 发布消息
    for (var i = 0, fn; fn = this.clientList[i++];) {
        fn.apply(this, arguments); // arguments 是发布消息时带上的参数。
    }
};
//调用
salesOffices.listen(function(price, squareMeter) { // 订阅消息
    console.log('价格=' + price);
    console.log('squareMeter=' + squareMeter);
});
salesOffices.trigger(2000000, 88); // 输出： 200 万，88 平方米
```

### 工厂模式

``` javascript
// 简单工厂模式
let UserFactory = function(role) {
    function SuperAdmin() {
        this.name = '超级管理员';
        this.viewPage = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
    }

    function Admin() {
        this.name = '管理员';
        this.viewPage = ['首页', '通讯录', '发现页']
        console.log(this.name, this.viewPage);
    }

    function NormalUser() {
        this.name = '普通用户';
        this.viewPage = ['首页', '通讯录', '发现页']
    }
    switch (role) {
        case 'superAdmin':
            return new SuperAdmin();
            break;
        case 'admin':
            return new Admin();
            break;
        case 'user':
            return new NormalUser();
            break;
        default:
            throw new Error('参数错误,可选参数:superAdmin,admin,user')
    }
}

UserFactory('admin');

```
``` javascript
// 安全模式创建的工厂方法函数
 let UserFactory = function(role) {
     if (this instanceof UserFactory) {
         var s = new this[role]();
         return s;
     } else {
         return new UserFactory(role);
     }
 }

 // 工厂方法函数的原型中设置所有对象的构造函数
 UserFactory.prototype = {
     SuperAdmin: function() {
         this.name = '超级管理员'
         this.viewPage = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
     },
     Admin: function() {
         this.name = '管理员';
         this.viewPage = ['首页', '通讯录', '发现页', '应用数据']
     },
     NormalUser: function() {
         this.name = '普通用户';
         this.viewPage = ['首页', '通讯录', '发现页']
     }
 }

 // 调用
 let superAdmin = UserFactory('SuperAdmin')
 let admin = UserFactory('Admin')
 let NormalUser = UserFactory('NormalUser')

```

### javascript 装饰器

``` javascript
class Circle {
  draw() {
    console.log('画一个圆形')
  }
}

class Decorator {
  constructor(circle) {
    this.circle = circle
  }
  draw() {
    this.circle.draw()
    this.setRedBorder(circle)
  }
  setRedBorder(circle) {
    console.log('设置红色边框')
  }
}

// 测试
let circle = new Circle()
circle.draw()

let dec = new Decorator(circle)
dec.draw()

```
``` javascript
function testDec(isDec) {
  return function (target) {
    target.isDec = isDec
  }
}

@testDec(false)
class Demo {

}
alert(Demo.isDec) // false

```

``` javascript
// 洋葱模型
function Koa () {
  this.middlewares = [];
}
Koa.prototype.use = function (middlewares) {
  this.middlewares.push(middlewares);
  return this;
}
Koa.prototype.listen = function () {
  const fn = compose(this.middlewares);
}
function compose(middlewares) {
  let index = -1;
  const dispatch = (i) => {
    if(i <= index) throw new Error('next（） 不能调用多次');
    index = i;
    if(i >= middlewares.length) return;
    const middlewares = middlewares[i];
    return middlewares('ctx', dispatch.bind(null, i + 1));
  }
  return dispatch(0);
}

const app = new Koa();
app.use(async (ctx, next) => {
  console.log('1');
  next();
  console.log('2');
});
app.use(async (ctx, next) => {
  console.log('3');
  next();
  console.log('4');
});
app.use(async (ctx, next) => {
  console.log('5');
  next();
  console.log('6');
});

app.listen();
```

### 接口缓存复用

```
const pendingPromises = {};
function request(type, url, data) {
  // 使用请求信息作为唯一的请求key，缓存正在请求的promise对象
  // 相同key的请求将复用promise
  const requestKey = JSON.stringify([type, url, data]);
  if (pendingPromises[requestKey]) {
    return pendingPromises[requestKey];
  }
  const fetchPromise = fetch(url, {
    method: type,
    data: JSON.stringify(data)
  })
  .then(response => response.json())
  .finally(() => {
    delete pendingPromises[requestKey];
  });
  return pendingPromises[requestKey] = fetchPromise;
}

```

### 可以暂停的请求控制器

``` javascript
function _request () {
  return new Promise<number>((res) => setTimeout(() => {
    res(123)
  }, 3000))
}

// 原本想使用 class extends Promise 来实现
// 结果一直出现这个问题 https://github.com/nodejs/node/issues/13678
function createPauseControllerPromise () {
  const result = {
    isPause: false,
    resolveWhenResume: false,
    resolve (value?: any) {},
    pause () {
      this.isPause = true
    },
    resume () {
      if (!this.isPause) return
      this.isPause = false
      if (this.resolveWhenResume) {
          this.resolve()
      }
    },
    promise: Promise.resolve()
  }
  
  const promise = new Promise<void>((res) => {
    result.resolve = res
  })
  
  result.promise = promise

  return result
}

function requestWithPauseControl <T extends () => Promise<any>>(request: T) {
  const controller = createPauseControllerPromise()
  
  const controlRequest = request().then((data) => {
      if (!controller.isPause) controller.resolve()
      controller.resolveWhenResume = controller.isPause
      return data
  })
  
  const result = Promise.all([controlRequest, controller.promise])
      .then(data => data[0])
      
  result.finally(() => controller.resolve())
  
  (result as any).pause = controller.pause.bind(controller);
  (result as any).resume = controller.resume.bind(controller);
  
  return result as ReturnType<T> & { pause: () => void, resume: () => void }
}

```
