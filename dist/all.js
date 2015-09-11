'use strict';

var source = Rx.Observable.interval(125);

source.filter(function (x) {
  return x % 2 === 0;
}).map(function (x) {
  return '.';
}).subscribe(function (x) {
  return appendResults(x, 'results');
});
'use strict';

var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q=NewYork,us';
var flightUrl = 'http://services.faa.gov/airport/status/JFK?format=json';

var weatherObservable = Rx.Observable.create(function (observer) {
  jQuery.getJSON(weatherUrl).done(function (response) {
    observer.onNext(response);
  }).fail(function (jqXHR, status, error) {
    observer.onError(error);
  }).always(function () {
    observer.onCompleted();
  });
});

weatherObservable.subscribe(function (result) {
  return appendResults(result.name + ' | ' + result.weather[0].description, 'weather');
});

// Or we can use fromPromise for convenience
var flightDelayObservable = Rx.Observable.fromPromise(jQuery.getJSON(flightUrl));

flightDelayObservable.subscribe(function (delay) {
  return appendResults('JFK | Delay ' + delay.delay + ': ' + delay.status.reason, 'flights');
});
'use strict';

var myObservable = Rx.Observable.create(function (observer) {

  var number = Math.random() * 100;

  try {
    if (number > 100) {
      throw new Error('RandomIsBroken');
    }
  } catch (err) {
    observer.onError(err);
  }

  observer.onNext(number);
  observer.onCompleted();

  // disposal function
  return function (x) {
    return console.log('myObservable has been disposed.');
  };
});

myObservable.subscribe(function (results) {
  return appendResults(results, 'custom');
}, function (err) {
  return document.getElementById('custom-error').checked = true;
}, function () {
  return document.getElementById('custom-success').checked = true;
});
'use strict';

var toBeDisposedObservable = Rx.Observable.create(function (observer) {
  var id = setTimeout(function () {
    observer.onNext('I made it!');
    observer.onCompleted();
  }, 1000);

  // Disposal function
  return function () {
    return clearTimeout(id);
  };
});

var subscription1 = toBeDisposedObservable.subscribe(function (x) {
  return appendResults(x, 'not-disposed');
});

var subscription2 = toBeDisposedObservable.subscribe(function (x) {
  return appendResults(x, 'disposed');
});

// Dispose the observable before we can consume it
setTimeout(function () {
  subscription2.dispose();
}, 500);
'use strict';

var cold = Rx.Observable.interval(500),
    hot = Rx.Observable.interval(500).publish().refCount();

cold.subscribe(function (x) {
  return appendResults(x, 'cold1');
});
setTimeout(function () {
  cold.subscribe(function (x) {
    return appendResults(x, 'cold2');
  });
}, 1500);

hot.subscribe(function (x) {
  return appendResults(x, 'hot1');
});
setTimeout(function () {
  hot.subscribe(function (x) {
    return appendResults(x, 'hot2');
  });
}, 1500);

// Syntax Highlighting
"use strict";

hljs.initHighlightingOnLoad();
"use strict";

function appendResults(val, resultsDiv) {
  var results = document.getElementById(resultsDiv);
  results.innerHTML += val;
}
//# sourceMappingURL=all.js.map