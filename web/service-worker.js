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

// 离线优先Cache First
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
    // 综合策略-更新后使用
    // caches.open("demo-cache").then((cache) => {
    //   return cache.match(event.request).then((response) => {
    //     const fetchPromise = fetch(event.request).then((networkResponse) => {
    //       cache.put(event.request, networkResponse.clone());
    //       return networkResponse;
    //     });
    //     return response || fetchPromise;
    //   });
    // })
  );
});

self.addEventListener("message", (event) => {
  console.log("主线程传到service worker:", event);
  event.data.id++;
  setTimeout(() => {
    event.source.postMessage(event.data);
  }, 2000);
});

// 监听 sync 事件
self.addEventListener("sync", (event) => {
  console.log("sync", event);
  if (event.tag === "sync") {
    event.waitUntil(
      // 同步数据
      syncData()
    );
  }
});

// 注册 push 事件，监听并推送消息
self.addEventListener("push", (event) => {
  const data = event.data.json();
  // 7. `ServiceWorker`通过`showNotification`方法，显示消息
  self.registration.showNotification(data.title);
});

// 离线推送
self.addEventListener("notificationcallback", (event) => {
  const data = event.data.json();
  // 7. `ServiceWorker`通过`showNotification`方法，显示消息
  self.registration.showNotification(data.title);
});

const syncData = () => {
  fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("update-caches");
      // 更新缓存
      caches.open("demo-cache").then((cache) => {
        cache.put("/data.json", new Response(JSON.stringify(data)));
      });
    });
};
