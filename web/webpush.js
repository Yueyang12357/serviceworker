const webpush = require("web-push");

// 生成服务器公钥
const vapidKeys = webpush.generateVAPIDKeys();

console.log(vapidKeys);

// {
//     publicKey: 'BDNofQmRYyHU9MQWpgib4rDnN8SVKE_hp6gyb7RZlYBFtz2Mi-I3QQ8emDgO4bvnoxEz1JEda08rdmp2P0NuMNE',
//     privateKey: 'xCMCi_15SEp5GENil-tcK9zCjhFjN7aEiQJSnuMz5dw'
//   }
