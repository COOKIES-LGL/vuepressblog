``` javascript
关于includes和indexOf的学习笔记：
1. 主要用途：判断字符串或者数组中是否存在对应的元素
2. 两者的区别
（1）NaN includes 能匹配到NaN，indexOf不能匹配到NaN
（2）undefined  includes能识别到稀疏数组中的undefined，indexOf不可以
3.字符串和数组中的indexOf方法比较：字符串会进行类型转换，数组会严格匹配（===）
4.字符串和数组中的includes方法比较：字符串会进行类型转换，数组会严格匹配（===）

```