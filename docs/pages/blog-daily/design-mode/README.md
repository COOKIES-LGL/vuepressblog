---
sidebar: auto
---
## design-mode
常用设计模式架构

### 工厂模式

``` javascript
function factory(type) {
  switch (type) {
    case '1': return new class1();break;
    case '2': return new class2();break;
    case '3': return new class3();break;
    case '4': return new class4();break;
  }
}
// 方式2
(function(){
  function pop(type, content, color) {
    if (this instanceof  pop) {
      // 判断使用了new修饰符 new pop();
      var instance = new this[type](content, color);
    } else {
      return new pop(type, content, color);
    }
  }
  pop.prototype.info = function(content, color) {
    console.log(content, color);
  }
  pop.prototype.cancel = function(content, color) {
    console.log(content, color);
  }
  pop.prototype.error = function(content, color) {
    console.log(content, color);
  } 
  window.pop = pop;
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
### 装饰器模式
