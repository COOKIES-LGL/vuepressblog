``` javascript
// 移除对象中的某个属性
let obj = {x: 45, y: 72, z: 68, p: 98};

// Longhand
delete obj.x;
delete obj.p;
console.log(obj); // {y: 72, z: 68}

// Shorthand
let {x, p, ...newObj} = obj;
console.log(newObj); // {y: 72, z: 68}

```