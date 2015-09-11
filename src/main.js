// Utils

function appendResults(val, resultsDiv){
 var results = document.getElementById(resultsDiv)
 results.innerHTML += val
}


// Consuimg an observable
let source = Rx.Observable.interval(125)

source
  .filter(x => x % 2 === 0)
  .map(x => '.')
  .subscribe(x => appendResults(x, 'results'))



// Hot vs Cold Observables
let cold = Rx.Observable.interval(500)

cold.subscribe(x => appendResults(x, 'cold1'))

setTimeout(function(){
  cold.subscribe(x => appendResults(x, 'cold2'))
}, 1500)


let hot = Rx.Observable.interval(500).publish().refCount()

hot.subscribe(x => appendResults(x, 'hot1'))

setTimeout(function(){
  hot.subscribe(x => appendResults(x, 'hot2'))
}, 1500)




// Creating observables
let myObservable = Rx.Observable.create((observer) => {

      let number = Math.random() * 100
      try{
        if (number > 100 ){
          throw new Error('RandomIsBroken')
        }
      } catch(err){
        observer.onError(err)
      }

      observer.onNext(number)
      observer.onCompleted()

  // disposal function
  return x => console.log('myObservable has been disposed.')
})

myObservable
  .subscribe( results => appendResults(results, 'rando')
            , err => document.getElementById('rando-error').checked = true
            , () => document.getElementById('rando-success').checked = true
            )



// Consuming apis
 let weatherObservable = Rx.Observable.create((observer) => {
    jQuery.getJSON('http://api.openweathermap.org/data/2.5/weather?q=NewYork,us')
    .done((response) => { observer.onNext(response) })
    .fail((jqXHR, status, error) => { observer.onError(error) })
    .always(() =>{ observer.onCompleted() })
  })

 weatherObservable.subscribe(result => appendResults(result.weather[0].description, 'weather'))


 let flightDelayObservable = Rx.Observable.create((observer) => {
    jQuery.getJSON('http://services.faa.gov/airport/status/JFK?format=json')
    .done((response) => { observer.onNext(response) })
    .fail((jqXHR, status, error) => { observer.onError(error) })
    .always(() =>{ observer.onCompleted() })
  })

 flightDelayObservable
    // only get delays
   .filter(flight => flight.delay === 'true')
   .subscribe(delays => appendResults(`${delays.status.type}: ${delays.status.reason}`, 'flights'))



 // Disposing observables
 let toBeDisposedObservable = Rx.Observable.create((observer) => {
   let id = setTimeout(() => {
     observer.onNext(42)
     observer.onComplete()
   }, 1000)

   // Disposal function
   return () => clearTimeout(id)
 })


toBeDisposedObservable
  .subscribe(x => appendResults(x, 'not-disposed'))

// Dispose the observable before we can consume it
toBeDisposedObservable.dispose()
toBeDisposedObservable
  .subscribe(x => appendResults(x, 'disposed'))
