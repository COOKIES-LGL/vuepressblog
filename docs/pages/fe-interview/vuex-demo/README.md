### 简易的 vuex 实现

```javascript
import Vue from "vue";
const install = (Vue, options) => {
  // 给每一个Vue实例都添加一个$store属性
  /**
   * 在vue中有一个mixin方法，这个方法会在创建每一个Vue实例的时候执行
   * 所以可以通过mixin方法给每一个Vue实例添加$store属性
   */
  Vue.mixin({
    // 重写
    beforeCreate() {
      /**
       * Vue在创建实例的时候会先创建父组件，然后再创建子组件
       */
      // console.log(this.$options.name);
      // Root === App == helloworld
      /**
       * 如果是根组件，name默认就有store
       * 只需要将store变成$store即可
       */
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store;
      } else {
        /**
         * 如果不是根组件，那么默认没有store
         * 只需要将它父组件的$store赋值给它即可
         */
        this.$store = this.$parent.$store; // 子组件的$store === 父组件的store
      }
    },
  });
};
class ModuleCollection {
  constructor(rootModule) {
    this.register([], rootModule);
  }
  register(arr, rootModule) {
    // console.log(arr); // [] [home] [account] [account, login]
    // 1.按照我们需要的格式创建模块
    let module = {
      _raw: rootModule,
      _state: rootModule.state,
      _children: {},
    };
    // 2.保存模块信息
    if (arr.length === 0) {
      // 保存根模块
      this.root = module;
    } else {
      // 保存子模块
      // this.root._children[arr[arr.length-1]] = module;
      // let testArr = ['account', 'login'];
      // let res = testArr.splice(0, testArr.length - 1);
      // console.log(res);
      // ['a', 'b', 'c'] -> ['a', 'b']
      let parent = arr.splice(0, arr.length - 1).reduce((root, currentKey) => {
        return root._children[currentKey];
      }, this.root);
      parent._children[arr[arr.length - 1]] = module;
    }
    // 3.处理子模块
    for (let childrenModuleName in rootModule.modules) {
      let childrenModule = rootModule.modules[childrenModuleName];
      this.register(arr.concat(childrenModuleName), childrenModule);
    }
  }
}
class Store {
  constructor(options) {
    // this.opions = options
    // 将创建Store的时候需要共享的数据添加到Store上面
    // 将来就能通过this.$store拿到这个Store
    // 能拿到这个Store，就可以通过 .state拿到需要共享的属性
    // this.state = options.state // 无法实现双向绑定数据
    // ------------------------------------------------
    // 将传递进来的state放到Store上
    Vue.util.defineReactive(this, "state", options.state);
    // 提取模块信息
    this.modules = new ModuleCollection(options);
    // 安装子模块的数据
    this.initModules([], this.modules.root);
    /*
        模块化
        ModuleCollection方法将数据处理成下面这个格式：
        let root = {
            _raw: rootModule,
            _state: rootModule.state,
            _children: {
                home:{
                    _raw: homeModule,
                    _state: homeModule.state,
                    _children: {}
                },
                account:{
                    _raw: accountModule,
                    _state: accountModule.state,
                    _children: {
                        login: {
                            _raw: loginModule,
                            _state: loginModule.state,
                            _children: {}
                        }
                    }
                },
            }
        }
        * */
  }
  initModules(arr, rootModule) {
    // console.log(arr); // [] [home] [account] [account, login]
    // 如果当前是子模块, 那么就需要将数据安装到this.state上
    if (arr.length > 0) {
      let parent = arr.splice(0, arr.length - 1).reduce((state, currentKey) => {
        return state[currentKey];
      }, this.state);
      Vue.set(parent, arr[arr.length - 1], rootModule._state);
    }
    // 将传递进来的getters放到Store上
    this.initGetters(rootModule._raw);
    // 将传递进来的mutations放到Store上
    this.initMutations(rootModule._raw);
    // 将传递进来的actions放到Store上
    this.initActions(rootModule._raw);
    // 如果当前不是子模块, 那么就需要从根模块中取出子模块的信息来安装
    for (let childrenModuleName in rootModule._children) {
      let childrenModule = rootModule._children[childrenModuleName];
      this.initModules(arr.concat(childrenModuleName), childrenModule);
    }
  }
  dispatch = (type, payload) => {
    this.actions[type].forEach((fn) => fn(payload));
  };
  initActions(options) {
    // 1.拿到传递进来的actions
    let actions = options.actions || {};
    // 2.在Store上新增一个actions的属性
    this.actions = this.actions || {};
    // 3.将传递进来的actions中的方法添加到当前Store的actions上
    for (let key in actions) {
      this.actions[key] = this.actions[key] || [];
      this.actions[key].push((payload) => {
        actions[key](this, payload);
      });
    }
  }
  commit = (type, payload) => {
    // console.log(this);
    // 允许相同的方法名，调用时，全部执行
    this.mutations[type].forEach((fn) => fn(payload));
  };
  initMutations(options) {
    // 1.拿到传递进来的mutations
    let mutations = options.mutations || {};
    // 2.在Store上新增一个mutations的属性
    this.mutations = this.mutations || {};
    // 3.将传递进来的mutations中的方法添加到当前Store的mutations上
    for (let key in mutations) {
      // 允许相同的方法名，数组将所有的方法保存
      this.mutations[key] = this.mutations[key] || [];
      this.mutations[key].push((payload) => {
        mutations[key](options.state, payload);
      });
    }
  }
  initGetters(options) {
    // this.getters = options.getters;
    // 1.拿到传递进来的getters
    let getters = options.getters || {};
    // 2.在Store上新增一个getters的属性
    this.getters = this.getters || {};
    // 3.将传递进来的getters中的方法添加到当前Store的getters上
    for (let key in getters) {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](options.state);
        },
      });
    }
  }
}
export default {
  install,
  Store,
};
```

### promise 实现

```javascript
// 判断变量否为function
const isFunction = (variable) => typeof variable === "function";
// 定义Promise的三种状态常量
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class MyPromise {
  constructor(handle) {
    if (!isFunction(handle)) {
      throw new Error("MyPromise must accept a function as a parameter");
    }
    // 添加状态
    this._status = PENDING;
    // 添加状态
    this._value = undefined;
    // 添加成功回调函数队列
    this._fulfilledQueues = [];
    // 添加失败回调函数队列
    this._rejectedQueues = [];
    // 执行handle
    try {
      handle(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }
  // 添加resovle时执行的函数
  _resolve(val) {
    const run = () => {
      if (this._status !== PENDING) return;
      this._status = FULFILLED;
      // 依次执行成功队列中的函数，并清空队列
      const runFulfilled = (value) => {
        let cb;
        while ((cb = this._fulfilledQueues.shift())) {
          cb(value);
        }
      };
      // 依次执行失败队列中的函数，并清空队列
      const runRejected = (error) => {
        let cb;
        while ((cb = this._rejectedQueues.shift())) {
          cb(error);
        }
      };
      /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
          当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
        */
      if (val instanceof MyPromise) {
        val.then(
          (value) => {
            this._value = value;
            runFulfilled(value);
          },
          (err) => {
            this._value = err;
            runRejected(err);
          }
        );
      } else {
        this._value = val;
        runFulfilled(val);
      }
    };
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run, 0);
  }
  // 添加reject时执行的函数
  _reject(err) {
    if (this._status !== PENDING) return;
    // 依次执行失败队列中的函数，并清空队列
    const run = () => {
      this._status = REJECTED;
      this._value = err;
      let cb;
      while ((cb = this._rejectedQueues.shift())) {
        cb(err);
      }
    };
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run, 0);
  }
  // 添加then方法
  then(onFulfilled, onRejected) {
    const { _value, _status } = this;
    // 返回一个新的Promise对象
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      // 封装一个成功时执行的函数
      let fulfilled = (value) => {
        try {
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value);
          } else {
            let res = onFulfilled(value);
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
              onFulfilledNext(res);
            }
          }
        } catch (err) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(err);
        }
      };
      // 封装一个失败时执行的函数
      let rejected = (error) => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error);
          } else {
            let res = onRejected(error);
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
              onFulfilledNext(res);
            }
          }
        } catch (err) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(err);
        }
      };
      switch (_status) {
        // 当状态为pending时，将then方法回调函数加入执行队列等待执行
        case PENDING:
          this._fulfilledQueues.push(fulfilled);
          this._rejectedQueues.push(rejected);
          break;
        // 当状态已经改变时，立即执行对应的回调函数
        case FULFILLED:
          fulfilled(_value);
          break;
        case REJECTED:
          rejected(_value);
          break;
      }
    });
  }
  // 添加catch方法
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  // 添加静态resolve方法
  static resolve(value) {
    // 如果参数是MyPromise实例，直接返回这个实例
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }
  // 添加静态reject方法
  static reject(value) {
    return new MyPromise((resolve, reject) => reject(value));
  }
  // 添加静态all方法
  static all(list) {
    return new MyPromise((resolve, reject) => {
      /**
       * 返回值的集合
       */
      let values = [];
      let count = 0;
      for (let [i, p] of list.entries()) {
        // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
        this.resolve(p).then(
          (res) => {
            values[i] = res;
            count++;
            // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
            if (count === list.length) resolve(values);
          },
          (err) => {
            // 有一个被rejected时返回的MyPromise状态就变成rejected
            reject(err);
          }
        );
      }
    });
  }
  // 添加静态race方法
  static race(list) {
    return new MyPromise((resolve, reject) => {
      for (let p of list) {
        // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
        this.resolve(p).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }
  finally(cb) {
    return this.then(
      (value) => MyPromise.resolve(cb()).then(() => value),
      (reason) =>
        MyPromise.resolve(cb()).then(() => {
          throw reason;
        })
    );
  }
}
```
