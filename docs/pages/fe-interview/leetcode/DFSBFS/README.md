::: tip
不管是前序遍历，还是中序遍历，亦或是后序遍历，都属于深度优先遍历。
:::

### 深度优先遍历 递归
``` javascript
const dfs = (treeNode) => { 
	if (treeNode == null) { 
		return;
	} 
	process(treeNode);  // 前序遍历节点
	dfs(treeNode.left);  // 遍历左节点
	dfs(treeNode.right);  // 遍历右节点
	// dfs(treeNode.left);  // 遍历左节点
	// process(treeNode);  // 中序遍历节点
	// dfs(treeNode.right);  // 遍历右节点
	// -------------------
	// dfs(treeNode.left);  // 遍历左节点
	// dfs(treeNode.right);  // 遍历右节点
    // process(treeNode);  // 后序遍历节点
} 
```

### 深度优先遍历 栈循环
``` javascript
const dfsWithStack = (root) => { 
	if (!root) return
	const stack = []
	stack.push(root)
	while (stack && stack.length > 0) {
		const treeNode = stack.pop()
		process(treeNode) // 前序
		if (treeNode.left) {
			stack.push(treeNode.left)
		}
		if (treeNode.right) {
			stack.push(treeNode.right)
		}
	}

}
```

### 广度优先遍历 队列循环

``` javascript
const bfsWithQueue = (root) => { 
	if (!root) return
	const queue = []
	queue.push(root)
	while (queue && queue.length > 0) {
		const treeNode = stack.shift()
		process(treeNode)
		if (treeNode.left) {
			queue.push(treeNode.left)
		}
		if (treeNode.right) {
			queue.push(treeNode.right)
		}
	}
}
```
