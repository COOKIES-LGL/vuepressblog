``` javascript
关于includes和indexOf的学习笔记：
1. 主要用途：判断字符串或者数组中是否存在对应的元素
2. 两者的区别
（1）NaN includes 能匹配到NaN，indexOf不能匹配到NaN
（2）undefined  includes能识别到稀疏数组中的undefined，indexOf不可以
3.字符串和数组中的indexOf方法比较：字符串会进行类型转换，数组会严格匹配（===）
4.字符串和数组中的includes方法比较：字符串会进行类型转换，数组会严格匹配（===）

```

``` javascript
splice 操作方法是非常耗时的，每次删除元素之后，需要重排数组中的元素，具有相同副作用的操作方法还有 unshift 和 shift 
相比较下，pop 和 push 则是非常快的操作方法，
```