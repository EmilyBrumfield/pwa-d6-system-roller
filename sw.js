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
  
  return response || fetch(event.request);
  
  })
  
  );
  
  });