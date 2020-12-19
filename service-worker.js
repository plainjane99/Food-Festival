// Now that the browser knows about the service worker,
// we need to install it, adding files to the precache, so that the application can use the cache.

// global constants
const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// define which files we'd like to cache
const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
];

// use self because service workers run before the window object has been created
// i.e. self refers to the service worker object
self.addEventListener('install', function (e) {
    // tell the browser to wait until the work is complete before terminating the service worker
    // This ensures that the service worker doesn't move on from the installing phase until it's finished executing all of its code.
    e.waitUntil(
        // find the specific cache by name, then add every file in the FILES_TO_CACHE array to the cache
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('activate', function (e) {
    e.waitUntil(
        // .keys returns an array of all cache names, which we're calling keyList
        // keyList is a parameter that contains all cache names under <username>.github.io
        // Because we may host many sites from the same URL, 
        // we filter out caches that have the app prefix.
        // We'll capture the ones that have that prefix, stored in APP_PREFIX, 
        // and save them to an array called cacheKeeplist using the .filter() method
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })
            // add the current cache to the keeplist
            cacheKeeplist.push(CACHE_NAME);

            // returns a Promise that resolves once all old versions of the cache have been deleted
            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
});

// listen for the fetch event, 
// log the URL of the requested resource, 
// then begin to define how we will respond to the request.
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        // determine if the resource already exists in caches
        caches.match(e.request).then(function (request) {
            // If it does, we'll log the URL to the console with a message and then return the cached resource
            if (request) { // if cache is available, respond with cache
                console.log('responding with cache : ' + e.request.url)
                return request
            // if the resource is not in caches, we allow the resource to be retrieved from the online network as usual
            } else {       // if there are no cache, try fetching request
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }

            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        }))
})