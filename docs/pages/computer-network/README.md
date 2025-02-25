---
home: false
sidebar: false
---

## 计算机网络日常笔记

### 技术文档列表

- [HTTPS](https://blog.poetries.top/browser-working-principle/guide/part6/lesson36.html#%E5%9C%A8-http-%E5%8D%8F%E8%AE%AE%E6%A0%88%E4%B8%AD%E5%BC%95%E5%85%A5%E5%AE%89%E5%85%A8%E5%B1%82) <span style="color:#bbb; float:right">2021-06-10</span>
- [HTTP2.0 协议](https://blog.poetries.top/browser-working-principle/guide/part6/lesson30.html) <span style="color:#bbb; float:right">2022-06-10</span>

- [计算机底层网络](https://www.cnblogs.com/slowlydance2me/p/16928574.html)

#### 日常知识点

#### request cache-control

request cache-control 是由客户端（通常是浏览器）在发送 HTTP 请求时设置的，用于指示服务器或中间缓存（如 CDN）如何处理该请求。它告诉缓存系统是否可以使用缓存来响应这个请求，或者是否需要直接从服务器获取资源。

例如，如果请求头中包含 Cache-Control: no-cache，这告诉所有缓存系统（包括浏览器缓存和代理服务器缓存）在返回资源之前，必须向原始服务器验证资源的有效性，即使资源在缓存中未过期。

#### response cache-control

response cache-control 是由服务器在响应客户端请求时设置的，用于指示客户端或中间缓存如何缓存该响应。它告诉缓存系统资源可以缓存多久，以及如何验证缓存的有效性。

例如，如果响应头中包含 Cache-Control: max-age=3600，这告诉客户端和中间缓存系统该资源可以缓存 3600 秒，在这段时间内，客户端可以直接从缓存中获取资源，而无需再次向服务器请求。

#### 关系

‌**相互影响** ‌：request cache-control 和 response cache-control 相互影响。客户端的请求缓存控制指令可以影响缓存系统是否使用缓存响应请求，而服务器的响应缓存控制指令则决定了资源在客户端和中间缓存系统中的缓存行为。  
**优先级** ：在某些情况下，客户端的请求缓存控制指令可能会覆盖服务器的响应缓存控制指令。例如，即使服务器指示资源可以缓存很长时间，但客户端的请求中包含了 Cache-Control: no-cache，那么缓存系统仍然会向服务器验证资源的有效性。
‌**共同决定缓存行为** ‌：request cache-control 和 response cache-control 共同决定了资源在客户端和中间缓存系统中的缓存行为。它们通过不同的指令和参数来精细控制缓存的有效期、验证机制等。

### MarkDown 使用指南

- [MarkDown](../blog-daily/use-markdown) <span style="color:#bbb; float:right">2021-06-24</span>
