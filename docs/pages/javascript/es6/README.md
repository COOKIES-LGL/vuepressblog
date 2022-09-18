### Symbol使用技巧

::: tip
symbol 作为对象的属性无法通过.运算符获取,需要使用[symbol]
:::

::: tip
全局共享Symbol
let a = Symbol.for("a")
let b = Symbol.for("a")
a === b // true
Symbol.keyFor(a) 可以通过变量名查询该变量名对应的Symbol是否在全局注册表中
::: 

::: tip
我们还可以通过更改内置Symbol值对应的方法来达到更改外部方法作用的效果。
class demo {
    static [Symbol.hasInstance](item) {
        return item === "猪痞恶霸"
    }
}
"猪痞恶霸" instanceof demo // true
Symbol.hasInstance对应的外部方法是instanceof，这个大家熟悉吧，经常用于判断类型。而在上面的代码片段中，我创建了一个demo类，并重写了Symbol.hasInstance，所以其对应的instanceof行为也会发生改变，其内部的机制是这样的：当我们调用instanceof方法的时候，内部对应调用Symbol.hasInstance对应的方法即return item === "猪痞恶霸"
:::

### 1