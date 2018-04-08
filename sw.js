self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('d6roller').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/index.css',
       '/index.js',
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  event.respondWith(
  caches.match(event.request).then(function(response) {
    if (response) {
      return response || fetch(event.request);
    } else {
      return fetch(event.request)
        .then(function(res) {
          return caches.open('d6roller')
            .then(function(cache) {
              cache.put(event.request.url, res.clone());
              return res;
            })
        })
        
    }
  
  
  })
  
  );
  
  });