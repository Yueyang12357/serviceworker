const express = require("express");
const fs = require("fs");
const webpush = require("web-push");

const vapidKeys = {
  publicKey:
    "BDNofQmRYyHU9MQWpgib4rDnN8SVKE_hp6gyb7RZlYBFtz2Mi-I3QQ8emDgO4bvnoxEz1JEda08rdmp2P0NuMNE",
  privateKey: "xCMCi_15SEp5GENil-tcK9zCjhFjN7aEiQJSnuMz5dw",
};

const app = express();
// 私钥跟证书
const httpsOption = {
  key: fs.readFileSync("./ssl/server.key"),
  cert: fs.readFileSync("./ssl/server.crt"),
};
// 创建https
const https = require("https").Server(httpsOption, app);

const port = 3000;

// 这个是需要在 google cloud platform 中创建的项目id
webpush.setGCMAPIKey("GCM API Key");

webpush.setVapidDetails(
  // 邮箱
  "yoshi12357@163.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.get("/push", (req, res) => {
  // 这里的 pushSubscription 就是上面注册成功后返回的 subscription 对象
  const pushSubscription = {
    endpoint:
      "https://fcm.googleapis.com/fcm/send/cSAH1Q7Fa6s:APA91bEgYeKNXMSO1rcGAOPzt3L9fMhyjL-zSPV5JfiKwgqtbx_Q4de_8plEY_QViLnhfe6-0fUgdo7Z3Gqpml3zIBSfO6IISDYdF9kzL2h_dbZ_FE_YKbKOG70gMG_A74xwK1vsocCv",
    keys: {
      p256dh:
        "BAqZaMLZn_rtYeR7WsBLqBWG7uMiOGRyCx2uhOqm0ZaJwDdQac-ubAyRRdLXJVZDOrNe-B3mCTy3g0vHCkeyYyo",
      auth: "fxDt8RtB92KHpQM7HetBUw",
    },
  };

  webpush.sendNotification(pushSubscription, "Hello world").then((result) => {
    res.send(result);
  });
});

app.get("/test", (req, res) => {
  res.send("<h1>你好啊，https</h1>");
});

https.listen(port, () => {
  console.log("https start!!", port);
});
