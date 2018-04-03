//This code is copied from an online example by Nicolas Bevacqua
//https://css-tricks.com/serviceworker-for-offline/
//It's a placeholder to keep things working properly while I see what's wrong with my own serviceWorker code.

var version = 'v2.1';

self.addEventListener("install", function(event) {  //this portion shouldn't delete anything from cache since it might be in use
    
    event.waitUntil(caches.open("necessaryFiles" + version).then(function(cache){return cache.addAll([
            '/',
            'd6-system-roller.css',
            'd6-system-roller.js',
            'd6-system-roller.html'
          ]);
        })
    );
  });

self.addEventListener("fetch", function(event) {  //this is where the cached files can actually be used if necessary
    //borrowed some of this code and the notes from Nicolas Bevacqua; pretty useful stuff, so I'm not going to mess with it much
    //https://css-tricks.com/serviceworker-for-offline/

     
    /* We should only cache GET requests, and deal with the rest of method in the
       client-side, by handling failed POST,PUT,PATCH,etc. requests.
    */
    if (event.request.method !== 'GET') {
      /* If we don't block the event as shown below, then the request will go to
         the network as usual.
      */
      console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
      return;
    }
    /* Similar to event.waitUntil in that it blocks the fetch event on a promise.
       Fulfillment result will be used as the response, and rejection will end in a
       HTTP response indicating failure.
    */
    event.respondWith(
      caches
        /* This method returns a promise that resolves to a cache entry matching
           the request. Once the promise is settled, we can then provide a response
           to the fetch request.
        */
        .match(event.request)
        .then(function(cached) {
          /* Even if the response is in our cache, we go to the network as well.
             This pattern is known for producing "eventually fresh" responses,
             where we return cached responses immediately, and meanwhile pull
             a network response and store that in the cache.
             Read more:
             https://ponyfoo.com/articles/progressive-networking-serviceworker
          */
          var networked = fetch(event.request)
            // We handle the network request with success and failure scenarios.
            .then(fetchedFromNetwork, unableToResolve)
            // We should catch errors on the fetchedFromNetwork handler as well.
            .catch(unableToResolve);
  
          /* We return the cached response immediately if there is one, and fall
             back to waiting on the network as usual.
          */
          console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
          return cached || networked;
  
          function fetchedFromNetwork(response) {
            /* We copy the response before replying to the network request.
               This is the response that will be stored on the ServiceWorker cache.
            */
            var cacheCopy = response.clone();
  
            console.log('WORKER: fetch response from network.', event.request.url);
  
            caches
              // We open a cache to store the response for this request.
              .open(version + 'pages')
              .then(function add(cache) {
                /* We store the response for this request. It'll later become
                   available to caches.match(event.request) calls, when looking
                   for cached responses.
                */
                cache.put(event.request, cacheCopy);
              })
              .then(function() {
                console.log('WORKER: fetch response stored in cache.', event.request.url);
              });
  
            // Return the response so that the promise is settled in fulfillment.
            return response;
          }
  
          /* When this method is called, it means we were unable to produce a response
             from either the cache or the network. This is our opportunity to produce
             a meaningful response even when all else fails. It's the last chance, so
             you probably want to display a "Service Unavailable" view or a generic
             error response.
          */
          function unableToResolve () {
            /* There's a couple of things we can do here.
               - Test the Accept header and then return one of the `offlineFundamentals`
                 e.g: `return caches.match('/some/cached/image.png')`
               - You should also consider the origin. It's easier to decide what
                 "unavailable" means for requests against your origins than for requests
                 against a third party, such as an ad provider
               - Generate a Response programmaticaly, as shown below, and return that
            */
  
            console.log('WORKER: fetch request failed in both cache and network.');
  
            /* Here we're creating a response programmatically. The first parameter is the
               response body, and the second one defines the options for the response.
            */
            return new Response('<h1>Service Unavailable</h1>', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/html'
              })
            });
          }
        })
    );
  });

  self.addEventListener("activate", function(event) {
    /* Just like with the install event, event.waitUntil blocks activate on a promise.
       Activation will fail unless the promise is fulfilled.
    */
    //Also borrowed this from Nicolas Bevacqua, but switched the version number to the end of the cache name instead of beginning
    //https://css-tricks.com/serviceworker-for-offline/

  
    event.waitUntil(caches.keys().then(function (keys) {
          return Promise.all(keys.filter(function (key) {
                return !key.endsWith(version);
              })
              .map(function (key) {
                /* Return a promise that's fulfilled
                   when each outdated cache is deleted.
                */
                return caches.delete(key);
              })
          );
        })
        );
  });