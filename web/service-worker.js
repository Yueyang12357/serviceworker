console.log("init service worker");

self.addEventListener("install", (event) => {
  console.log("安装install", event);
  event.waitUntil(
    caches.open("demo-cache").then((cache) => {
      return cache.addAll(["/index.css", "/data.json", "/flower.JPG"]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("激活activate", event);
  event.waitUntil(
    caches.open("demo-cache").then(function (cache) {
      cache.keys().then(function (keys) {
        keys.forEach(function (key) {
          cache.delete(key);
        });
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("拦截fetch:", event.request);
  event.respondWith(
    caches.match(event.request).then((response) => {
      console.log("response", response);
      if (response) {
        console.log("命中缓存");
        return response;
      } else {
        console.log("未命中缓存");
        return fetch(event.request).then((res) => {
          console.log("fetch", res);
          if (
            !res ||
            !res.status !== 200 ||
            res.status === 304 ||
            request.method === "POST"
          ) {
            return res;
          }
          caches.open("demo-cache").then((cache) => {
            cache.put(event.request, res);
          });
        });
      }
    })
  );
});

self.addEventListener("message", (event) => {
  console.log("主线程传到service worker:", event);
  event.data.id++;
  setTimeout(() => {
    event.source.postMessage(event.data);
  }, 2000);
});

// 注册 push 事件
self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title);
});
