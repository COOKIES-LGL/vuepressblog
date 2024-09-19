### Recoil

### RouterView

```typescript
// 取消订阅
interface Disconnect {
  disconnect: () => void;
}
export class Stateful<T> {
  private listeners = new Set<(value: T) => void>();
  // ...
  // 订阅
  subscribe(callback: (value: T) => void): Disconnect {
    this.listeners.add(callback);
    return {
      disconnect: () => {
        this.listeners.delete(callback);
      },
    };
  }
  // 发布
  private emit() {
    for (const listener of Array.from(this.listeners)) {
      listener(this.snapshot());
    }
  }
  protected update(value: T) {
    if (this.value !== value) {
      this.value = value;
      // ++ 发布订阅
      this.emit();
    }
  }
}

// 我们给update操作增加日志，看看
class Atom<T> extends Stateful<T> {
  public setState(value: T) {
    super.update(value);
    console.log(this.snapshot());
  }
}

export function useRecoilValue<T>(atom: Atom<T>): T {
  // {} !== {}
  const [, updateState] = useState({});
  // 因为 {} !== {}，用 useEffect 注册, 触发渲染
  useEffect(() => {
    // 订阅
    const { disconnect } = atom.subscribe(() => updateState({}));
    // 卸载时
    return () => disconnect();
  }, [atom]);
  return atom.snapshot();
}

export function useRecoilState<T>(atom: Atom<T>): [T, (value: T) => void] {
  // 获取value
  const value = useRecoilValue(atom);
  // 使用useCallback包裹更新的方法，防止atom不变的情况，无效更新
  return [
    value,
    useCallback(
      (value) => {
        atom.setState(value);
      },
      [atom]
    ),
  ];
}

new Atom({});
```
