---
home: false
sidebar: false
---

### 同时批量启动多个应用程序
``` bash
start "" "D:\Program Files (x86)\DingDing\DingtalkLauncher.exe"
start "" "D:\Program Files\Tencent\WeChat\WeChat.exe"
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe"
start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
start "" "C:\Program Files\Mozilla Firefox\firefox.exe"

```

### nginx自动执行脚本
``` bash
cls 
@ECHO OFF 
SET NGINX_PATH=C:
SET NGINX_DIR=C:\nginx-1.18.0\

TITLE Nginx 批处理
GOTO OPTION 
:OPTION 
CLS 
ECHO. 
ECHO. * * * *  Nginx 批处理管理程序 * * * * * 
ECHO. * * 
ECHO. * 1 启动Nginx * 
ECHO. * * 
ECHO. * 2 关闭Nginx * 
ECHO. * * 
ECHO. * 3 重启Nginx * 
ECHO. * * 
ECHO. * 4 退出命令行黑窗口* 
ECHO. * * 
ECHO. * * * * * * * * * * * * * * * * * * * 
ECHO. 
ECHO.请输入选择项目的序号： 
set /p ID= 
IF "%id%"=="1" GOTO cmd1 
IF "%id%"=="2" GOTO cmd2 
IF "%id%"=="3" GOTO cmd3 
IF "%id%"=="4" EXIT 
PAUSE 
:cmd1 
ECHO. 
ECHO.启动Nginx...... 
IF NOT EXIST %NGINX_DIR%nginx.exe ECHO %NGINX_DIR%nginx.exe不存在 
%NGINX_PATH% 
cd %NGINX_DIR% 
IF EXIST %NGINX_DIR%nginx.exe start %NGINX_DIR%nginx.exe 
ECHO.OK 
PAUSE 
GOTO OPTION 
:cmd2 
ECHO. 
ECHO.关闭Nginx...... 
taskkill /F /IM nginx.exe > nul 
ECHO.OK 
PAUSE 
GOTO OPTION 
:cmd3 
ECHO. 
ECHO.关闭Nginx...... 
taskkill /F /IM nginx.exe > nul 
ECHO.OK 
GOTO cmd1 
GOTO OPTION

```
