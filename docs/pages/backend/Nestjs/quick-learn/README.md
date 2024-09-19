---
home: false
sidebar: true
---

### 创建项目

```bash
npm i -g @nestjs/cli
# 全局安装脚手架
nest new 你的项目名称
nest new 你的项目名称 --strict
# 严格模式创建项目
```

### 目录结构

目录结构很简洁，现在只有一个根模块（App），后续会创建出很多各种模块 User/Order/... 等等，NestJS 可以说是通过"模块"来管理整个应用的。

- main.ts 入口文件，后续全局性的配置会在这里配置。
- app.controller.ts 定义接口的地方，前端请求过来，最先到达这里。
- app.module.ts 应用的根模块，后续会创建很多模块，都要在此进行管理
- app.service.ts 管理数据库的 CRUD 操作
- app.controller.spec.ts 单元测试。

### 创建完整的模块

```bash
nest generate module user
# 创建模块
nest g res modules/user
# 简写在 modules 文件夹下创建 user 模块 包含 module、service、controller
```

### 创建单独模块

```bash
nest g mo user
# 分开单独生成user.module文件
```

#### @Module()元数据如何组织模块

- providers 注册订单提供者模块，如：负责订单 CRUD 的服务；
- controllers 注册订单控制器模块，如：负责订单 CRUD 的路由处理；
- imports 注册与订单相关联的模块，如：与订单关联的用户查询服务；
- exports 导出订单提供者模块，如：用户查询需要订单提供者统计订单数量；

#### 模块再导出

一个模块仅负责将一系列相关联的模块通过`imports`导入，紧接着就通过`exports`全部导出的行为就是模块在导出，
利用模块再导出的能力，可以减少大量关联模块重复导入造成的负担.

```ts
@Module({
  imports: [DatabaseModule, RedisModule, MongoModule],
  exports: [DatabaseModule, RedisModule, MongoModule],
})
export class ConnectionModule {}
// 同时使用数据库连接、Redis连接、Mongo连接的情况下仅需要导 ConnectionModule 模块即可。
```

#### 全局模块

```ts
@Global()
@Module({
  imports: [DatabaseModule, RedisModule, MongoModule],
  exports: [DatabaseModule, RedisModule, MongoModule],
})
export class ConnectionModule {}
// 增加 @Global() 装饰器
```

### 创建控制器

```ts
@Get('detail/:id')
findById(@Param() param: { id: number }) {
  return `获取 ID 为 ${param.id} 的订单详情`;
}
```

#### 更多控制器装饰器

```ts
// @Header(key, value)：
// @Redirect('https://nestjs.com/', 301)
@Post()
@Header('Cache-Control', 'none')
@Redirect('https://nestjs.com/', 301)
create(@Body() createOrderDto: CreateOrderDto) {
  return this.ordersService.create(createOrderDto);
}
```

**参数获取**
<img :src="$withBase('./images/daily-blog/query-params.png')" class="show-in-center">

### 创建服务

```bash
nest generate service orders；
nest g s orders；
# 简写命令：
```

服务是典型的提供者，HTTP 请求在经过控制器处理后应该将复杂的任务交由服务层进行处理, 提供者生命周期同应用的生命周期.

```ts
import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrdersService {
  create(createOrderDto: CreateOrderDto) {
    return "This action adds a new order";
  }
  findAll() {
    return `This action returns all orders`;
  }
  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
```

#### Service 通过构造函数注入 Controller

将 OrdersService 通过构造函数注入到 OrdersController 控制器，这样就得到了初始化后的 ordersService 成员，  
接着就可以在不同的处理函数调用服务中提供的能力

```ts
import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(+id);
  }
}
// 除构造函数注入的这种方式外，还可以通过属性注入
// @Inject()
// private readonly ordersService: OrdersService;
```

### 创建中间件

```bash
nest generate middleware <middleware-name>
nest g mi <middleware-name>
简写命令：
```

中间件是一个使用@Injectable()装饰器注释且实现 NestMiddleware 接口的类

```ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const start = process.hrtime();
    res.on("finish", () => {
      const diff = process.hrtime(start);
      const time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
      console.log(`${req.method} ${req.url} - ${time}ms`);
    });
    next();
  }
}
```

#### 注册中间件

需要在消费中间件的模块通过继承 NestModule 并实现 configure 接口

```ts
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { LoggerMiddleware } from "src/logger/logger.middleware";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("orders");
  }
}
// forRoutes()支持多种形式的参数来表示生效的范围，如：单字符串、多个字符串、RouteInfo对象、单个控制器类或多个控制器类
```

#### 范围控制

MiddlewareConsumer 提供了 exclude 函数来按规则排除一些不应用中间件的路由,

```ts
// 基于具体路由配置及模式匹配的排除方案
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: "orders", method: RequestMethod.GET },
    { path: "orders", method: RequestMethod.POST },
    "orders/(.*)"
  )
  .forRoutes("orders");
```

MiddlewareConsumer 提供的 forRoutes 支持下面这种模式匹配

```ts
forRoutes({ path: "ab*cd", method: RequestMethod.ALL });
```

#### 中间件串联

当一个中间件处理完成后，如果请求还没有结束将有 next()函数将控制权向下传递。  
如下面这个示例：为了允许客户端发起跨域访问，在 Cors 中间件中为每一个请求添加特殊的请求头后再交由 Logger 中间件继续执行。

```ts
// CorsMiddleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    res.header("Access-Control-Allow-Origin", "*"); // 允许所有来源
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization"); // 允许指定的请求头
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // 允许指定的请求方法
    next();
  }
}
```

```ts
export class OrdersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, LoggerMiddleware).forRoutes("orders");
  }
}
```

#### 全局中间件

全局注册 类中间件，可以在根模块 AppModule 中注册，使用通配符的形式表示 forRoutes('\*')

```ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, LoggerMiddleware).forRoutes("*");
  }
}
```

如果需要全局注册 功能类中间件 ，那么就可以在创建 app 实例后，通过 app.use('') 函数注册

```ts
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

### 配置守卫

守卫依据服务运行期间的权限、角色及访问控制列表等条件来确定客户端的访问是否交由路由处理程序处理。

#### 创建守卫

```bash
nest generate guard <guard-name>
nest g gu <guard-name>
# 简写命令
```

守卫也是一个使用@Injectable()装饰器注释的类，它需要实现 CanActivate 接口：

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```

#### 角色守卫

使用 Reflector 创建一个用来分配角色的装饰器，然后在对应的路由处理函数上添加这个装饰器并分配权限；

```ts
import { Reflector } from "@nestjs/core";

export const Roles = Reflector.createDecorator<string[]>();
```

```ts
@Roles(['admin'])
@Post()
create(@Body() createOrderDto: CreateOrderDto) {
  return this.ordersService.create(createOrderDto);
}
```

RolesGuard 中通过 执行上下文类 获取被调用处理函数的引用，并注入 Reflector 来提取处理函数被分配的角色

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roles } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const handler = context.getHandler();
    const roles = this.reflector.get<string[]>(Roles, handler);
    console.log(roles); // output ['admin']
    return true;
  }
}
```

**案例**
客户端协商通过 Header 中添加 role 属性来传递角色信息，那么在 RolesGuard 中可以通过执行上下文获取 Request 对象中的请求头数据，  
最后对比角色列表，并返回是否包含角色的结果

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roles } from "./roles.decorator";
import { Request } from "express";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const handler = context.getHandler();
    const roles = this.reflector.get<string[]>(Roles, handler);
    const request: Request = context.switchToHttp().getRequest();
    const role = request.headers["role"] || "";
    return roles.includes(role as string);
  }
}
```

#### 绑定守卫

**控制器范围绑定**

```ts
@Controller("orders")
@UseGuards(RolesGuard)
export class OrdersController {}
// or
@Controller("orders")
@UseGuards(new RolesGuard())
export class OrdersController {}
```

**全局范围绑定**

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
// or
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

### 配置环境变量

```bash
npm install @nestjs/config cross-env -D
```

```ts
// utils/env.ts 文件中配置：
export const DEV = process.env.NODE_ENV === "development";
export const PROD = process.env.NODE_ENV === "production";

const envFilePath = [".env"];
if (DEV) {
  envFilePath.unshift(".env.dev");
} else {
  envFilePath.unshift(".env.prod");
}
export default { envFilePath, DEV, PROD };
```

```ts
// 在 app.module.ts 文件中配置：
import { ConfigModule } from "@nestjs/config";
import env from "@/utils/env";

@Module({
  imports: [
    // 配置环境变量
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: env.envFilePath,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```json
// 配置 NODE_ENV
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development nest start --watch",
    "build": "cross-env NODE_ENV=production nest build"
  }
}
```

再创建三个配置文件。
.env 文件、 .env.dev 文件、.env.prod 文件

```ts
// 项目中就可以获取配置的环境变量了。
console.log("环境变量", process.env.NODE_ENV);
console.log("环境变量", process.env.NAME);
```

### 配置 session

**安装 express-session**

```bash
npm install express-session -S
```

**main.ts 文件中配置**

```ts
// main.ts：
import { NestFactory } from "@nestjs/core";
import * as session from "express-session";
import { PROD } from "@/utils/env";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // session
  app.use(
    session({
      name: "connect.sid", // 设置cookie中存储sessionId的key，默认为connect.sid，在浏览器控制台的 Application-Cookies-Name 能看到这个名称
      secret: "密钥", // 必填，最好存在比较安全的地方，比如环境变量
      resave: false, // 是否强制保存会话，即使未被修改也要保存。默认为true
      cookie: {
        maxAge: 10000, // Cookie的过期时间(毫秒)
        httpOnly: true, // 是否只以http(s)的形式发送cookie，对客户端js不可用（默认为true，也就是客户端不能以document.cookie查看cookie）
        secure: PROD, // 仅在生产环境下开启，增加安全性
      },
    })
  );
  await app.listen(3001);
}
bootstrap();
```

**具体使用**

```ts
@Get('/test')
getHello(@Req() req): string {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  console.log('req.session.count', req.session.count);
  return req.session.count;
}
```

**持久化 session**
经常会持久化 session，所以一般会将它存在数据库或者 Redis 上，这其实也能很简单就配置完成。

```bash
npm install connect-redis redis
```

```ts
// main.ts 配置
import { NestFactory } from "@nestjs/core";
import * as redis from "redis";
import * as connectRedis from "connect-redis";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // session
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      // ...
    })
  );
  await app.listen(3001);
}
bootstrap();
```

### 拦截器

通过拦截器可以扩展下面这些能力：

- 在方法执行之前/之后绑定额外的逻辑
- 转换函数返回的结果
- 转换函数抛出的异常
- 扩展基本功能行为
- 根据特定条件完全覆盖函数（例如，缓存）

#### 绑定拦截器

控制器范围绑定

```ts
@UseInterceptors(TimerInterceptor)
export class OrdersController {}
// or
@UseInterceptors(new TimerInterceptor())
export class OrdersController {}
```

全局范围绑定

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new TimerInterceptor());
// or
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimerInterceptor,
    },
  ],
})
export class AppModule {}
```

### 配置全局响应格式拦截器

后端接口会返回具有统一格式的响应数据。这种做法不仅便于前端开发人员进行操作，还能够保持接口返回数据的规范性和一致性。

**命令行创建拦截器**

```bash
nest generate interceptor <interceptor-name>
nest g itc <interceptor-name>
# 简写命令
```

**创建 utils/response.ts 文件**

```ts
import { Injectable, NestInterceptor, CallHandler } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Reflector } from "@nestjs/core";

interface Data<T> {
  data: T;
}

/** @name 通过拦截器统一响应格式 **/
@Injectable()
export class ResponseSuccess<T = any> implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context, next: CallHandler): Observable<Data<T>> {
    return next.handle().pipe(
      map((response) => {
        // 在具体业务中也可以自行定制code
        if (response.code) {
          const { code, data, message } = response;
          return {
            data,
            code,
            message,
            success: true,
          };
        } else {
          const { data, message } = response;
          return {
            data: message ? data : response,
            code: 0,
            message: message || "success",
            success: true,
          };
        }
      })
    );
  }
}
```

**配置 main.ts**

```ts
import { Reflector, NestFactory } from "@nestjs/core";
import { ResponseSuccess } from "./utils/response";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 响应格式拦截器
  app.useGlobalInterceptors(new ResponseSuccess(new Reflector()));
  await app.listen(3001);
}
bootstrap();
```

```json
// 配置成功后 接口返回格式
{
  code: number,
  message: string,
  success: boolean,
  data: any,
}
```

### 配置全局异常拦截器

还是在 utils/response.ts 文件

```ts
// utils/response.ts
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";

/** @name 通过异常过滤器统一异常格式 **/
@Catch()
export class ResponseFail implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    // 创建一个日志
    const logger = new Logger();
    // 在后台输出日志
    logger.error(exception);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    if (exception instanceof HttpException) {
      // 正常抛出错误
      status = exception.getStatus();
      if (exception.message) {
        message = exception.message;
      }
    }
    response.status(status).json({
      status,
      message,
      success: false,
      path: request.url,
      timestamp: new Date().getTime(),
    });
  }
}
```

**main.ts 配置**

```ts
// main.ts配置
import { ResponseSuccess, ResponseFail } from "./utils/response";
import { Reflector, NestFactory } from "@nestjs/core";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 异常过滤器
  app.useGlobalFilters(new ResponseFail());
  await app.listen(3001);
}
bootstrap();
```

```json
// 配置成功后 接口返回格式
{
    status: number,
    message: string,
    success: boolean,
    path: request.url,
    timestamp: number
}
```

### 配置元数据

元数据是一种在运行时用于存储和检索额外信息的数据结构，它可以帮助 Nest 框架执行各种操作，比如`依赖注入`、`参数解析`、`中间件执行`、`路由处理`等。

**创建 utils/metadata.ts 文件**

```ts
import { SetMetadata } from "@nestjs/common";

export const SKIP_RS_INTERCEPTOR = "skip_response_success_interceptor";
/**
 * @name 跳过全局成功响应格式拦截器
 * @description 通过Metadata添加自定义的元数据、Reflector检索和解析元数据
 */
export const SkipResponseSuccessInterceptor = () => SetMetadata(SKIP_RS_INTERCEPTOR, true);
```

```ts
// modules/user/user.controller.ts文件中使用
import { SkipResponseSuccessInterceptor } from "@/utils/metadata";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** @name 验证码 **/
  @Get("captcha")
  // 跳过响应格式化
  @SkipResponseSuccessInterceptor()
  captcha() {
    return "abcd";
  }
}
// 增加了一个http://localhost:3001/user/captcha 验证码接口，并且多了一个 @SkipResponseSuccessInterceptor() 的装饰器
```

```ts
// utils/response.ts
/** @name 通过拦截器统一响应格式 **/
@Injectable()
export class ResponseSuccess<T = any> implements NestInterceptor {
  intercept(context, next: CallHandler): Observable<Data<T>> {
    // 获取Metadata自定义元数据
    const skipInterceptor = this.reflector.get<boolean>(SKIP_RS_INTERCEPTOR, context.getHandler());
    if (skipInterceptor) {
      // 特殊的请求直接跳过拦截器
      return next.handle();
    }
  }
}
```

为了看到完整效果 安装了 svg-captcha 包 然后在 controller 中使用

> npm install svg-captcha

```ts
// modules/user/user.controller.ts
import * as svgCaptcha from "svg-captcha";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  /** @name 验证码 **/
  @Get("captcha")
  // 跳过响应格式化
  @SkipResponseSuccessInterceptor()
  captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 60,
      ignoreChars: "0o1i",
      color: true,
    });
    // session上面咱们可讲过了哦，别忘了
    req.session.captcha = captcha.text;
    res.type("image/svg+xml");
    res.send(captcha.data);
  }
}
```

访问
`http://localhost:3001/user/captcha` 验证码接口，  
会得一个 SVG 验证码图片数据，就不会是我们接口响应的统一格式的数据了。
<img :src="$withBase('./images/daily-blog/nest-captcha.png')" class="show-in-center">

### 配置 JWT 策略

<img :src="$withBase('./images/daily-blog/session-jwt.png')" class="show-in-center">

**安装依赖**

```bash
npm install @nestjs/jwt passport-jwt @nestjs/passport
```

创建 utils/jwt/jwt.strategy.ts 文件

```ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private configService: ConfigService) {
    // 校验前端传递的token
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //校验逻辑token 已封装
      ignoreExpiration: false,
      secretOrKey: "密钥....",
    });
  }
  async validate(payload: any) {
    // token验证成功后, 会从token里面解析出用户信息, return的信息会被赋值到express的request对象上, 并且属性固定为user
    return { id: payload.id, username: payload.username };
  }
}
```

创建 utils/jwt/jwt.guard.ts 文件

```ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { SKIP_PUBLIC_TOKEN_GUARD } from "@/utils/metadata";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }
  /**
   * @name: 该守护用于验证token
   * @description: 每个守护必须实现该方法，返回一个布尔值，是否允许当前请求。https://nest.nodejs.cn/guards
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 校验是否是公共路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(SKIP_PUBLIC_TOKEN_GUARD, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 公共路由直接跳过
    if (isPublic) return true;
    // 校验token
    return super.canActivate(context);
  }
  /**
   * @name: super.canActivate(context)验完成后调用
   * @description: 验完成后调用
   * @param {*} error 这是 Passport 策略执行过程中发生的任何潜在错误。如果在验证过程中没有错误发生，这个值通常是 null
   * @param {*} user 这是 Passport 策略验证成功后返回的用户对象。如果验证失败，这个值可能是 false 或 null，具体取决于你使用的 Passport 策略
   * @param {*} info 如果验证失败，info通常是一个error对象
   */
  handleRequest(error, user, info) {
    if (info || error) throw new UnauthorizedException("token校验失败，token已经过期");
    if (!user) throw new NotFoundException("用户不存在");
    return user;
  }
}
```

utils/metadata.ts 文件中进行元数据配置

```ts
// metadata.ts  所有元数据可以保存在一个文件里
import { SetMetadata } from "@nestjs/common";
export const SKIP_PUBLIC_TOKEN_GUARD = "skip_public_token_guard";

/**
 * @name 跳过全局Jwt守护
 */
export const SkipPublicTokenGuard = () => SetMetadata(SKIP_PUBLIC_TOKEN_GUARD, true);
```

```ts
// app.module.ts 使用Jwt
import { APP_GUARD } from "@nestjs/core";
// JWT
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "@/utils/jwt/jwt.strategy";
import { JwtAuthGuard } from "@/utils/jwt/jwt.guard";

@Module({
  imports: [
    // 注册Jwt
    JwtModule.register({
      global: true,
      secret: config.token.secret,
      signOptions: { expiresIn: config.token.expiresIn },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局注入Jwt策略
    JwtStrategy,
    // 全局注册jwt验证守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

现在访问接口已经无法正常访问了，因为需要验证 token  
而要想正常访问接口，只能有两种形式，

- 其一，携带正确的 Token 进行访问，
- 其二，特殊的接口可以通过上面定义的 @SkipPublicTokenGuard() 装饰器跳过 Token 的验证。

**看看正常 Token 进行访问的流程**
modules/user/user.controller.ts

```ts
// modules/user/user.controller.ts
import { SkipResponseSuccessInterceptor, SkipPublicTokenGuard } from "@/utils/metadata";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** @name 验证码 **/
  @Get("captcha")
  // 跳过token验证
  @SkipPublicTokenGuard()
  // 跳过响应格式化
  @SkipResponseSuccessInterceptor()
  captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 60,
      ignoreChars: "0o1i",
      color: true,
    });
    // session上面咱们可讲过了哦，别忘了
    req.session.captcha = captcha.text;
    res.type("image/svg+xml");
    res.send(captcha.data);
  }
}
```

配置后，再去访问验证码接口就应该是能正确看到验证码图片返回了。
定义登陆接口

```ts
// modules/user/user.controller.ts
import { JwtService } from "@nestjs/jwt";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    // 注入JWT
    private readonly jwtService: JwtService
  ) {}

  /** @name PC登录 **/
  @Post("login")
  // 跳过token验证
  @SkipPublicTokenGuard()
  async login(@Req() req) {
    // 生成token
    const token = this.jwtService.sign({
      id: 1,
      username: "橙某人",
    });
    // 存储session
    req.session.token = token;
    // 返回token给前端
    return token;
  }
}
```

**前端代码**

```ts
// 前端部分代码
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

为什么前端需要在 Token 前面增加一个 Bearer 单词呢 [详解](https://www.jianshu.com/p/61d592ae33ee)
type 的作用，就是告诉服务器如何去认证访问者的身份。如果服务器事先就已经知道了认证方式，那么有无 Bearer 都不影响认证结果

### 连接数据库

**安装依赖**

```ts
npm install @nestjs/typeorm typeorm mysql2 -S
```

**app.module.ts 配置数据库链接**

```ts
// app.module.ts
@Module({
  imports: [
    // 配置数据库连接
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "127.0.0.1",
      port: 3306,
      username: "root",
      password: "123456",
      database: "test", // 数据库名
      // 自动加载所有的实体类
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      // 同步实体类与数据库信息, 这个操作很危险，可能把数据给干没了
      synchronize: false,
    }),
  ],
})
export class AppModule {}
```

注意 `synchronize` 属性，它用于同步实体类与数据库信息，官网与网上很多都介绍说可以在开发环境开启这个选项，在生产环境再关闭。  
你可以去这么做，但是，最好在你足够了解实体类与数据库关系的基础下再去开启这个选项；否则，还是建议你关闭这个选项，老老实实写实体类.  
**user.module.ts 文件中将实体类导入**

```ts
// modules/user/user.module.ts
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
// 实例类
import { User } from "./entities/user.entity";

@Module({
  // 将orm与表关联起来
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

::: tips
"实体类" 是数据库的表在 Nest 中的描述  
:::

**编写实体类**

```ts
// modules/user/entity/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from "typeorm";

// 关联y_user表
@Entity({ name: "y_user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
}
```

### 管道的使用

管道有两个典型的应用场景，

- 其一是转换(将输入数据转换为所需要的形式，如，将字符串转为数字类型)，
- 其二是校验(校验传入数据是否有效，无效时将抛出异常)数据是否有效。  
  因此管道将运行在路由处理函数的 arguments 上。
  NestJs 提供了 9 个开箱即用的内置管道
  `(ValidationPipe，ParseIntPipe，ParseFloatPipe，ParseBoolPipe，ParseArrayPipe，ParseUUIDPipe，ParseEnumPipe，DefaultValuePipe，ParseFilePipe)`
  接着就尝试绑定 ParseIntPipe 到 findOne 处理函数 函数

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  console.log(typeof id); // number
  return this.ordersService.findOne(id);
}
```

#### 基于 schema 的验证

zod 是用来定义 schema 和 进行验证的模块，基于管道可以很好的时间路由处理函数参数的验证

1. 安装 zod：npm install --save zod ；
2. 创建管道：nest generate pipe zod-validation or nest g pi zod-validation；
3. 完善管道：利用注入的 ZodObject 解析参数数据格式；

```ts
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodObject } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }
}
```

**定义 schema**

```ts
import { z } from "zod";

export const createOrderSchema = z
  .object({
    orderId: z.string(),
    orderNo: z.string(),
    orderName: z.string(),
    orderStatus: z.string(),
    orderAmount: z.number(),
    createTime: z.date(),
    updateTime: z.date(),
  })
  .required();

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
```

**绑定管道**

```ts
@Post()
@UsePipes(new ZodValidationPipe(createOrderSchema))
create(@Body() createOrderDto: CreateOrderDto) {
  return this.ordersService.create(createOrderDto);
}
```

### 基于 class 的验证

在 NestJS 中可以使用 class-validator 模块实现基于类和装饰器的形式进行参数验证。

- 安装 class-validator：npm i --save class-validator class-transformer ;
- 创建管道：nest generate pipe validation or nest g pi validation；
- 完善管道：利用 metatype 提供的参数元类型验证参数；

```ts
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }
  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Number, Date];
    return !types.includes(metatype);
  }
}
```

**绑定管道**

```ts
@Post()
create(@Body(new ValidationPipe()) createOrderDto: CreateOrderDto) {
  return this.ordersService.create(createOrderDto);
}
```

**全局绑定管道**

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe());
// or
@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```

### 接口文档

Swagger 是一个开源的 API 生态系统，用于构建、文档化和使用 RESTful Web 服务。它包括一个广泛的工具集合，用于设计、构建、文档化和测试 API。
Swagger 的主要组件包括：
**Swagger Specification** : 这是一个描述 REST API 的格式的规范。它允许你指定 API 的结构，包括端点、方法、参数、请求和响应的类型等。
**Swagger Editor**: 这是一个在线工具，允许你编写和测试 OpenAPI 规范。
**Swagger UI**: 这是一个自动生成的 API 文档和沙箱的工具。它允许用户通过网页界面与 API 进行交互。
**Swagger Codegen**: 这是一个可以根据 OpenAPI 规范生成客户端代码的工具。

安装依赖

```bash
npm install @nestjs/swagger -S
```

main.ts 文件中配置

```ts
// main.ts 文件中配置
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 接口文档
  const docConfig = new DocumentBuilder()
    .setTitle("我的接口文档")
    .setDescription("宾至如归，友情长存。")
    .setVersion(config.version)
    .addTag("hotel")
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup("doc", app, document);
  await app.listen(config.post);
}
bootstrap();
```

重启项目，直接访问 `http://localhost:3000/doc` 就能看到咱们的文档

### 配置跨域

main.ts 文件中配置

```ts
// main.ts 文件中
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 允许跨域
  app.enableCors();
  await app.listen(config.post);
}
bootstrap();
```

[参考文献](https://nest.nodejs.cn/security/cors)
[快速入门](https://juejin.cn/post/7307889500546072595#heading-42)
