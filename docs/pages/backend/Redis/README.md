---
sideBar: false
---

## Redis 使用笔记

‌Redis 有数据持久化功能 ‌。Redis 支持两种主要的数据持久化方式：RDB（Redis Database Snapshot）和 AOF（Append Only File），

### 常用指令

#### SET 和 GET 设置获取字符串值

```bash
SET name "redis.net.cn"
GET name // 输出 redis.net.cn
```

#### HMSET, HGETALL 设置 hash 的键值对集合

#### SET 和 GET 设置获取字符串值

```bash
HMSET user:1 username redis.net.cn password redis.net.cn points 200
HGETALL user:1
1) "username"
2) "redis.net.cn"
3) "password"
4) "redis.net.cn"
5) "points"
6) "200"
```

#### sadd、smembers 命令 设置 Set 是 string 类型的无序集合

集合内元素的唯一性，第二次插入的元素将被忽略

```bash
sadd redis.net.cn redis
sadd redis.net.cn mongodb
sadd redis.net.cn rabi
sadd redis.net.cn rabi
smembers redis.net.cn
1) "rabi"
2) "mongodb"
3) "redis"
```

#### zadd 设置 set， ZRANGEBYSCORE 范围获取值,

set 是 string 类型元素的集合不允许重复的成员

```bash
zadd redis.net.cn 0 redis
zadd redis.net.cn 0 mongodb
zadd redis.net.cn 0 rabi
zadd redis.net.cn 0 rabi
ZRANGEBYSCORE redis.net.cn 0 1000

1) "redis"
2) "mongodb"
3) "rabi"
```

[redis 实战](https://juejin.cn/post/7225139862223405114?searchId=20240807141838EE5FF94EE3B720C9ED47)

[redis 入门知识第 1 篇-redis 特性介绍](https://juejin.cn/post/7040839039284412452)
[redis 入门知识第 2 篇-redis 的安装与测试](https://juejin.cn/post/7041224816988749832)
[redis 入门知识第 3 篇-redis 的基本操作与数据类型](https://juejin.cn/post/7041594921496608805)
[redis 入门知识第 4 篇-string 基本的数据存取操作](https://juejin.cn/post/7042333629443211277)
[redis 入门知识第 5 篇-hash 数据类型与基本操作](https://juejin.cn/post/7042699068740468744)
[redis 入门知识第 6 篇-list 数据类型与基本操作](https://juejin.cn/post/7043082655638192142)
[redis 入门知识第 7 篇-set 数据类型的基本操作](https://juejin.cn/post/7044865580343492615)
[redis 中文官网](https://www.redis.net.cn/tutorial/3514.html)
