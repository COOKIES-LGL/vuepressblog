---
home: false
sidebar: false
---

###  node utils 模块常用发法

#### inherits
inherits方法用于将一个父类的方法继承给该父类的子类。
``` js
util.inherits(constructor,superConstructor)
```

#### isError
isError方法判断一个参数值是否为错误对象。
``` js
util.isError(object)
```

#### isDate
isDate方法判断一个参数值是否为日期类型。
``` js
util.isDate(object)
```

#### isRegExp
isRegExp方法判断一个参数值是否为正则表达式。
``` js
util.isRegExp(object)
```

#### inspect
inspect方法用于返回一个字符串，该字符串中包含了一个对象的信息，在调试应用程序的过程中该方法将变得非常有用
``` js
util.inspect(object,options)
```

#### log
log方法用于将一个字符串作为标准输出流进行输出，在该字符串前输出系统当前时间。
``` js
util.log(string)
```

#### debug
debug方法为一个同步方法，该方法阻塞当前线程，将一个字符串作为标准错误输出流进行输出
``` js
util.debug(string)
```

#### format
将第一个参数值作为一个格式化字符串，将其他参数值作为该格式化字符串中所使用的各种参数，返回一个经过格式化处理后的字符串
``` js
util.format('您输入了%d个参数，参数值分别为%s,%s与%s。',3,'foo','bar','baz'); // 您输入了3个参数，参数值分别为foo,bar与baz
```

#### promisify
‌用于将遵循Node.js回调风格的函数转换为返回Promise的函数
``` js
// 将fs.readFile()转换为一个返回Promise的函数
const readFile = util.promisify(fs.readFile);
const data = await readFile('./file.txt', 'utf8');
console.log(data);
// 类似等效
const data = fs.readFileSync('./test.txt', 'utf-8');
console.log(data);
```
