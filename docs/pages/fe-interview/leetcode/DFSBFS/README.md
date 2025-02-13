::: tip
二叉树不管是前序遍历，还是中序遍历，亦或是后序遍历，都属于深度优先遍历。
:::

### 深度优先遍历-递归

```javascript
const dfs = (treeNode) => {
  if (treeNode == null) {
    return;
  }
  process(treeNode); // 前序遍历节点
  dfs(treeNode.left); // 遍历左节点
  dfs(treeNode.right); // 遍历右节点
  // dfs(treeNode.left);  // 遍历左节点
  // process(treeNode);  // 中序遍历节点
  // dfs(treeNode.right);  // 遍历右节点
  // -------------------
  // dfs(treeNode.left);  // 遍历左节点
  // dfs(treeNode.right);  // 遍历右节点
  // process(treeNode);  // 后序遍历节点
};
```

### 深度优先遍历-迭代

```javascript
// 二叉树中序遍历的迭代实现
function inOrderTraversalIterative(root) {
  const stack = [];
  let current = root;
  const result = [];
  while (stack.length > 0 || current !== null) {
    // 遍历左子树，将左子节点依次入栈
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }
    // 栈顶元素为最左边的节点，访问它
    current = stack.pop();
    result.push(current.val);
    // 遍历右子树，将右子节点设为当前节点
    current = current.right;
  }
  return result;
}
// 二叉树前序遍历的迭代实现
function preOrderTraversalIterative(root) {
  const stack = [];
  let current = root;
  const result = [];
  while (current !== null || stack.length > 0) {
    // 遍历左子树，将左子节点依次入栈
    while (current !== null) {
      result.push(current.val); // 访问当前节点（前序遍历：根-左-右，所以先访问根节点）
      stack.push(current);
      current = current.left;
    }
    // 栈顶元素为最左边的节点，此时其左子树已遍历完，出栈
    current = stack.pop();
    // 遍历右子树，将右子节点设为当前节点
    current = current.right;
  }
  return result;
}
// 二叉树后序遍历的迭代实现
function postOrderTraversalIterative(root) {
  const stack = []; // 用于存储待访问的节点
  const output = []; // 用于存储遍历结果
  let lastVisited = null; // 用于记录上一个访问的节点，以便判断是否可以访问当前节点的值
  let current = root; // 当前访问的节点
  while (current !== null || stack.length > 0) {
    // 遍历左子树，将左子节点依次入栈
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }
    let node = stack.pop();
    if (node.right === null || node.right === lastVisited) {
      output.push(node.val); // 访问节点值
      lastVisited = node; // 更新上一个访问的节点
    } else {
      stack.push(node); // 将节点重新入栈，以便稍后访问其右子树后再访问它本身
      current = node.right; // 设置当前节点为其右子节点，准备遍历右子树
    }
  }
  return output; // 返回后序遍历的结果
}
```

### 深度优先遍历-栈循环

```javascript
const dfsWithStack = (root) => {
  if (!root) return;
  const stack = [];
  stack.push(root);
  while (stack && stack.length > 0) {
    const treeNode = stack.pop();
    process(treeNode); // 前序
    if (treeNode.left) {
      stack.push(treeNode.left);
    }
    if (treeNode.right) {
      stack.push(treeNode.right);
    }
  }
};
```

### 广度优先遍历-队列循环

```javascript
const bfsWithQueue = (root) => {
  if (!root) return;
  const queue = [];
  queue.push(root);
  while (queue && queue.length > 0) {
    const treeNode = stack.shift();
    process(treeNode);
    if (treeNode.left) {
      queue.push(treeNode.left);
    }
    if (treeNode.right) {
      queue.push(treeNode.right);
    }
  }
};
```
