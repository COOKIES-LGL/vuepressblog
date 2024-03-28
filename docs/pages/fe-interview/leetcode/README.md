---
home: false
sidebar: false
---

### 批量加载图片
#### 因为 Promise.all 的返回是传入 promise组 相互依赖的结果，当其中有一个完成了还得等其它都完成，也不是题目想要的效果。也就有了下面的思路将八张图片先拿三张出来，当做 初始请求，但是一旦有完成的（无论成功或失败）就 将成后面的一张的结果加入请求。

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

### 进制转化
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
// 快速排序
function quickSort( arr ) {
    if(arr.length <= 1) return arr;
    const num = arr[0];
    let left = [], right = [];
    for(let i = 1;i < arr.length; i++) {
        if(arr[i]<=num) left.push(arr[i]);
        else right.push(arr[i]);
    }
    return quickSort(left).concat([num],quickSort(right));
}

```

``` javascript
// 归并排序
function mergeSort(arr) { //采用自上而下的递归方法
　　var len = arr.length;
　　if(len < 2) {
　　　　return arr;
　　}
　　var middle = Math.floor(len / 2),
　　left = arr.slice(0, middle),
　　right = arr.slice(middle);
　　return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right){
　　var result = [];
　　while (left.length && right.length) {
　　　　if (left[0] <= right[0]) {
　　　　　　result.push(left.shift());
　　　　} else {
　　　　　　result.push(right.shift());
　　　　}
　　}
　　while (left.length){
　　　　result.push(left.shift());
　　}
　　while (right.length){
　　　　result.push(right.shift());
　　}
　　return result;
}
var arr=[3,44,38,5,47,15,36,26,27,2,46,4,19,50,48];
console.log(mergeSort(arr));
```

``` javascript
// 双指针

```

``` javascript
// 密码截取 HJ32
// 主要分为两种情况，对于每个元素，分是否作为中心点考虑，如果是中心点，let l=index-1，let r=index+1，否则的话，let l=index，let r=index+1
let input=readline()
let arr=Array.from(input)
let res=[]
for(let i=0;i<arr.length;i++){
    let a=d1(i,arr)
    let b=d2(i,arr)
    // console.log(a,b)
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
// 动态规划 -- 最长公共子序列
// T[i][j] 计算，记住口诀：相等左上角加一，不等取上或左最大值
function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
 
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
 
    return dp[m][n];
}
// 示例
const str1 = "abcde";
const str2 = "ace";
console.log(longestCommonSubsequence(str1, str2)); // 输出：3
```

``` javascript
// 最大公共子串
function findSubStr(str1, str2){
  if (str1.length > str2.length) {
    var temp = str1;
    str1 = str2;
    str2 = temp;
  }
  var len1 = str1.length,
    len2 = str2.length;
  for (var j = len1; j > 0; j--) {
    for (var i = 0; i < len1 - j; i++) {
      var current = str1.substr(i, j);
      if (str2.indexOf(current) >= 0) {
        return current;
      }
    }
  }
  return "";
}
console.log(findSubStr("aaa3333", "baa333cc")); // aa333
console.log(findSubStr("aaaX3333--", "baa333ccX3333333x")) // X3333
```

``` javascript
// 字符串最小编辑距离
var minDistance = function(word1, word2) {
    let n = word1.length;
    let m = word2.length;
    if(n*m === 0) return n+m;
    if(word1 === word2) return 0;
    let dp = [];
    for(let i = 0;i <= n;i++){
        dp.push([])
        for(let j = 0;j <= m;j++){
            if(i*j){
                dp[i][j] = word1[i-1] == word2[j-1]? dp[i-1][j-1]: (Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]) + 1);
            }else{
                dp[i][j] = i + j;
            }
        }
    }
    return dp[n][m];
};
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
// 二维数组全排列组合
const getResult = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return;
  }
  if (!arr1.length) {
    return arr2;
  }
  if (!arr2.length) {
    return arr1;
  }
  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      result.push(String(arr1[i]) + String(arr2[j]));
    }
  }
  return result;
};

const findAll = arr => arr.reduce((total, current) => getResult(total, current), []);
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
// 矩阵乘法
// 第一行包含一个正整数x，代表第一个矩阵的行数
// 第二行包含一个正整数y，代表第一个矩阵的列数和第二个矩阵的行数
// 第三行包含一个正整数z，代表第二个矩阵的列数
// 之后x行，每行y个整数，代表第一个矩阵的值
// 之后y行，每行z个整数，代表第二个矩阵的值
const x = parseInt(readline())
const y = parseInt(readline())
const z = parseInt(readline())
const A = []
const B = []
const C = []
for(let i = 0; i < x; i++){
    A.push(readline().split(' ').map(Number))
}
for(let i = 0; i < y; i++){
    B.push(readline().split(' ').map(Number))
}
for(let i = 0; i < x; i++){
    const tmpA = []
    for(let j = 0; j < z; j++){
       let num = 0
       for(let k = 0; k < y; k++){
         num += A[i][k]*B[k][j]
       }
       tmpA.push(num) 
    } 
    C.push(tmpA)
}
C.forEach(item =>{
    console.log(item.join(' '))
})
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

``` javascript
// 分苹果
let  str;
while(str = readline()){
  let arr = str.split(' ');
  let m = parseInt(arr[0]),n=parseInt(arr[1]);
  console.log(getCount(m,n))
}
 
function getCount(m,n){
  // m 苹果数 n 盘子数
  if(m==0 || n==1){//极端情况1：都是最小值情况
    return 1;
  }else if(n>m){//极端情况2:盘子比苹果多，那肯定有n-m个盘子空着
    return getCount(m,m)
  }else{
    //极端情况3:范围：[至少一个盘子空着----所有盘子都不空，都有苹果]
    //假设有一个盘子为空，则(m,n)问题转化为将m个苹果放在n-1个盘子上，即求得(m,n-1)即可
    //假设所有盘子都装有苹果，则每个盘子上至少有一个苹果，即最多剩下m-n个苹果，问题转化为将m-n个苹果放到n个盘子上，即求(m-n，n)
    return getCount(m,n-1)+getCount(m-n,n);
  }
}
```

### 二叉树删除节点

``` javascript
    // 删除一个节点
    _removeNode(node, data) {
        if (node == null) {
            return null;
        }
        if (data == node.data) {
            // 叶子节点
            if (node.left == null && node.right == null) {
                return null;
            }

            // 没有左节点的节点
            if (node.left == null) return node.right;
            //没有右节点的节点
            if (node.right == null) return node.left;
            // 有两个节点的节点
            /*  
             做法：
                找到待删除节点的右子树上的最小值创建一个临时节点。
                将临时节点上的值复制到待删除节点，然后再删除临时节点
            */
            // 寻找右子树上的最小值
            let tmpNode = this.getMinNode(node.right);
            node.data = tmpNode.data;
            node.right = this._removeNode(node.right, tmpNode.data);
            return node;
        } else if (data < node.data) {  // 待删除节点在左子树上
            node.left = this._removeNode(node.left, data);
            return node;
        } else {  // 待删除节点在右子树上
            node.right = this._removeNode(node.right, data);
            return node;
        }
    }

```

### 239. 滑动窗口最大值 返回滑动窗口滑动过程中窗口内最大值

单调队列 解法
``` javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
    const q = [];
    const res = [];
    for (let i = 0; i < nums.length; i++) {
        while(q.length && nums[i] >= nums[q.at(-1)]) {
            q.pop();
        }
        q.push(i);
        // j 是当前索引为 i 时，滑动窗口内有 k 个值时，第一个值的索引
        const j = i - k + 1;
        if (j >= 0) {
            // 如果最大值不在滑动窗口中，移除该值，重新获得最大值
            if (q[0] < j) q.shift();
            res.push(nums[q[0]]);
        }
    }
    return res;
};

```

### 给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

``` javascript
/** 异或运算符
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    let ans = 0;

    for(let num of nums) {
        ans ^= num;
    }

    return ans
};

```

### 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。 有效括号组合需满足：左括号必须以正确的顺序闭合。
``` javascript
// 回溯法
var generateParenthesis = function(n) {
  var ans = []
  const dfs = (str, left, right) {
    if (right > left || left > n) return
    if (right === n && left === n) {
      ans.push(str)
    }
    dfs(`${str}(`, left + 1, right)
    dfs(`${str})`, left, right + 1)
  }
  dfs('', 0, 0)
  return ans
}
```


### [最大最小堆](./MinMaxHeap)

### [DFS&BFS深度广度优先遍历](./DFSBFS)

### [排列组合](./Combination)

### [高频精选](https://juejin.cn/post/6844904183007543310)

### [LeetCode hot 100](https://juejin.cn/column/7029946677398077476)
