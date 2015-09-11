import {appendResults} from 'utils'
import Rx from 'Rx'

let myObservable = Rx.Observable.create((observer) => {

  let number = Math.random() * 100

  try{
    if (number > 100 ){ throw new Error('RandomIsBroken') }
  } catch(err){
    observer.onError(err)
  }

  observer.onNext(number)
  observer.onCompleted()

  // disposal function
  return x => console.log('myObservable has been disposed.')
})

myObservable
  .subscribe( results => appendResults(results, 'custom')
            , err => document.getElementById('custom-error').checked = true
            , () => document.getElementById('custom-success').checked = true
            )
