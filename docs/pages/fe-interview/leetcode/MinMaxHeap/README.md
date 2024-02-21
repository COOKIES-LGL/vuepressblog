### 最大堆最小堆

::: tip
数组保存堆结构时每个节点对应的父子节点位置
const parent = (i) => Math.ceil(i / 2 - 1);
const leftChild = (i) => 2 * i + 1;
const rightChild = (i) => 2 * i + 2;
:::

``` javascript
class Heap {
	//  comparator 默认按照从小到大的顺序
	constructor(comparator = (a, b) => a - b) {
		this.array = [];
		this.comparator = (i1, i2) => comparator(this.array[i1], this.array[i2]);
	}

	get size() {
		return this.array.length;
	}

	swap(a, b) {
		[this.array[a], this.array[b]] = [this.array[b], this.array[a]];
	}

	// 插入新的节点
	add(value) {
		this.array.push(value);
		this.bubbleUp();
	}

	// 如果新的节点不符合优先级的顺序，则移动它，直到符合为止
	bubbleUp() {
		let curr = this.size - 1;
		const parent = (i) => Math.ceil(i / 2 - 1);
		// 比较父节点和当前节点（新节点）的优先级，
                // 低的排在上面，因此如果父节点比子节点优先级高，则交换两个节点，直到当前节点的优先级有序为止
		while (parent(curr) >= 0 && this.comparator(parent(curr), curr) > 0) {
			this.swap(parent(curr), curr);
			curr = parent(curr);
		}
	}

	// 删除节点
	remove(index = 0) {
		// 将要移除的节点和最后一个子节点交换
		this.swap(this.size - 1, index);
		// 移除节点并保存值
		const value = this.array.pop();
		// 使子节点按照优先级排序
		this.bubbleDown();
		return value;
	}

	bubbleDown(index = 0) {
		let curr = index;
		const left = (i) => 2 * i + 1;
		const right = (i) => 2 * i + 2;
		// 比较两个子节点的优先级，选出优先级最低的
		const getTopChild = (i) =>
			right(i) < this.size && this.comparator(left(i), right(i)) > 0
				? right(i)
				: left(i);

		// 比较父节点和选出的低优先级子节点，
		// 如果当前节点的优先级高，则交换两个节点，直到每个节点都优先级都有序为止
		while (
			left(curr) < this.size &&
			this.comparator(curr, getTopChild(curr)) > 0
		) {
			const next = getTopChild(curr);
			this.swap(curr, next);
			curr = next;
		}
	}
}

class MinHeap extends Heap {
	constructor() {
		super((a, b) => a - b);
	}
}

class MaxHeap extends Heap {
	constructor() {
		super((a, b) => b - a);
	}
}

const pq = new MaxHeap((x, y) => y.age - x.age);
pq.add({ name: "Maria", age: 23 });
pq.add({ name: "Nushi", age: 42 });
pq.add({ name: "Jose", age: 32 });

console.log(pq.remove()); // { name: 'Nushi', age: 42 }
console.log(pq.array); // [{ name: 'Jose', age: 32 }, { name: 'Maria', age: 23 }]


```
