// Utils

'use strict';

function appendResults(val, resultsDiv) {
  var results = document.getElementById(resultsDiv);
  results.innerHTML += val;
}

// Consuimg an observable
var source = Rx.Observable.interval(125);

source.filter(function (x) {
  return x % 2 === 0;
}).map(function (x) {
  return '.';
}).subscribe(function (x) {
  return appendResults(x, 'results');
});

// Hot vs Cold Observables
var cold = Rx.Observable.interval(500);

cold.subscribe(function (x) {
  return appendResults(x, 'cold1');
});

setTimeout(function () {
  cold.subscribe(function (x) {
    return appendResults(x, 'cold2');
  });
}, 1500);

var hot = Rx.Observable.interval(500).publish().refCount();

hot.subscribe(function (x) {
  return appendResults(x, 'hot1');
});

setTimeout(function () {
  hot.subscribe(function (x) {
    return appendResults(x, 'hot2');
  });
}, 1500);

// Creating observables
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
  return appendResults(results, 'rando');
}, function (err) {
  return document.getElementById('rando-error').checked = true;
}, function () {
  return document.getElementById('rando-success').checked = true;
});

// Consuming apis
var weatherObservable = Rx.Observable.create(function (observer) {
  jQuery.getJSON('http://api.openweathermap.org/data/2.5/weather?q=NewYork,us').done(function (response) {
    observer.onNext(response);
  }).fail(function (jqXHR, status, error) {
    observer.onError(error);
  }).always(function () {
    observer.onCompleted();
  });
});

weatherObservable.subscribe(function (result) {
  return appendResults(result.weather[0].description, 'weather');
});

var flightDelayObservable = Rx.Observable.create(function (observer) {
  jQuery.getJSON('http://services.faa.gov/airport/status/JFK?format=json').done(function (response) {
    observer.onNext(response);
  }).fail(function (jqXHR, status, error) {
    observer.onError(error);
  }).always(function () {
    observer.onCompleted();
  });
});

flightDelayObservable
// only get delays
.filter(function (flight) {
  return flight.delay === 'true';
}).subscribe(function (delays) {
  return appendResults(delays.status.type + ': ' + delays.status.reason, 'flights');
});

// Disposing observables
var toBeDisposedObservable = Rx.Observable.create(function (observer) {
  var id = setTimeout(function () {
    observer.onNext(42);
    observer.onComplete();
  }, 1000);

  // Disposal function
  return function () {
    return clearTimeout(id);
  };
});

toBeDisposedObservable.subscribe(function (x) {
  return appendResults(x, 'not-disposed');
});

// Dispose the observable before we can consume it
toBeDisposedObservable.dispose();
toBeDisposedObservable.subscribe(function (x) {
  return appendResults(x, 'disposed');
});
//# sourceMappingURL=all.js.map