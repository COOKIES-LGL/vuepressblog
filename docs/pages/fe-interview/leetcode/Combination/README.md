### 排列组合

::: tip
一般 回溯 算法都是比较好的解决方案
:::


### 回溯 算法
组合总和 给定一个无重复元素的正整数数组 candidates 和一个正整数 target ，找出 candidates 中所有可以使数字和为目标数 target 的唯一组合。
``` javascript
var combinationSum = function(candidates, target) {
  var ans = []
  const getCombinationSum = (arr, target, idx) => {
    if (target === 0) {
      ans.push(arr)
      return
    }
    for (let i = idx; i<candidates.length; i++){
      if (candidates[i] > target) return
      if (candidates[i] === candidates[i-1]) continue
      const newTarget = target - candidates[i]
      newArr = [...arr, [candidates[i]]
      getCombinationSum(newArr, newTarget, i)
    } 
  }
  getCombinationSum([], target, 0)
  return ans
}
```

### 全排列
给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列
``` javascript
var combination = function(nums) {
  var ans = []
  const getCombination = (arr, idx) => {
    if (arr.length === nums.length) {
      ans.push(arr)
      return
    }
    for (let i = idx; i<candidates.length; i++){
      if (arr.includes(candidates[i])) return
      newArr = [...arr, [candidates[i]]
      getCombination(newArr, i)
    } 
  }
  getCombination([], 0)
  return ans
}
```
