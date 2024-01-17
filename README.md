# wechaty
### 需要nodejs版本 v18+
### 安装依赖
```
 npm install --save express wechaty
```
### 运行
```
node app.js
```
### 请求接口
```
 post http://localhost:3000/wechat/message
 body:
 {
    "message": "消息内容",
    "roomName": "群组名称"
}
```
