import {appendResults} from 'utils'
import Rx from 'Rx'


let toBeDisposedObservable = Rx.Observable.create((observer) => {
  let id = setTimeout(() => {
    observer.onNext('I made it!')
    observer.onCompleted()
  }, 1000)

  // Disposal function
  return () => clearTimeout(id)
})


let subscription1 = toBeDisposedObservable
    .subscribe(x => appendResults(x, 'not-disposed'))

let subscription2 = toBeDisposedObservable
    .subscribe(x => appendResults(x, 'disposed'))

// Dispose the observable before we can consume it
setTimeout(() => { subscription2.dispose() }, 500)
