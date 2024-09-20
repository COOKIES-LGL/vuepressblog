[MDN ServerWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers)

#### 编写 Service Worker

```js
// service-worker.js 实现缓存逻辑
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("my-cache-v1").then((cache) => {
      cache.addAll([
        "/index.html",
        "/styles.css",
        "/script.js",
        // 添加其他要缓存的资源
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
```

install 事件用于缓存初始资源，fetch 事件用于拦截网络请求，优先从缓存中提供资源，如果没有找到，则尝试从网络获取。

#### 注册 Service Worker

```js
// main.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
```

**Service Workers 还支持一些高级功能，如网络优先策略、动态缓存更新和推送通知。**

#### 推送通知

**订阅推送通知**

```js
navigator.serviceWorker.ready.then((registration) => {
  registration.pushManager
    .subscribe({
      userVisibleOnly: true, // 只在用户可见时显示通知
    })
    .then((subscription) => {
      // 发送订阅信息到服务器
      sendSubscriptionToServer(subscription);
    })
    .catch((error) => {
      console.error("Failed to subscribe:", error);
    });
});
```

**收和处理推送消息**

```js
self.addEventListener("push", (event) => {
  if (event.data) {
    const notificationData = event.data.json();
    event.waitUntil(
      self.registration.showNotification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        // 其他配置
      })
    );
  }
});
```

#### Service Worker 的生命周期

- 安装阶段 (Install)
- 激活阶段 (Activate)
- 运行阶段 (Active)
- 卸载阶段 (Uninstall)
- Service Worker 更新 更新是自动的，当 Service Worker 脚本改变时，浏览器会下载新版本并按照生命周期重新安装和激活
