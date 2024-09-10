---
sideBar: false
---

## TypeORM 使用笔记

TypeORM 是一个用于 TypeScript 和 JavaScript 的对象关系映射器（ORM），它运行在 Node.js 平台上，支持多种类型的数据库。
TypeORM 的主要目标是提供一种简单的方式来与数据库进行交互，同时保持类型安全。

使用 TypeORM，您可以定义实体（类），这些实体将映射到数据库中的表。然后，您可以使用 TypeORM 提供的方法来执行 CRUD（创建、读取、更新、删除）操作。

```ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;
}
// 我们定义了一个名为 User 的实体，它有四个列：id、firstName、lastName 和 age
```
