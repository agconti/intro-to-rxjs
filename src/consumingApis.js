import {appendResults} from 'utils'
import Rx from 'Rx'

const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q=NewYork,us'
const flightUrl = 'http://services.faa.gov/airport/status/JFK?format=json'

let weatherObservable = Rx.Observable.create((observer) => {
  jQuery.getJSON(weatherUrl)
  .done((response) => { observer.onNext(response) })
  .fail((jqXHR, status, error) => { observer.onError(error) })
  .always(() =>{ observer.onCompleted() })
})

weatherObservable.subscribe(result => appendResults(result.weather[0].description, 'weather'))


// Or we can use fromPromise for convenience
let flightDelayObservable = Rx.Observable.fromPromise(jQuery.getJSON(flightUrl))

flightDelayObservable
 .subscribe(delays => appendResults(`${delays.status.type}: ${delays.status.reason}`, 'flights'))
