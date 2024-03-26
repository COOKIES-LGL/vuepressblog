### 虚拟列表的原理与实现

前缀知识  工具hooks

#### useCreation
``` javascript
/**
 * useCreation是useMemo或useRef的替代品。useCreation这个钩子增强了useMemo和useRef，让这个钩子可以替换这两个钩子。
 */
import { DependencyList, useRef } from 'react'
const depsAreSame = (oldDeps: DependencyList, deps: DependencyList): boolean => {
  if (oldDeps === deps) return true
  for (let i = 0; i < oldDeps.length; i++) {
    // 判断两个值是否是同一个值
    if (!Object.is(oldDeps[i], deps[i])) return false
  }
  return true
}
const useCreation = (fn: () => any, deps: DependencyList) => {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | any,
    initialized: false
  })
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps
    current.obj = fn()
    current.initialized = true
  }
  return current.obj as any
}
export default useCreation
```

#### useEventListener
```javascript
/**
 * addEventListener事件绑定的封装
 */
import { useEffect } from 'react'
const useEventListener = (event: string, handler: (...e: any) => void, target: any = window) => {
  useEffect(() => {
    const targetElement = 'current' in target ? target.current : window
    const useEventListener = (event: Event) => {
      return handler(event)
    }
    targetElement.addEventListener(event, useEventListener)
    return () => {
      targetElement.removeEventListener(event, useEventListener)
    }
  }, [event])
}
export default useEventListener
```

#### useReactive
``` javascript
/**
 * 一种具备响应式的useState
 */
import { useRef } from 'react'
import useCreation from './useCreation'
import useUpdate from './useUpdate'

const observer = <T extends Record<string, any>>(initialVal: T, cb: () => void): T => {
  const proxy = new Proxy<T>(initialVal, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      return typeof res === 'object' ? observer(res, cb) : Reflect.get(target, key)
    },
    set(target, key, val) {
      const ret = Reflect.set(target, key, val)
      cb()
      return ret
    }
  })
  return proxy
}

const useReactive = <T extends Record<string, any>>(initialState: T): T => {
  const ref = useRef<T>(initialState)
  const update = useUpdate()
  const state = useCreation(() => {
    return observer(ref.current, () => {
      update()
    })
  }, [])
  return state
}
export default useReactive
```

#### useUpdate
``` javascript
/**
 * 组件强制更新
 */
import { useCallback, useState } from 'react'
const useUpdate = () => {
  const [, setState] = useState({})
  return useCallback(() => setState({}), [])
}
export default useUpdate
```

#### utils
``` javascript
import NP from 'number-precision'
/**
 * 二分查找
 * @param list 目标数组
 * @param value 目标对象
 * @returns
 */
export const binarySearch = (list: any[], value: any) => {
  let start: number = 0
  let end: number = list.length - 1
  let tempIndex = null
  while (start <= end) {
    const midIndex = parseInt(String(NP.divide(NP.plus(start, end), 2)), 10)
    const midValue = list[midIndex].bottom
    if (midValue === value) {
      return NP.plus(midIndex, 1) // 相等时返回下一个下标
    } else if (midValue < value) {
      start = NP.plus(midIndex, 1)
    } else if (midValue > value) {
      if (tempIndex === null || tempIndex > midIndex) {
        tempIndex = midIndex
      }
      end = NP.minus(midIndex, 1)
    }
  }
  return tempIndex
}

export const createScheduler = (callback: () => void, scheduler: (fn: any) => void) => {
  let ticking = false
  const update = () => {
    ticking = false
    callback()
  }
  const requestTick = () => {
    if (!ticking) {
      scheduler(update)
    }
    ticking = true
  }
  return requestTick
}
```

### 元素不定高度
定高我们只需要手动计算下列表的高度，将值传入就行，但不定高就更复杂，因为你无法计算出每个高度的情况，导致列表的整体高度、偏移量都无法正常的计算。
预算高度，我们可以假定子列表的高度也就是虚假高度（initItemHeight）,当我们渲染的时候，在更新对应高度，这样就可以解决子列表高度的问题
我们需要去维护一个公共的高度列表（positions），这个数组将会记录真实的DOM高度信息。
positions需要记录的信息：
::: tip
const state = useReactive<any>({
    ...,
    positions: [ //需要记录每一项的高度
      // index         // 当前pos对应的元素的下标
      // bottom        // 底部位置
      // height        // 元素高度
      // dHeight        // 用于判断是否需要改变
    ], 
    initItemHeight: 50, // 预计高度
})
:::

需要记录元素的高度，其次可以存入距离顶部和底部的高度，方便后面计算偏移量和列表的整体高度，在设定一个参数（dHeight）判断新的高度与旧的高度是否一样，不一样的话就进行更新。
其中最重要的就是index，它用来记录子列表真实高度的下标，原因是：在之前的讲解中，我们发现start 和 end的差值实际上是不变的，也就是说，最终渲染的数据，实际上是一个固定值，但里面的子列表高度却是变值,所以我们需要有一个变量来区分数据所对应的高度，所以这个index就变的尤为重要。
所以在这里我们设置一个ref用来监听子节点node，来获取真实高度,这里我设置id来判断对应的索引。
注意预计高度尽量要小点，可以多加载，但不能少，防止渲染不全。
初始化计算值
- 初始化positions （Dom挂载前）
- 根据真实Dom高度刷新positions位置信息
- 索引的结束位置：end
- 缓冲个数：bufferCount
- 需要渲染的节点数量（可视区能渲染几个节点）
- 列表高度： listHeight
滚动后计算值
- 索引的起始位置：start （二分查找）
- 索引的结束位置：end
- 偏移量：currentOffset
- 重新获取需要渲染的列表数据：data
- 重新根据真实Dom高度刷新positions位置信息
- 重新计算列表高度： listHeight
注意滚动重新计算positions位置信息和初始计算不一样，可以直接从end下标开始计算因为只有这个子元素高度是变化的。

#### 完整代码
定义HOC
``` javascript
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef } from 'react'
import { throttle } from 'lodash-es'
import NP from 'number-precision'
import useCreation from 'virtual-list/core/hooks/useCreation'
import useEventListener from 'virtual-list/core/hooks/useEventListener'
import useReactive from 'virtual-list/core/hooks/useReactive'
import { binarySearch, createScheduler } from 'virtual-list/core/utils'
NP.enableBoundaryChecking(false)

interface IProps {
  ListItem: any
  scrollAllHeight: number
  initItemHeight: number
  itemMarginBottom: number
}

const VirtualListHOC = ({
  ListItem,
  scrollAllHeight,
  initItemHeight,
  itemMarginBottom
}: IProps) => ({ list, ...props }: any) => {
  const allRef = useRef<any>(null) // 容器的ref
  const scrollRef = useRef<any>(null) // 检测滚动
  const ref = useRef<any>(null) // 检测滚动

  const state = useReactive<any>({
    data: [], //渲染的数据
    scrollAllHeight: scrollAllHeight || '100vh', // 容器的初始高度
    listHeight: 0, // 列表高度
    renderCount: 0, // 需要渲染的数量
    bufferCount: 6, // 缓冲的个数
    start: 0, // 起始索引
    end: 0, // 终止索引
    currentOffset: 0, // 偏移量
    positions: [
      // index         // 当前pos对应的元素的下标
      // bottom        // 底部位置
      // height        // 元素高度
      // dHeight       // 用于判断是否需要改变
    ],
    initItemHeight: initItemHeight || 50 // 预计高度
  })

  useEffect(() => {
    // 初始高度
    initPositions()
  }, [])

  const initPositions = () => {
    const data = []
    for (let i = 0; i < list.length; i++) {
      data.push({
        index: i,
        height: state.initItemHeight,
        bottom: NP.times(NP.plus(i, 1), NP.plus(state.initItemHeight, itemMarginBottom)),
        dHeight: 0
      })
    }
    state.positions = [...data]
  }

  useEffect(() => {
    // 子列表高度：为默认的预计高度
    const ItemBoxHeight = NP.plus(initItemHeight, itemMarginBottom) // 子节点包含margin的高度
    const { scrollAllHeight } = state // 容器的高度
    const listHeight = state.positions[state.positions.length - 1].bottom // 列表高度：positions最后一项的bottom
    const renderCount = NP.plus(
      Math.ceil(NP.divide(scrollAllHeight, ItemBoxHeight)),
      state.bufferCount
    ) // 渲染节点的数量
    state.renderCount = renderCount
    state.end = NP.plus(renderCount, 1)
    state.listHeight = listHeight
    state.data = list.slice(state.start, state.end)
  }, [allRef, list.length])

  useEffect(() => {
    // Dom挂载后计算位置信息
    setPosition()
  }, [ref.current])

  const setPosition = () => {
    const nodes = ref.current.childNodes
    if (nodes.length === 0) return
    nodes.forEach((node: HTMLDivElement) => {
      if (!node) return
      const rect = node.getBoundingClientRect() // 获取对应的元素信息
      const index = +node.id // 通过id，来取到对应的索引
      const oldHeight = state.positions[index].height // 旧的高度
      const dHeight = NP.minus(oldHeight, rect.height) // 差值
      if (dHeight) {
        // 偏移高度不为0则更新
        state.positions[index].height = rect.height //真实高度
        state.positions[index].bottom = NP.minus(state.positions[index].bottom, dHeight)
        state.positions[index].dHeight = dHeight // 将差值保存
      }
    })
    // 重新计算整体的高度
    syncPositions(nodes[0].id) // 真实渲染列表的起始下标
  }

  const scrollSetPosition = () => {
    const nodes = ref.current.childNodes
    if (nodes.length === 0) return
    const node = nodes[nodes.length - 1] // 只有最后一个节点需要重新计算
    const rect = node.getBoundingClientRect()
    const endIndex = +node.id // 通过id，来取到对应的索引
    const oldHeight = state.positions[endIndex].height // 旧的高度
    const endDHeight = NP.minus(oldHeight, rect.height) // 差值
    if (endDHeight) {
      // 偏移高度不为0则更新
      state.positions[endIndex].height = rect.height //真实高度
      state.positions[endIndex].bottom = NP.minus(state.positions[endIndex].bottom, endDHeight)
      state.positions[endIndex].dHeight = endDHeight // 将差值保存
    }
    // 从最后一个渲染节点重新计算整体的高度
    syncPositions(endIndex)
  }

  const syncPositions = (startId: number) => {
    const positionsLength = state.positions.length
    let { dHeight } = state.positions[startId]
    state.positions[startId].dHeight = 0 // 抹平差值 往上滚动时不再触发更新
    // 以真实渲染列表的起始下标的下一个节点为起点
    for (let i = NP.plus(startId, 1); i < positionsLength; ++i) {
      state.positions[i].bottom = NP.minus(state.positions[i].bottom, dHeight) // 当前节点的bottom位置等于当前节点bottom减去差值
      const item = state.positions[i]
      if (item.dHeight !== 0) {
        // 偏移高度叠加
        dHeight += item.dHeight
        item.dHeight = 0
      }
    }
    state.listHeight = state.positions[NP.minus(positionsLength, 1)].bottom // 更新列表总高度
  }

  useCreation(() => {
    state.data = list.slice(state.start, state.end)
    if (ref.current) {
      scrollSetPosition()
    }
  }, [state.start])

  const handleScroll = () => {
    const { scrollTop } = scrollRef.current // 顶部高度
    state.start = binarySearch(state.positions, scrollTop) // 寻找起始索引
    state.end = NP.plus(NP.plus(state.start, state.renderCount), 1)
    // 偏移量直接从positions里获取start下标的下个子节点的bottom
    state.currentOffset = state.start > 0 ? state.positions[NP.minus(state.start, 1)].bottom : 0
  }

  useEventListener(
    'scroll',
    throttle(createScheduler(handleScroll, requestAnimationFrame), 100),
    scrollRef
  )

  return (
    <div ref={allRef}>
      <div
        style={{ height: state.scrollAllHeight, overflow: 'scroll', position: 'relative' }}
        ref={scrollRef}
      >
        <div
          style={{ height: state.listHeight, position: 'absolute', left: 0, top: 0, right: 0 }}
        />
        <div
          ref={ref}
          style={{
            transform: `translate3d(0, ${state.currentOffset}px, 0)`,
            position: 'relative',
            left: 0,
            top: 0,
            right: 0
          }}
        >
          {state.data.map((item: any) => (
            <div id={String(item.id)} key={item.id} style={{ marginBottom: itemMarginBottom }}>
              <ListItem
                id={item.id}
                heightRandom={item.heightRandom}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default VirtualListHOC
```

使用HOC
``` javascript
import React, { useEffect, useState } from 'react'
import NP from 'number-precision'

import VirtualListHOC from './hoc'

import img from '@assets/logo.png'

interface ArrayDataType {
  id: number
  heightRandom: number
}

const ListItem: React.FC<ArrayDataType> = ({ id, heightRandom }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: 12, backgroundColor: '#b1f6f6' }}>
      <img src={img} width={80} height={NP.plus(46, heightRandom)} />
      <span style={{ fontSize: 18, marginLeft: 12 }}>列表{id}</span>
    </div>
  )
}

const ListItemHoc = VirtualListHOC({
  ListItem,
  scrollAllHeight: 800,
  initItemHeight: 70,
  itemMarginBottom: 10
})

const Index: React.FC<any> = () => {
  const [list, setList] = useState<Array<ArrayDataType>>([])

  useEffect(() => {
    const arr: ArrayDataType[] = []
    for (let i = 0; i < 500; i++) {
      const heightRandom = NP.times(Math.random(), 30)
      arr.push({ id: i, heightRandom })
    }
    setList(arr) // mock数据
  }, [])

  if (list.length === 0) return <></>

  return (
    <div>
      <ListItemHoc list={list} />
    </div>
  )
}

export default Index

```

### 元素动态高度
不定高度是列表每一项是固定的不定高度，单渲染成真实Dom后高度是固定的，对于动态高度，场景则是渲染成了真实Dom，Dom还会被JS代码或者用户操作修改高度。对于这种场景我们需要增加监听元素高度变化事件，在某个元素发生变化的时候重新计算各种数据。
除了增加监听事件，其它步骤和不定高度一致。
可以使用ResizeObserve对真实渲染的列表节点进行监听。回调任务放入宏任务事件中进行异步调用，防止阻塞。
注意这里我们只需要对渲染的第一个子节点进行对比就行，因为当滚动时如果触发了下标更替，会重新计算所有高度。

``` javascript
const myObserver = new ResizeObserver(entries => {
const currentStartHeight = entries[0].target.children[0].clientHeight
const preStartHeight = Math.round(state.positions[state.start].height)
if (currentStartHeight !== preStartHeight && preStartHeight !== initItemHeight) {
    // 对比新旧值
    createScheduler(setPosition, requestAnimationFrame)()
}
})
myObserver.observe(ref.current)
```
#### 完整代码

定义hoc
``` javascript
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef } from 'react'
import { throttle } from 'lodash-es'
import NP from 'number-precision'
import useCreation from 'virtual-list/core/hooks/useCreation'
import useEventListener from 'virtual-list/core/hooks/useEventListener'
import useReactive from 'virtual-list/core/hooks/useReactive'
import { binarySearch, createScheduler } from 'virtual-list/core/utils'
NP.enableBoundaryChecking(false)
// npm install resize-observer-polyfill

interface IProps {
  ListItem: any
  scrollAllHeight: number
  initItemHeight: number
  itemMarginBottom: number
}

const VirtualListHOC = ({
  ListItem,
  scrollAllHeight,
  initItemHeight,
  itemMarginBottom
}: IProps) => ({ list, ...props }: any) => {
  const allRef = useRef<any>(null) // 容器的ref
  const scrollRef = useRef<any>(null) // 检测滚动
  const ref = useRef<any>(null) // 检测滚动

  const state = useReactive<any>({
    data: [], //渲染的数据
    scrollAllHeight: scrollAllHeight || '100vh', // 容器的初始高度
    listHeight: 0, // 列表高度
    renderCount: 0, // 需要渲染的数量
    bufferCount: 6, // 缓冲的个数
    start: 0, // 起始索
    end: 0, // 终止索引
    currentOffset: 0, // 偏移量
    positions: [
      // index         // 当前pos对应的元素的下标
      // bottom        // 底部位置
      // height        // 元素高度
      // dHeight       // 用于判断是否需要改变
    ],
    initItemHeight: initItemHeight || 50 // 预计高度
  })

  useEffect(() => {
    // 初始高度
    initPositions()
  }, [])

  const initPositions = () => {
    const data = []
    for (let i = 0; i < list.length; i++) {
      data.push({
        index: i,
        height: state.initItemHeight,
        bottom: NP.times(NP.plus(i, 1), NP.plus(state.initItemHeight, itemMarginBottom)),
        dHeight: 0
      })
    }
    state.positions = [...data]
  }

  useEffect(() => {
    // 子列表高度：为默认的预计高度
    const ItemBoxHeight = NP.plus(initItemHeight, itemMarginBottom) // 子节点包含margin的高度
    const { scrollAllHeight } = state // 容器的高度
    const listHeight = state.positions[state.positions.length - 1].bottom // 列表高度：positions最后一项的bottom
    const renderCount = NP.plus(
      Math.ceil(NP.divide(scrollAllHeight, ItemBoxHeight)),
      state.bufferCount
    ) // 渲染节点的数量
    state.renderCount = renderCount
    state.end = NP.plus(renderCount, 1)
    state.listHeight = listHeight
    state.data = list.slice(state.start, state.end)
  }, [allRef, list.length])

  useEffect(() => {
    setPosition() // Dom挂载后计算位置信息
    if (ref.current) {
      const myObserver = new ResizeObserver(entries => {
        const currentStartHeight = entries[0].target.children[0].clientHeight
        const preStartHeight = Math.round(state.positions[state.start].height)
        if (currentStartHeight !== preStartHeight && preStartHeight !== initItemHeight) {
          // 对比新旧值
          createScheduler(setPosition, requestAnimationFrame)()
        }
      })
      myObserver.observe(ref.current)
    }
  }, [ref.current])

  const setPosition = () => {
    const nodes = ref.current.childNodes
    if (nodes.length === 0) return
    nodes.forEach((node: HTMLDivElement) => {
      if (!node) return
      const rect = node.getBoundingClientRect() // 获取对应的元素信息
      const index = +node.id // 通过id，来取到对应的索引
      const oldHeight = state.positions[index].height // 旧的高度
      const dHeight = NP.minus(oldHeight, rect.height) // 差值
      if (dHeight) {
        // 偏移高度不为0则更新
        state.positions[index].height = rect.height //真实高度
        state.positions[index].bottom = NP.minus(state.positions[index].bottom, dHeight)
        state.positions[index].dHeight = dHeight // 将差值保存
      }
    })

    // 重新计算整体的高度
    const startId = +nodes[0].id // 真实渲染列表的起始下标
    const positionsLength = state.positions.length
    let { dHeight } = state.positions[startId]
    state.positions[startId].dHeight = 0 // 抹平差值 往上滚动时不再触发更新
    // 以真实渲染列表的起始下标的下一个节点为起点
    for (let i = NP.plus(startId, 1); i < positionsLength; ++i) {
      state.positions[i].bottom = NP.minus(state.positions[i].bottom, dHeight) // 当前节点的bottom位置等于当前节点bottom减去差值
      const item = state.positions[i]
      if (item.dHeight !== 0) {
        // 偏移高度叠加
        dHeight += item.dHeight
        item.dHeight = 0
      }
    }
    state.listHeight = state.positions[NP.minus(positionsLength, 1)].bottom
  }

  useCreation(() => {
    state.data = list.slice(state.start, state.end)
    if (ref.current) {
      setPosition()
    }
  }, [state.start])

  const handleScroll = () => {
    const { scrollTop } = scrollRef.current // 顶部高度
    state.start = binarySearch(state.positions, scrollTop) // 寻找起始索引
    state.end = NP.plus(NP.plus(state.start, state.renderCount), 1)
    // 偏移量直接从positions里获取start下标的下个子节点的bottom
    state.currentOffset = state.start > 0 ? state.positions[NP.minus(state.start, 1)].bottom : 0
  }

  useEventListener(
    'scroll',
    throttle(createScheduler(handleScroll, requestAnimationFrame), 100),
    scrollRef
  )

  return (
    <div ref={allRef}>
      <div
        style={{ height: state.scrollAllHeight, overflow: 'scroll', position: 'relative' }}
        ref={scrollRef}
      >
        <div
          style={{ height: state.listHeight, position: 'absolute', left: 0, top: 0, right: 0 }}
        />
        <div
          ref={ref}
          style={{
            transform: `translate3d(0, ${state.currentOffset}px, 0)`,
            position: 'relative',
            left: 0,
            top: 0,
            right: 0
          }}
        >
          {state.data.map((item: any) => (
            <div
              id={String(item.id)}
              className={`listItem${item.id}`}
              key={item.id}
              style={{ marginBottom: itemMarginBottom }}
            >
              <ListItem
                id={item.id}
                showDetail={item.showDetail}
                heightRandom={item.heightRandom}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VirtualListHOC
```

使用HOC
``` js
import React, { useEffect, useState } from 'react'
import NP from 'number-precision'

import VirtualListHOC from './hoc'

import img from '@assets/logo.png'

interface ArrayDataType {
  id: number
  heightRandom: number
  showDetail: boolean
  handleShowDetail?: (id: number) => void
}

const ListItem: React.FC<ArrayDataType> = props => {
  const { id, heightRandom, handleShowDetail, showDetail } = props
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: 12, backgroundColor: '#f6dab1' }}>
      <img src={img} width={80} height={NP.plus(46, heightRandom)} />
      <details open={showDetail} style={{ fontSize: 18, marginLeft: 12, cursor: 'pointer' }}>
        <summary
          onClick={e => {
            e.preventDefault()
            handleShowDetail && handleShowDetail(id)
          }}
        >
          第 {id} 章概要
        </summary>
        <div style={{ fontSize: 14 }}>
          将进酒·君不见 李白·唐 君不见，黄河之水天上来，奔流到海不复回。
          君不见，高堂明镜悲白发，朝如青丝暮成雪。 人生得意须尽欢，莫使金樽空对月。天生我材必有用，
          千金散尽还复来。烹羊宰牛且为乐，会须一饮三百杯。
          千金散尽还复来。烹羊宰牛且为乐，会须一饮三百杯。
          千金散尽还复来。烹羊宰牛且为乐，会须一饮三百杯。
        </div>
      </details>
    </div>
  )
}

const ListItemHoc = VirtualListHOC({
  ListItem,
  scrollAllHeight: 800,
  initItemHeight: 70,
  itemMarginBottom: 10
})

const Index: React.FC<any> = () => {
  const [list, setList] = useState<Array<ArrayDataType>>([])

  useEffect(() => {
    const arr: ArrayDataType[] = []
    for (let i = 0; i < 200; i++) {
      const heightRandom = NP.times(Math.random(), 30)
      arr.push({ id: i, heightRandom, showDetail: false })
    }
    setList(arr) // mock数据
  }, [])

  if (list.length === 0) return <></>

  const handleShowDetail = (id: number) => {
    const listTemp = list
    listTemp[id].showDetail = !listTemp[id].showDetail
    setList([...listTemp])
  }
  return (
    <div>
      <ListItemHoc list={list} handleShowDetail={handleShowDetail} />
    </div>
  )
}

export default Index

```
