---
home: false
sidebar: true
---

### get
``` js
import _ from 'lodash-es'
_.get(object, path, [defaultValue])
```
**使用案例**
``` js
var object = { 'a': [{ 'b': { 'c': 3 } }] };
utils.get(object, 'a[0].b.c');             // => 3 （推荐使用）
utils.get(object, ['a', '0', 'b', 'c']);   // => 3
utils.get(object, 'a.b.c', 'default');     // => 'default' 没有匹配到走default（推荐使用）
```


### has
``` js
import _ from 'lodash-es'
_.has(object, path, [defaultValue]) // 检查 path 是否是object对象的直接属性
```
**使用案例**
``` js
var object = { 'a': { 'b': 2 } };
utils.has(object, 'a'); // => true
utils.has(object, 'a.b'); // => true
utils.has(object, ['a', 'b']); // => true
utils.has(other, 'a'); // => false
```

### getObjArray
``` js
import _ from 'lodash-es'
_.getObjArray(object, path, [defaultValue])
```
**使用案例**
``` js
var objects = [
    { 'a': { 'b': { 'c': 2 } } },
    { 'a': { 'b': { 'c': 1 } } }
]
utils.getObjArray(object, 'a.b.c') // => [2, 1]
```

### findIndex
``` js
import _ from 'lodash-es'
_.findIndex(array, predicate, fromIndex)
```
**使用案例**
``` js
users = [
    { 'user': 'barney', 'active': false },
    { 'user': 'fred', 'active': false },
    { 'user': 'pebbles', 'active': true }
]
utils._findIndex(array, function(o) { return o.user == 'barney'; }) // => 0
utils._findIndex(array, { 'user': 'fred', 'active': false }) // => 1 （推荐使用）
utils._findIndex(array, ['active', false]) // => 0 （推荐使用）
utils._findIndex(array, 'active') // => 2 （推荐使用）
```

### uniq
``` js
import _ from 'lodash-es'
_.uniq(array)
```
**使用案例**
``` js
var a =[1, 2, 1, 5, 1, 9]
utils._uniq(a) => [1, 2, 5, 9]
```

### pick
``` js
import _ from 'lodash-es'
_.pick(object, array)
```
**使用案例**
``` js
var object = { 'a': 1, 'b': '2', 'c': 3 }
utils.pick(object, ['a', 'c']) // => { 'a': 1, 'c': 3 }
```

### omit
``` js
import _ from 'lodash-es'
_.omit(object, array)
```
**使用案例**
``` js
var object = { 'a': 1, 'b': '2', 'c': 3 }
utils.omit(object, ['a', 'c']) // => { 'b': '2' }
```

### isEqual
``` js
import _ from 'lodash-es'
_.isEqual(object1, object2) // 深入比较值相等
```
**使用案例**
``` js
var object = { 'a': 1 };
var other = { 'a': 1 };
utils.isEqual(object, other); // => true
```

### isEmpty
``` js
import _ from 'lodash-es'
_.isEmpty(object) // 判断这个对象是否为空 可以是对象可以是数组可以是null，可以是undefined
```
**使用案例**
``` js
utils.isEmpty([]); // => true
utils.isEmpty(null); // => true
utils.isEmpty(undefined); // => true
utils.isEmpty({}); // => true
utils.isEmpty(0); // => true
utils.isEmpty({ name: 'John Doe' }); // => false
```

### difference
``` js
import _ from 'lodash-es'
_.difference(object, array1， array2) // 创建不包含在其他给定数组的元素的数组
```
**使用案例**
``` js
const result = utils.difference([1, 2, 3], [2, 3, 4]); // result => [1]
```

### intersection
``` js
import _ from 'lodash-es'
_.intersection(object, array1， array2) // 取两个数组的交集，顺序由第一个数组的顺序决定
```
**使用案例**
``` js
const result = utils.intersection([1, 2, 3], [2, 3, 4]); // result => [2, 3]
```

### merge
``` js
import _ from 'lodash-es'
_.merge(object, array1， array2) // 递归地将源对象自身和继承的可枚举属性合并到目标对象中
```
**使用案例**
``` js
const firstObject = { 'A': [{ 'B': 1 }, { 'C': 2 }] };
const secondObject = { 'A': [{ 'B': 3 }, { 'D': 4 }] };
const result = utils.merge(firstObject, secondObject);
// result => { A: [{ B: 3 }, { C: 2, D: 4 }] }
```

### uniqBy
``` js
import _ from 'lodash-es'
const afterRunUniqBy = _.uniqBy(array1， 'value') // 去除重复值
```
**使用案例**
``` js
const firstArray = [{ value: 1 }, { value: 2 }, { value: 1 }, { value: 3 }];
const result = utils.uniqBy(firstArray, 'value');
// result => [{ value: 1 }, { value: 2 }, { value: 3 }]
```

### countBy
``` js
import _ from 'lodash-es'
_.countBy(array1， 'value') // 给数组中的每个元素返回一个计数
```
**使用案例**
``` js
const firstArray = [{ value: 1 }, { value: 2 }, { value: 1 }, { value: 3 }, { value: 3 }, { value: 3 }];
const result = utils.countBy(firstArray, 'value');
// result => { '1': 2，'2': 1, '3': 3 ] }
```

### forOwn
``` js
import _ from 'lodash-es'
_.forOwn(array1， 'value') // 给数组中的每个元素返回一个计数
```
**使用案例**
``` js
const firstObject = { value1: 1, value2: 2, value3: 3};
utils.forOwn(firstObject, (value, key) => {
    console.log(value, key)
});
// result => 1 value1
// result => 2 value2
// result => 3 value3
```

