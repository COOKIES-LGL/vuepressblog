---
home: false
sidebar: true
---

## NestJs 使用笔记

### 创建项目
``` bash
npm i -g @nestjs/cli

nest new 你的项目名称
```
### 目录结构

目录结构很简洁，现在只有一个根模块（App），后续会创建出很多各种模块 User/Order/... 等等，NestJS 可以说是通过"模块"来管理整个应用的。

- main.ts入口文件，后续全局性的配置会在这里配置。
- app.controller.ts定义接口的地方，前端请求过来，最先到达这里。
- app.module.ts应用的根模块，后续会创建很多模块，都要在此进行管理
- app.service.ts管理数据库的 CRUD 操作
- app.controller.spec.ts单元测试。

### 创建模块
``` bash
nest g res modules/user 
# 在 modules 文件夹下创建 user 模块
```

### 配置环境变量
``` bash
npm install @nestjs/config cross-env -D
```
``` ts
// utils/env.ts 文件中配置：
export const DEV = process.env.NODE_ENV === 'development';
export const PROD = process.env.NODE_ENV === 'production';

const envFilePath = ['.env'];
if (DEV) {
  envFilePath.unshift('.env.dev');
} else {
  envFilePath.unshift('.env.prod');
}
export default { envFilePath, DEV, PROD };
```
``` ts
// 在 app.module.ts 文件中配置：
import { ConfigModule } from '@nestjs/config';
import env from '@/utils/env';

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
``` json
// 配置 NODE_ENV
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development nest start --watch",
    "build": "cross-env NODE_ENV=production nest build",
  }
}
```
再创建三个配置文件。
.env 文件、 .env.dev 文件、.env.prod 文件
``` ts
// 项目中就可以获取配置的环境变量了。
console.log('环境变量', process.env.NODE_ENV);
console.log('环境变量', process.env.NAME);
```

### 配置session

**安装express-session**
``` bash
npm install express-session -S
```

**main.ts 文件中配置**

```ts
// main.ts：
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { PROD } from '@/utils/env';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // session
  app.use(
    session({
      name: 'connect.sid', // 设置cookie中存储sessionId的key，默认为connect.sid，在浏览器控制台的 Application-Cookies-Name 能看到这个名称
      secret: '密钥', // 必填，最好存在比较安全的地方，比如环境变量
      resave: false, // 是否强制保存会话，即使未被修改也要保存。默认为true
      cookie: {
        maxAge: 10000, // Cookie的过期时间(毫秒) 
        httpOnly: true, // 是否只以http(s)的形式发送cookie，对客户端js不可用（默认为true，也就是客户端不能以document.cookie查看cookie）
        secure: PROD, // 仅在生产环境下开启，增加安全性
      }
    }),
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
``` bash
npm install connect-redis redis
```
``` ts
// main.ts 配置
import { NestFactory } from '@nestjs/core';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // session
  const RedisStore = connectRedis(session); 
  const redisClient = redis.createClient();
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      // ...
    }),
  );
  await app.listen(3001);
}
bootstrap();
```

### 配置全局响应格式拦截器
后端接口会返回具有统一格式的响应数据。这种做法不仅便于前端开发人员进行操作，还能够保持接口返回数据的规范性和一致性。
**创建 utils/response.ts 文件**
``` ts
import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Reflector } from '@nestjs/core';

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
            message: message || 'success',
            success: true,
          };
        }
      }),
    );
  }
}
```
**配置main.ts**
``` ts
import { Reflector, NestFactory } from '@nestjs/core';
import { ResponseSuccess } from './utils/response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 响应格式拦截器
  app.useGlobalInterceptors(new ResponseSuccess(new Reflector()));
  await app.listen(3001);
}
bootstrap();
```
``` json
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
``` ts
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
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';

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
    let message = 'Internal server error';
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
**main.ts配置**
``` ts
// main.ts配置
import { ResponseSuccess, ResponseFail } from './utils/response';
import { Reflector, NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 异常过滤器
  app.useGlobalFilters(new ResponseFail());
  await app.listen(3001);
}
bootstrap();
```
``` json
// 配置成功后 接口返回格式
{
    status: number,
    message: string,
    success: boolean,
    path: request.url,
    timestamp: number
}
```

### 元数据配置
元数据是一种在运行时用于存储和检索额外信息的数据结构，它可以帮助 Nest 框架执行各种操作，比如`依赖注入`、`参数解析`、`中间件执行`、`路由处理`等。

**创建 utils/metadata.ts 文件**
``` ts
import { SetMetadata } from '@nestjs/common';

export const SKIP_RS_INTERCEPTOR = 'skip_response_success_interceptor';
/**
 * @name 跳过全局成功响应格式拦截器
 * @description 通过Metadata添加自定义的元数据、Reflector检索和解析元数据
 */
export const SkipResponseSuccessInterceptor = () =>
  SetMetadata(SKIP_RS_INTERCEPTOR, true);
```
``` ts
// modules/user/user.controller.ts文件中使用
import { SkipResponseSuccessInterceptor } from '@/utils/metadata';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** @name 验证码 **/
  @Get('captcha')
  // 跳过响应格式化
  @SkipResponseSuccessInterceptor()
  captcha() {
    return 'abcd';
  }
}
// 增加了一个http://localhost:3001/user/captcha 验证码接口，并且多了一个 @SkipResponseSuccessInterceptor() 的装饰器
```
``` ts
// utils/response.ts
/** @name 通过拦截器统一响应格式 **/
@Injectable()
export class ResponseSuccess<T = any> implements NestInterceptor {
  intercept(context, next: CallHandler): Observable<Data<T>> {
    // 获取Metadata自定义元数据
    const skipInterceptor = this.reflector.get<boolean>(
      SKIP_RS_INTERCEPTOR,
      context.getHandler(),
    );
    if (skipInterceptor) {
      // 特殊的请求直接跳过拦截器
      return next.handle();
    }
  }
}
```
为了看到完整效果 安装了 svg-captcha 包 然后在controller中使用
> npm install svg-captcha

``` ts
// modules/user/user.controller.ts
import * as svgCaptcha from 'svg-captcha';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /** @name 验证码 **/
  @Get('captcha')
  // 跳过响应格式化
  @SkipResponseSuccessInterceptor()
  captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 60,
      ignoreChars: '0o1i',
      color: true,
    });
    // session上面咱们可讲过了哦，别忘了
    req.session.captcha = captcha.text;
    res.type('image/svg+xml');
    res.send(captcha.data);
  }
}
```
访问 
`http://localhost:3001/user/captcha` 验证码接口，  
会得一个SVG验证码图片数据，就不会是我们接口响应的统一格式的数据了。
<img :src="$withBase('./images/daily-blog/nest-captcha.png')" class="show-in-center">


### 配置JWT策略
<img :src="$withBase('./images/daily-blog/session-jwt.png')" class="show-in-center">

**安装依赖**
``` bash
npm install @nestjs/jwt passport-jwt @nestjs/passport
```
创建 utils/jwt/jwt.strategy.ts 文件
``` ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    // 校验前端传递的token
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //校验逻辑token 已封装
      ignoreExpiration: false,
      secretOrKey: '密钥....',
    });
  }
  async validate(payload: any) {
    // token验证成功后, 会从token里面解析出用户信息, return的信息会被赋值到express的request对象上, 并且属性固定为user
    return { id: payload.id, username: payload.username };
  }
}
```
创建 utils/jwt/jwt.guard.ts 文件
``` ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { SKIP_PUBLIC_TOKEN_GUARD } from '@/utils/metadata';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  /**
   * @name: 该守护用于验证token
   * @description: 每个守护必须实现该方法，返回一个布尔值，是否允许当前请求。https://nest.nodejs.cn/guards
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 校验是否是公共路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      SKIP_PUBLIC_TOKEN_GUARD,
      [context.getHandler(), context.getClass()],
    );
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
    if (info || error)
      throw new UnauthorizedException('token校验失败，token已经过期');
    if (!user) throw new NotFoundException('用户不存在');
    return user;
  }
}
```
utils/metadata.ts 文件中进行元数据配置
``` ts
// metadata.ts  所有元数据可以保存在一个文件里
import { SetMetadata } from '@nestjs/common';
export const SKIP_PUBLIC_TOKEN_GUARD = 'skip_public_token_guard';

/**
 * @name 跳过全局Jwt守护
 */
export const SkipPublicTokenGuard = () =>
  SetMetadata(SKIP_PUBLIC_TOKEN_GUARD, true);
```

``` ts
// app.module.ts 使用Jwt
import { APP_GUARD } from '@nestjs/core';
// JWT
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/utils/jwt/jwt.strategy';
import { JwtAuthGuard } from '@/utils/jwt/jwt.guard';

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
现在访问接口已经无法正常访问了，因为需要验证token
而要想正常访问接口，只能有两种形式，
- 其一，携带正确的 Token 进行访问，
- 其二，特殊的接口可以通过上面定义的 @SkipPublicTokenGuard() 装饰器跳过 Token 的验证。

**看看正常Token进行访问的流程**
modules/user/user.controller.ts
``` ts
// modules/user/user.controller.ts
import {
  SkipResponseSuccessInterceptor,
  SkipPublicTokenGuard,
} from '@/utils/metadata';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** @name 验证码 **/
  @Get('captcha')
  // 跳过token验证
  @SkipPublicTokenGuard()
  // 跳过响应格式化
  @SkipResponseSuccessInterceptor()
  captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 60,
      ignoreChars: '0o1i',
      color: true,
    });
    // session上面咱们可讲过了哦，别忘了
    req.session.captcha = captcha.text;
    res.type('image/svg+xml');
    res.send(captcha.data);
  }
}
```
配置后，再去访问验证码接口就应该是能正确看到验证码图片返回了。
定义登陆接口
``` ts
// modules/user/user.controller.ts
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    // 注入JWT
    private readonly jwtService: JwtService
   ) {}

  /** @name PC登录 **/
  @Post('login')
  // 跳过token验证
  @SkipPublicTokenGuard()
  async login(@Req() req) {
    // 生成token
    const token = this.jwtService.sign({
      id: 1,
      username: '橙某人',
    })
    // 存储session
    req.session.token = token;
    // 返回token给前端
    return token;
  }
}
```
**前端代码**
``` ts
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
type的作用，就是告诉服务器如何去认证访问者的身份。如果服务器事先就已经知道了认证方式，那么有无Bearer都不影响认证结果

### 链接数据库

**安装依赖**
``` ts
npm install @nestjs/typeorm typeorm mysql2 -S
```
**app.module.ts 配置数据库链接**
``` ts
// app.module.ts
@Module({
  imports: [
    // 配置数据库连接
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'test', // 数据库名
      // 自动加载所有的实体类
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // 同步实体类与数据库信息, 这个操作很危险，可能把数据给干没了
      synchronize: false,
    }),
  ],
})
export class AppModule {}
```
注意 `synchronize` 属性，它用于同步实体类与数据库信息，官网与网上很多都介绍说可以在开发环境开启这个选项，在生产环境再关闭。  
你可以去这么做，但是，最好在你足够了解实体类与数据库关系的基础下再去开启这个选项；否则，还是建议你关闭这个选项，老老实实写实体类.  
modules/user/user.module.ts 文件中将实体类导入
``` ts
// modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// 实例类
import { User } from './entities/user.entity';

@Module({
  // 将orm与表关联起来
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```
> "实体类" 是数据库的表在 Nest 中的描述
**编写实体类**
``` ts
// modules/user/entity/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';

// 关联y_user表
@Entity({ name: 'y_user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  username: string;
}
```

### 接口文档

安装依赖
``` bash
npm install @nestjs/swagger -S
```

main.ts 文件中配置
``` ts
// main.ts 文件中配置
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  // 接口文档
  const docConfig = new DocumentBuilder()
    .setTitle('我的接口文档')
    .setDescription('宾至如归，友情长存。')
    .setVersion(config.version)
    .addTag('hotel')
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('doc', app, document);
  await app.listen(config.post);
}
bootstrap();
```
重启项目，直接访问 `http://localhost:3000/doc` 就能看到咱们的文档

### 配置跨域

main.ts 文件中配置
``` ts
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
