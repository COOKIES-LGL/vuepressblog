---
home: false
sidebar: false
---

### 批量加载图片

**因为 Promise.all 的返回是传入 promise 组 相互依赖的结果，当其中有一个完成了还得等其它都完成，也不是题目想要的效果。也就有了下面的思路将八张图片先拿三张出来，当做 初始请求，但是一旦有完成的（无论成功或失败）就 将成后面的一张的结果加入请求。**

```javascript
function limitRequest(urlArr, max) {
  const urls = [].concat(urlArr);
  let currentUrls = urls.splice(0, 3);
  let currentPromises = currentUrls.map((url) => loadImg(url));
  let resolvedUrl = "";
  const len = urls.length;
  const results = [];

  return urls.reduce((acc, url, index) => {
    return acc
      .then(() => Promise.race(currentPromises))
      .then((img) => {
        console.log("wow~~", index, img);
        results.push(img);
        resolvedUrl = img.src;
        updatePromises(resolvedUrl, url);
      })
      .catch((err) => {
        console.log(`第 ${index} 张图片加载失败了`);
        resolvedUrl = err.message.match(/http[s]?:\/\/.{1,}$/);
        results.push(index);
        updatePromises(resolvedUrl, url);
      })
      .then(() => {
        return new Promise((resolve) => {
          if (index === urls.length - 1) {
            Promise.all(currentPromises).then((res) => {
              results.push(...res);
              resolve(results);
            });
          } else resolve();
        });
      });
  }, Promise.resolve());

  function updatePromises(removeUrl, addUrl) {
    const idx = currentUrls.findIndex((url) => url === removeUrl);
    currentUrls.splice(idx, 1, addUrl);
    currentPromises[idx] = loadImg(addUrl);
  }
}

limitRequest(urls, 3).then((res) => {
  console.log("end", res);
});
```

```javascript
// 将数组分割成指定长度
function subGroup(arr, len) {
  var newArr = [];
  for (var i = 0; i < arr.length; i += len) {
    newArr.push(arr.slice(i, i + len));
  }
  return newArr;
}
```

### 进制转化

```javascript
1.其他进制转十进制
变量/声明我是几进制
parseInt("16",16) // 22
parseInt("12",8)  // 10
parseInt("1010",2) // 10
2.十进制转其他进制
var v1 = 24;
v1.toString(16)     //转16进制 18
v1.toString(8)      //转8进制  30
v1.toString(2)      //转2进制  11000
v1.toString(10)     //转10进制 24

parseInt(num,2).toString(8)      //2进制转8进制
parseInt(num,8).toString(2)     //8进制转2进制
```

```javascript
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

### 快速排序

```javascript
// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const num = arr[0];
  let left = [],
    right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] <= num) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return quickSort(left).concat([num], quickSort(right));
}
```

### 归并排序

```javascript
// 归并排序
function mergeSort(arr) {
  //采用自上而下的递归方法
  var len = arr.length;
  if (len < 2) {
    return arr;
  }
  var middle = Math.floor(len / 2),
    left = arr.slice(0, middle),
    right = arr.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  var result = [];
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  while (left.length) {
    result.push(left.shift());
  }
  while (right.length) {
    result.push(right.shift());
  }
  return result;
}
var arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.log(mergeSort(arr));
// 方式2;
function merge(left, right) {
  const res = [];
  while (left.length && right.length) {
    res.push(left <= right ? left.shift() : right.shift()); // 按序合并‌:ml-citation{ref="3,4" data="citationList"}
  }
  return [...res, ...left, ...right]; // 合并剩余元素‌:ml-citation{ref="3,4" data="citationList"}
}
```

### 插入排序

```javascript
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i]; // key 是此次循环需要找到位置的元素
    let j = i - 1;

    // 移动并查找插入的位置
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// 示例使用
const arr = [10, 2, 9, 3, 8, 4, 7, 5, 6];
const sortedArr = insertionSort(arr);
console.log(sortedArr); // 输出: [2, 3, 4, 5, 6, 7, 8, 9, 10]
```

### 动态规划

```javascript
// 动态规划01背包
function knapSack(w, val, capacity, n) {
  var T = [];
  for (let i = 0; i < n; i++) {
    T[i] = [];
    for (let j = 0; j <= capacity; j++) {
      if (j === 0) {
        //容量为0
        T[i][j] = 0;
        continue;
      }
      if (j < w[i]) {
        //容量小于物品重量，本行hold不住
        if (i === 0) {
          T[i][j] = 0; // i = 0时，不存在i-1，所以T[i][j]取0
        } else {
          T[i][j] = T[i - 1][j]; //容量小于物品重量，参照上一行
        }
        continue;
      }
      if (i === 0) {
        T[i][j] = val[i]; //第0行，不存在 i-1, 最多只能放这一行的那一个物品
      } else {
        T[i][j] = Math.max(val[i] + T[i - 1][j - w[i]], T[i - 1][j]);
      }
    }
  }
  findValue(w, val, capacity, n, T);
  return T;
}
//找到需要的物品
function findValue(w, val, capacity, n, T) {
  var i = n - 1,
    j = capacity;
  while (i > 0 && j > 0) {
    if (T[i][j] != T[i - 1][j]) {
      console.log("选择物品" + i + ",重量：" + w[i] + ",价值：" + val[i]);
      j = j - w[i];
      i--;
    } else {
      i--; //如果相等，那么就到 i-1 行
    }
  }
  if (i == 0) {
    if (T[i][j] != 0) {
      //那么第一行的物品也可以取
      console.log("选择物品" + i + ",重量：" + w[i] + ",价值：" + val[i]);
    }
  }
}
var values = [3, 4, 5],
  weights = [2, 3, 4],
  capacity = 5,
  n = values.length;
console.log(knapSack(weights, values, capacity, n));
```

### 最长递增子序列

```javascript
// 最长递增子序列
var getSequence = function (nums) {
  let len = nums.length;
  if (len < 1) return len;
  let l = 1; // 定义返回的最长的子序列长度，最小为 1
  let dp = new Array(len).fill(1); // 定义动态规划状态数组,初始化每一位作为单独的序列为长度 1
  // 第一层循环，从第一位开始遍历，取出每一位元素，依次与前面所有元素做对比
  for (let i = 1; i < len; i++) {
    // 第二层循环，依次与前面所有元素做对比
    for (let j = 0; j < i; j++) {
      // 如果第一层取到的当前元素大于当前元素之前的某个元素
      if (nums[i] > nums[j]) {
        // 则重新更新当前 i 所对应的状态值，更新为原来的值和当前在对比元素+1后的最大值
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    l = Math.max(l, dp[i]); // 每次循环之后，拿到当前最大的序列长度
  }
  return l;
};
getSequence([3, 7, 22, 4, 8, 13, 9, 11, 12]);
```

### 找零钱问题

```javascript
// 找零钱问题
//动态规划 -- 硬币找零问题
function minCoins(coins, total, n) {
  var T = [];
  for (let i = 0; i < n; i++) {
    T[i] = [];
    for (let j = 0; j <= total; j++) {
      if (j == 0) {
        T[i][j] = 0;
        continue;
      }
      if (i == 0) {
        T[i][j] = j / coins[i]; //硬币找零一定要有个 最小面额1，否则会无解
      } else {
        if (j >= coins[i]) {
          T[i][j] = Math.min(T[i - 1][j], 1 + T[i][j - coins[i]]);
        } else {
          T[i][j] = T[i - 1][j];
        }
      }
    }
  }
  findValue(coins, total, n, T);
  return T;
}

function findValue(coins, total, n, T) {
  var i = n - 1,
    j = total;
  while (i > 0 && j > 0) {
    if (T[i][j] != T[i - 1][j]) {
      //锁定位置,确定i,j值，开始找构成结果的硬币组合。 其实根据这种计算方法，只需要考虑最右边那一列，从下往上推。
      console.log(T[i][j]);
      break;
    } else {
      i--;
    }
  }
  var s = []; //存储组合结果
  while (i >= 0 && j > 0) {
    s.push(coins[i]);
    j = j - coins[i];
    if (j <= 0) {
      break; //计算结束，退出循环
    }
    //如果 i == 0,那么就在第 0 行一直循环计算，直到 j=0即可
    if (i > 0) {
      //console.log(i);
      while (T[i][j] == T[i - 1][j]) {
        i--;
        if (i == 0) {
          break;
        }
      }
    }
  }
  console.log(s);
}
var coins = [1, 2, 5, 6];
var total = 11;
var n = coins.length;
console.log(minCoins(coins, total, n));
```

### 最长公共子序列

```javascript
// 动态规划 -- 最长公共子序列
// T[i][j] 计算，记住口诀：相等左上角加一，不等取上或左最大值
// T[i][j] 表示text1前i个元素和text2前j个元素的公共子序列长度
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

### 最大公共子串

```javascript
// 最大公共子串
function findSubStr(str1, str2) {
  if (str1.length > str2.length) {
    // 找到较长的那个字符串
    var temp = str1;
    str1 = str2;
    str2 = temp;
  }
  var len1 = str1.length,
    len2 = str2.length;
  for (var j = len1; j > 0; j--) {
    for (var i = 0; i < len1 - j; i++) {
      var current = str1.substr(i, j);
      // 在长的里面找短的，没找到则短的截取掉一个从新找，找到了就是最长的了
      if (str2.indexOf(current) >= 0) {
        return current;
      }
    }
  }
  return "";
}
console.log(findSubStr("aaa3333", "baa333cc")); // aa333
console.log(findSubStr("aaaX3333--", "baa333ccX3333333x")); // X3333
```

### 字符串最小编辑距离

```javascript
// 字符串最小编辑距离
var minDistance = function (word1, word2) {
  let n = word1.length;
  let m = word2.length;
  if (n * m === 0) return n + m;
  if (word1 === word2) return 0;
  let dp = [];
  for (let i = 0; i <= n; i++) {
    dp.push([]);
    for (let j = 0; j <= m; j++) {
      if (i * j) {
        if (word1[i - 1] == word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        }
      } else {
        dp[i][j] = i + j;
      }
    }
  }
  return dp[n][m];
};
```

### 字符串排列

```javascript
// 字符串排列
function Permutation(str) {
  // write code here
  let arr = str.split("");
  let res = [];
  function swap(p, q) {
    [arr[p], arr[q]] = [arr[q], arr[p]];
  }
  function dfs(p, q) {
    if (p === q) {
      res.push(arr.join(""));
      return;
    }
    for (let i = p; i <= q; i++) {
      swap(p, i);
      dfs(p + 1, q);
      swap(p, i);
    }
  }
  dfs(0, arr.length - 1);
  res = Array.from(new Set(res));
  return res;
}
module.exports = {
  Permutation: Permutation,
};
```

```javascript
/**
 * 不定长二维数组的全排列
 * 动态规划，下一次的结果，依赖上一次的结果
 * 比如 [['A','B'], ['a','b'], [1, 2]]，输出 ['Aa1','Aa2','Ab1','Ab2','Ba1','Ba2','Bb1','Bb2']
 * @param {array} arr
 */
function permutate(arr) {
  // 第一次的结果就是二维数组的第0项
  let res = arr[0].slice();

  for (let i = 1; i < arr.length; i++) {
    const pre = res.slice();
    res = [];
    pre.forEach((item) => {
      arr[i].forEach((curr) => {
        res.push(item + curr);
      });
    });
  }
  console.log(res);
  return res;
}
permutate([
  ["A", "B"],
  ["a", "b"],
  [1, 2],
]);
```

### 维数组全排列组合

```javascript
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

const findAll = (arr) => arr.reduce((total, current) => getResult(total, current), []);
```

### 称砝码

```javascript
// 称砝码
let line1 = readline();
let line2 = readline();
let line3 = readline();
let m = line2.split(" "); //每种砝码的重量
let x = line3.split(" "); //每种砝码对应的数量范围
let fama = []; //序列化砝码，比如两个1g和一个2g的砝码用[1,1,2]表示
for (let i = 0; i < m.length; i++) {
  for (let j = 0; j < x[i]; j++) {
    fama.push(Number(m[i]));
  }
}
let kind = new Set(); //用set表示加入当前砝码之前能产生的重量种类
kind.add(0); //set初始化为0
// 当第一个1g砝码放入时，set中要插入原先所有元素+1g后的结构，即{0,0+1}，插入后变为{0,1}
// 当第二个1g砝码放入时，set要插入{0+1,1+1},变为{0,1,2}
// 第三个2g砝码放入时，set要插入{0+2,1+2,2+2},变为{0,1,2,3,4}
for (let i = 0; i < fama.length; i++) {
  let arr = [...kind]; //用一个数组来缓存当前种类的砝码的值
  for (let k of arr) {
    kind.add(k + fama[i]);
  }
}
console.log(kind.size);
```

### 迷宫问题

```javascript
// 迷宫问题
// 递归调用，每次判断上下左右四方向； 走过路径标记为1，直到最终到达终点
let n = readline().split(" ").map(Number);
// n = [5, 5];
let maze = []; //读数据
while ((line = readline())) {
  maze.push(line.split(" ").map(Number));
}
function find(i, j, road) {
  road.push([i, j]); //先推入0,0
  maze[i][j] = 1;
  // n[0] = 5; n[1] = 5, 行列长度
  if (i == n[0] - 1 && j == n[1] - 1) {
    // 到达目的地
    for (let i of road) {
      console.log(`(${i[0]},${i[1]})`);
    }
  }
  if (j + 1 < n[1] && maze[i][j + 1] == 0) find(i, j + 1, road); //右
  if (i + 1 < n[0] && maze[i + 1][j] == 0) find(i + 1, j, road); //下
  if (j - 1 >= 0 && maze[i][j - 1] == 0) find(i, j - 1, road); //左
  if (i - 1 >= 0 && maze[i - 1][j] == 0) find(i - 1, j, road); //上
}
find(0, 0, []);
```

### 矩阵乘法

```javascript
// 矩阵乘法
// 第一行包含一个正整数x，代表第一个矩阵的行数
// 第二行包含一个正整数y，代表第一个矩阵的列数和第二个矩阵的行数
// 第三行包含一个正整数z，代表第二个矩阵的列数
// 之后x行，每行y个整数，代表第一个矩阵的值
// 之后y行，每行z个整数，代表第二个矩阵的值
const x = parseInt(readline());
const y = parseInt(readline());
const z = parseInt(readline());
const A = [];
const B = [];
const C = [];
for (let i = 0; i < x; i++) {
  A.push(readline().split(" ").map(Number));
}
for (let i = 0; i < y; i++) {
  B.push(readline().split(" ").map(Number));
}
for (let i = 0; i < x; i++) {
  const tmpA = [];
  for (let j = 0; j < z; j++) {
    let num = 0;
    for (let k = 0; k < y; k++) {
      num += A[i][k] * B[k][j];
    }
    tmpA.push(num);
  }
  C.push(tmpA);
}
C.forEach((item) => {
  console.log(item.join(" "));
});
```

### 名字漂亮度

```javascript
// 名字漂亮度
// 字符串中出现次数最多的赋值26第二多的25 然后计算和
while ((n = readline())) {
  for (let i = 0; i < n; i++) {
    let str = readline();
    let map = new Array(26).fill(0);
    let res = 0;
    let arr = str.toLowerCase().split("");
    arr.forEach((ele) => {
      map[ele.charCodeAt(0) - 97]++;
    });
    map.sort((a, b) => b - a);
    // 降序排列之后就可以求和
    for (let i = 0; i < 26; i++) {
      res += map[i] * (26 - i);
    }
    console.log(res);
  }
}
```

### 反转链表

```javascript
// 反转链表
class Node {
  constructor(v, next) {
    this.v = v;
    this.next = next;
  }
}

const reverseLinkedList = (head) => {
  let prev = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
};
```

### 分苹果

```javascript
// 分苹果
let str;
while ((str = readline())) {
  let arr = str.split(" ");
  let m = parseInt(arr[0]),
    n = parseInt(arr[1]);
  console.log(getCount(m, n));
}

function getCount(m, n) {
  // m 苹果数 n 盘子数
  if (m == 0 || n == 1) {
    //极端情况1：都是最小值情况
    return 1;
  } else if (n > m) {
    //极端情况2:盘子比苹果多，那肯定有n-m个盘子空着
    return getCount(m, m);
  } else {
    //极端情况3:范围：[至少一个盘子空着----所有盘子都不空，都有苹果]
    //假设有一个盘子为空，则(m,n)问题转化为将m个苹果放在n-1个盘子上，即求得(m,n-1)即可
    //假设所有盘子都装有苹果，则每个盘子上至少有一个苹果，即最多剩下m-n个苹果，问题转化为将m-n个苹果放到n个盘子上，即求(m-n，n)
    return getCount(m, n - 1) + getCount(m - n, n);
  }
}
```

### 二叉树删除节点

```javascript
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

### 滑动窗口最大值

239. 滑动窗口最大值 返回滑动窗口滑动过程中窗口内最大值

单调队列 解法

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
  const q = [];
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    while (q.length && nums[i] >= nums[q.at(-1)]) {
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

### 最大子序和

给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 * 输入： nums = [-2,1,-3,4,-1,2,1,-5,4] 输出： 6 解释： 连续子数组 [4,-1,2,1] 的和最大，为 6 。
 */
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = maxSum;

  for (let i = 1; i < nums.length; i++) {
    if (currentSum < 0) {
      currentSum = nums[i];
    } else {
      currentSum += nums[i];
    }
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
// 动态规划
var maxSubArray = function (nums) {
  let pre = 0,
    maxAns = nums[0];
  nums.forEach((x) => {
    pre = Math.max(pre + x, x);
    maxAns = Math.max(maxAns, pre);
  });
  return maxAns;
};
```

### 找出那个只出现了一次的元素

给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

```javascript
/** 异或运算符
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
  let ans = 0;

  for (let num of nums) {
    ans ^= num;
  }

  return ans;
};
```

### 有效括号组合

数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。 有效括号组合需满足：左括号必须以正确的顺序闭合。

```javascript
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

### 杨辉三角

```javascript
// 构建杨辉三角
// 输入: 5 输出: [ [1], [1,1], [1,2,1], [1,3,3,1], [1,4,6,4,1] ]
var generate = function (numRows) {
  var res = [];
  for (var i = 0; i < numRows; i++) {
    var arr = [1];
    for (var j = 1; j < i; j++) {
      arr[j] = res[i - 1][j] + res[i - 1][j - 1];
    }
    arr[i] = 1;
    res.push(arr);
  }
  return res;
};
// 返回杨辉三角第几行
var getRow = function (rowIndex) {
  var res = [1];
  if (rowIndex == 0) return [1];
  if (rowIndex == 1) {
    return [1, 1];
  }
  var arr = getRow(rowIndex - 1);
  for (var i = 1; i < rowIndex; i++) {
    res[i] = arr[i] + arr[i - 1];
  }
  res.push(1);
  return res;
};
```

### 岛屿的最大面积

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 * 给你一个正方形二维网格图，其中只包含 0（水）和 1（陆地）。
 * 岛屿由一组相连的陆地单元格组成，这里的「相连」要求两个陆地单元水平或垂直地相邻即它们有一个共同边。找出并返回岛屿的最大面积
 */
var maxAreaOfIsland = function (grid) {
  let m = grid.length;
  let n = grid[0].length;
  let maxArea = 0;

  function dfs(i, j, area) {
    if (i < 0 || j < 0 || i >= m || j >= n || grid[i][j] === 0) {
      return 0;
    }
    grid[i][j] = 0; // 标记为0，避免重复计算
    area++;
    // 上下左右四个方向深度优先搜索
    area += dfs(i + 1, j, 0);
    area += dfs(i - 1, j, 0);
    area += dfs(i, j + 1, 0);
    area += dfs(i, j - 1, 0);
    return area;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        maxArea = Math.max(maxArea, dfs(i, j, 1));
      }
    }
  }
  return maxArea;
};
```

### 判断平衡二叉树

```javascript
var isBalanced = function (root) {
  if (!root) return true;
  function depth(node) {
    if (!node) return 0;
    var left = depth(node.left);
    var right = depth(node.right);
    return Math.max(left, right) + 1;
  }
  if (Math.abs(depth(root.left) - depth(root.right)) > 1) return false;
  return isBalanced(root.left) && isBalanced(root.right);
};
```

求最优，你就应该想到动态规划，发现求最大最小，你就应该想到贪心算法，发现求子集，你就应该想到回溯算法

### 哨兵节点

在链表中，我们经常会使用哨兵节点，比如在链表的头部添加一个哨兵节点，这样我们就不需要单独处理头节点的情况。
举一个简单的例子，我们要删除链表中的一个节点，我们可以这样做

```js
//创建一个哨兵节点
let dummy = new ListNode(0);
dummy.next = head;
let prev = dummy;
while (prev.next) {
  if (prev.next.val === val) {
    prev.next = prev.next.next;
    break;
  }
  prev = prev.next;
}
return dummy.next;
```

### Tire 树

Tire 树主要用于解决字符串匹配等问题，特别适合查找字符串长度基本都不长，但是量很大的情况。
Tire 树的核心思想是将字符串存储在树中，然后通过树来查找字符串,Tire 树的典型问题有实现一个 Trie 树、实现一个 Trie 树的前缀搜索.

```js
class Trie {
  constructor() {
    this.root = {};
  }
  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node[char]) {
        node[char] = {};
      }
      node = node[char];
    }
    node.isEnd = true;
  }
  search(word) {
    let node = this.root;
    for (let char of word) {
      if (!node[char]) {
        return false;
      }
      node = node[char];
    }
    return node.isEnd || false;
  }
  startsWith(prefix) {
    let node = this.root;
    for (let char of prefix) {
      if (!node[char]) {
        return false;
      }
      node = node[char];
    }
    return true;
  }
}
```

### 线段树

线段树主要用于解决区间查询等问题，特别适合区间查询问题。线段树的核心思想是将区间存储在树中，然后通过树来查询区间.
线段树的典型问题有区间和的查询、区间最大值的查询

```js
class SegmentTree {
  constructor(nums) {
    this.n = nums.length;
    this.tree = new Array(2 * this.n).fill(0);
    for (let i = 0; i < this.n; i++) {
      this.tree[this.n + i] = nums[i];
    }
    for (let i = this.n - 1; i > 0; i--) {
      this.tree[i] = this.tree[2 * i] + this.tree[2 * i + 1];
    }
  }

  update(i, val) {
    i += this.n;
    this.tree[i] = val;
    while (i > 0) {
      let left = i;
      let right = i;
      if (i % 2 === 0) {
        right = i + 1;
      } else {
        left = i - 1;
      }
      this.tree[i / 2] = this.tree[left] + this.tree[right];
      i /= 2;
    }
  }

  sumRange(i, j) {
    i += this.n;
    j += this.n;
    let sum = 0;
    while (i <= j) {
      if (i % 2 === 1) {
        sum += this.tree[i];
        i++;
      }
      if (j % 2 === 0) {
        sum += this.tree[j];
        j--;
      }
      i /= 2;
      j /= 2;
    }
    return sum;
  }
}
let nums = [1, 3, 5];
let st = new SegmentTree(nums);
console.log(st.sumRange(0, 2)); // 9
st.update(1, 2);
console.log(st.sumRange(0, 2)); // 8
```

### 翻转二叉树

```js
// 递归交换左右子树的值
var invertTree = function (root) {
  if (root === null) {
    return null;
  }
  const left = invertTree(root.left);
  const right = invertTree(root.right);
  root.left = right;
  root.right = left;
  return root;
};
```

### [最大最小堆](./MinMaxHeap)

### [DFS&BFS 深度广度优先遍历](./DFSBFS)

### [排列组合](./Combination)

### [高频精选](https://juejin.cn/post/6844904183007543310)

### [LeetCode hot 100](https://juejin.cn/column/7029946677398077476)
