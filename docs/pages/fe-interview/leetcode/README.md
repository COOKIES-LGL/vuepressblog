---
home: false
sidebar: false
---

### 批量加载图片
#### 上面的解没有达到请求最快，因为 Promise.all 的返回是传入 promise组 相互依赖的结果，当其中有一个完成了还得等其它都完成，蜗牛都睁大了双眼👀。 也不是题目想要的效果。也就有了下面的思路将八张图片先拿三张出来，当做 初始请求，但是一旦有完成的（无论成功或失败）就 将成后面的一张的结果加入请求。
``` javascript
function limitRequest(urlArr, max) {

    const urls = [].concat(urlArr);
    let currentUrls = urls.splice(0, 3)
    let currentPromises = currentUrls.map(url => loadImg(url));
    let resolvedUrl = '';
    const len = urls.length;
    const results = []

    return urls.reduce((acc, url, index) => {
      return acc.then(
          () => Promise.race(currentPromises)
        ).then(img => {
          console.log('wow~~', index, img);
          results.push(img)
          resolvedUrl = img.src;
          updatePromises(resolvedUrl, url)
        })
        .catch(err => {
          console.log(`第 ${index} 张图片加载失败了`);
          resolvedUrl = err.message.match(/http[s]?:\/\/.{1,}$/);
          results.push(index)
          updatePromises(resolvedUrl, url);
        }).then(() => {
          return new Promise(resolve => {
            if (index === urls.length - 1) {
              Promise.all(currentPromises).then(res => {
                results.push(...res)
                resolve(results);
              })
            } else resolve()
          })
        })
    }, Promise.resolve())

    function updatePromises(removeUrl, addUrl) {
      const idx = currentUrls.findIndex(url => url === removeUrl);
      currentUrls.splice(idx, 1, addUrl)
      currentPromises[idx] = loadImg(addUrl)
    }
}

limitRequest(urls, 3).then(res => {
    console.log('end', res);
})
```

``` javascript
// 将数组分割成指定长度
function subGroup(arr, len) {
  var newArr = [];
  for(var i = 0; i < arr.length; i += len){
    newArr.push(arr.slice(i, i + len));
  }
  return newArr;
}
```

::: tips
for循环中，当不用&&和||申明多个条件时，默认的是或者关系。
:::

``` javascript 

1.其他进制转十进制
parseInt("16",16)    变量/声明我是几进制
parseInt("12",8)
parseInt("1010",2) 
2.十进制转其他进制
var v1 = 24;
v1.toString(16)     //转16进制
v1.toString(8)      //转8进制 
v1.toString(2)      //转2进制
v1.toString(10)     //转10进制

parseInt(num,2).toString(8)      //2进制转8进制
parseInt(num,8).toString(2)     //8进制转2进制

```

``` javascript
// 求质数因子
  function getCode(num) {
    const sqrt = Math.sqrt(num);
    const arr = [];
    for (let i = 2; i <= sqrt; i++) {
      while (num % i == 0) {
        arr.push(i);
        num /= i;
      }
    }
    if (num != 1) {
      arr.push(num);
    }
    return arr.join(" ");
  }
```

``` javascript
// 匈牙利算法

```


``` javascript
// 快速排序

```

``` javascript
// 双指针

```

``` javascript
// 密码截取
// HJ32
// 主要分为两种情况，对于每个元素，分是否作为中心点考虑，如果是中心点，let l=index-1，let r=index+1，否则的话，let l=index，let r=index+1
let input=readline()
let arr=Array.from(input)
let res=[]
for(let i=0;i<arr.length;i++){
    let a=d1(i,arr)
    let b=d2(i,arr)
//     console.log(a,b)
    res[i]=Math.max(a,b)
}
console.log(Math.max(...res))
function d1(index,arr){
    let l=index-1
    let r=index+1
    let count=1
    while(l>=0&&r<arr.length){
        if(arr[l]==arr[r]){
            count+=2
            l--
            r++
        }else{
            break
        }
    }
    return count
}
function d2(index,arr){
    let l=index
    let r=index+1
    let count=0
    while(l>=0&&r<arr.length){
        if(arr[l]==arr[r]){
            count+=2
            l--
            r++
        }else{
            break
        }
    }
    return count
}

```

### 动态规划
``` javascript
// 动态规划01背包
function knapSack(w,val,capacity,n){
	var T = []
	for(let i = 0;i < n;i++){
		T[i] = [];
		for(let j=0;j <= capacity;j++){
			if(j === 0){ //容量为0
				T[i][j] = 0;
				continue;
			}	
			if(j < w[i]){ //容量小于物品重量，本行hold不住
				if(i === 0){
					T[i][j] = 0; // i = 0时，不存在i-1，所以T[i][j]取0
				}else{
					T[i][j] = T[i-1][j]; //容量小于物品重量，参照上一行
				}
				continue;
			}
			if(i === 0){
				T[i][j] = val[i]; //第0行，不存在 i-1, 最多只能放这一行的那一个物品
			}else{
				T[i][j] = Math.max(val[i] + T[i-1][j-w[i]],T[i-1][j]);
			}
		}
	}
	findValue(w,val,capacity,n,T);
	return T;
}
//找到需要的物品
function findValue(w,val,capacity,n,T){
	var i = n-1, j = capacity;
	while ( i > 0 && j > 0 ){
		if(T[i][j] != T[i-1][j]){
			console.log('选择物品'+i+',重量：'+ w[i] +',价值：' + val[i]);
			j = j- w[i];
			i--;
		}else{
			i--;  //如果相等，那么就到 i-1 行
		}
	}
	if(i == 0 ){
		if(T[i][j] != 0){ //那么第一行的物品也可以取
			console.log('选择物品'+i+',重量：'+ w[i] +',价值：' + val[i]);
		}
	}
}
var values = [3,4,5],
	weights = [2,3,4],
	capacity = 5,
	n = values.length;
console.log(knapSack(weights,values,capacity,n));
```

``` javascript
// 找零钱问题
//动态规划 -- 硬币找零问题
function minCoins(coins,total,n){
	var T = [];
	for(let i = 0;i<n;i++){
		T[i] = []
		for (let j=0;j<= total;j++){
			if(j == 0){
				T[i][j] = 0;
				continue;
			}
			if(i == 0){
				T[i][j] = j/coins[i]; //硬币找零一定要有个 最小面额1，否则会无解
			}else{
				if(j >= coins[i]){
					T[i][j] = Math.min(T[i-1][j],1+T[i][j-coins[i]]);
				}else{
					T[i][j] = T[i-1][j];
				}
			}
		}
	}
	findValue(coins,total,n,T);
	return T;
}

function findValue(coins,total,n,T){
	var i = n-1, j = total;
	while(i>0 && j >0){
		if(T[i][j]!=T[i-1][j]){
			//锁定位置,确定i,j值，开始找构成结果的硬币组合。 其实根据这种计算方法，只需要考虑最右边那一列，从下往上推。
			console.log(T[i][j]);
			break
		}else{
			i--;
		}
	}
	var s = []; //存储组合结果
	while(i >= 0 && j > 0 ){
		s.push(coins[i]);
		j=j-coins[i];
		if(j <= 0){
			break; //计算结束，退出循环
		}
		//如果 i == 0,那么就在第 0 行一直循环计算，直到 j=0即可
		if(i>0){
			//console.log(i);
			while(T[i][j] == T[i-1][j]){
				i--;
				if(i== 0){
					break;
				}
			}
		}
	}
	console.log(s);
}
var coins = [1,2,5,6];
var total = 11
var n = coins.length
console.log(minCoins(coins,total,n));
```

``` javascript
//动态规划 -- 最长公共子序列
//!!!!  T[i][j] 计算，记住口诀：相等左上角加一，不等取上或左最大值
function longestSeq(input1,input2,n1,n2){
	var T = []; // T[i][j]表示 公共子序列长度
	for(let i=0;i<n1;i++){
		T[i] = [];
		for(let j= 0;j<n2;j++){
			if(j==0 ||i==0){
				T[i][j] = 0;
				continue;
			}
			if(input1[i] == input2[j]){
				T[i][j] = T[i-1][j-1] + 1;
			}else{
				T[i][j] = Math.max(T[i-1][j],T[i][j-1])
			}
		}
	}
	findValue(input1,input2,n1,n2,T);
	return T;
}
//!!!如果它来自左上角加一，则是子序列，否则向左或上回退。
//findValue过程，其实就是和 就是把T[i][j]的计算反过来。
function findValue(input1,input2,n1,n2,T){
	var i = n1-1,j=n2-1;
	var result = [];//结果保存在数组中
	while(i>0 && j>0){
		if(input1[i] == input2[j]){
			result.unshift(input1[i]);
			i--;
			j--;
		}else{
			//向左或向上回退
			if(T[i-1][j]>T[i][j-1]){
				//向上回退
				i--;
			}else{
				//向左回退
				j--;
			}
		}
	}
	console.log(result);
}
//两个序列，长度不一定相等, 从计算表格考虑，把input1和input2首位都补一个用于占位的空字符串
var input2 = ["","a","b","c","a","d","f"],
	input1 = ["","a","c","b","a","d"],
	n1 = input1.length,
	n2 = input2.length;
console.log(longestSeq(input1,input2,n1,n2));
```

``` javascript
// 字符串排列
function Permutation(str)
{
    // write code here
    let arr = str.split('');
    let res = [];
    function swap(p,q){
      [arr[p],arr[q]] = [arr[q],arr[p]];
    }
    function dfs(p, q) {
        if (p === q) {
            res.push(arr.join(''));
            return;
        }
        for (let i = p; i <= q;i++) {
            swap(p,i);
            dfs(p+1,q);
            swap(p,i);
        }
    }
    dfs(0, arr.length-1);
    res = Array.from(new Set(res));
    return res;
}
module.exports = {
    Permutation : Permutation
};
```

``` javascript
// 称砝码
let line1 = readline();
let line2 = readline();
let line3 = readline();
let m = line2.split(' '); //每种砝码的重量
let x = line3.split(' '); //每种砝码对应的数量范围
let fama = []            //序列化砝码，比如两个1g和一个2g的砝码用[1,1,2]表示
for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < x[i]; j++) {
        fama.push(Number(m[i]))
    }
}
let kind = new Set();    //用set表示加入当前砝码之前能产生的重量种类
kind.add(0);            //set初始化为0
// 当第一个1g砝码放入时，set中要插入原先所有元素+1g后的结构，即{0,0+1}，插入后变为{0,1}
// 当第二个1g砝码放入时，set要插入{0+1,1+1},变为{0,1,2}
// 第三个2g砝码放入时，set要插入{0+2,1+2,2+2},变为{0,1,2,3,4}
for (let i = 0; i < fama.length; i++) {
    let arr = [...kind]    //用一个数组来缓存当前种类的砝码的值
    for (let k of arr) {
        kind.add(k + fama[i]);
    }
}
console.log(kind.size)
```

``` javascript
// 迷宫问题
// 递归调用，每次判断上下左右四方向； 走过路径标记为1，直到最终到达终点
let n=readline().split(' ').map(Number);
// n = [5, 5];
let maze=[];//读数据
while(line=readline()) {
  maze.push(line.split(' ').map(Number));
}
function find(i,j,road){
    road.push([i,j]);//先推入0,0
    maze[i][j]=1;
    // n[0] = 5; n[1] = 5, 行列长度
    if(i==n[0]-1 && j==n[1]-1){
      // 到达目的地
      for (let i of road) {
        console.log(`(${i[0]},${i[1]})`);
      }
    }
    if(j+1 < n[1] && maze[i][j+1]==0) find(i,j+1,road)//右
    if(i+1 < n[0] && maze[i+1][j]==0) find(i+1,j,road)//下
    if(j-1 >= 0 && maze[i][j-1]==0) find(i,j-1,road)//左
    if(i-1 >= 0 && maze[i-1][j]==0) find(i-1,j,road)//上
}
find(0,0,[])

```
``` javascript
// 名字漂亮度
// 字符串中出现次数最多的赋值26第二多的25 然后计算和
while(n = readline()){
    for(let i = 0; i < n; i++){
        let str = readline()
        let map = new Array(26).fill(0);
        let res = 0;
        let arr = str.toLowerCase().split('');
        arr.forEach((ele)=>{
            map[ele.charCodeAt(0)-97]++;
        })
        map.sort((a,b)=>b-a);
        // 降序排列之后就可以求和
        for(let i=0;i<26;i++){
            res += map[i] * (26 - i)
        }
        console.log(res);
    }
}

```

``` javascript
// 反转链表
class Node {
  constructor(v, next) {
    this.v = v;
    this.next = next;
  }
}
 
const reverseLinkedList = head => {
  let prev = null;
  let cur = head;
  while(cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}
```