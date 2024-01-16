/**
 * npm install --save express qrcode-terminal
 * npm install --save wechaty
 * npm install --save express
 * node app.js
 * 
 * 请求接口
 * post http://localhost:3000/wechat/message
 * body:
 * {
    "message": "消息内容",
    "roomName": "群组名称"
    }
 */
const { WechatyBuilder } = require("wechaty");
const express = require("express");

const app = express();
app.use(express.json()); // 设置应用程序接收JSON格式的数据

const bot = WechatyBuilder.build();

//  二维码生成
function onScan(qrcode, status) {
  require("qrcode-terminal").generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    "https://wechaty.js.org/qrcode/",
    encodeURIComponent(qrcode),
  ].join("");
  console.log(qrcodeImageUrl);
}

// 登录
async function onLogin(user) {
  console.log(`贴心小助理${user}登录了`);
}

//登出
function onLogout(user) {
  console.log(`小助手${user} 已经登出`);
}

async function onMessage(message) {
  console.log(`Message: ${message}`);
}

const handleMessage = async (message, roomName) => {
  const room = await bot.Room.find({ topic: roomName });
  console.log(room);
  if (room) {
    // 发送消息到群中
    room.say(message);
  }
};

// 创建一个路由处理微信消息的API端点
app.post("/wechat/message", async (req, res) => {
  try {
    const ctx = req.body;
    console.log("收到微信消息", ctx);
    // 处理收到的消息
    const reply = await handleMessage(ctx.message, ctx.roomName);
    // 返回回复消息
    res.json({
      code: 200,
      msg: "success",
    });
  } catch (error) {
    res.json({
      code: 500,
      msg: JSON.stringify(error),
    });
  }
});

bot.on("scan", onScan);
bot.on("login", onLogin);
bot.on("logout", onLogout);
bot.on("message", onMessage);

// 启动Express服务器
app.listen(3000, () => {
  console.log("API服务器已启动，监听端口3000");
});

bot
  .start()
  .then(() => console.log("开始登陆微信"))
  .catch((e) => console.error(e));
