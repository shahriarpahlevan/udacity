/* event listening for installing all the files! */
self.addEventListener('install', (event) => {
 event.waitUntil(
   caches.open('restaurant').then((cache) => {
     return cache.addAll([
       '/',
       '/index.html',
       '/restaurant.html',
       '/css/styles.css',
       '/js/dbhelper.js',
       '/js/main.js',
       '/js/restaurant_info.js',
       '/data/restaurants.json',
       '/img/',
       '/img/1.jpg',
       '/img/2.jpg',
       '/img/3.jpg',
       '/img/4.jpg',
       '/img/5.jpg',
       '/img/6.jpg',
       '/img/7.jpg',
       '/img/8.jpg',
       '/img/9.jpg',
       '/img/10.jpg',
     ]).then(() => {
      console.log('Caching all file completed!');
     }).catch((error) => {
      console.log('Caching files gave an error: ', error);
     })
   })
 );
});

/* fetch event listener! */
self.addEventListener('fetch', (event) => {
  if (event.request.url.indexOf('maps.googleapis.com') !== -1) return;

  /* activate service worker event listener! */
self.addEventListener('activate', (event) => {
  console.log('Service Worker Activation in Progress');
});

  event.respondWith(
    caches.open('restaurant').then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});