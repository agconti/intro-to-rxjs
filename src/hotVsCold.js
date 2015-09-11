import {appendResults} from 'utils'
import Rx from 'Rx'

let cold = Rx.Observable.interval(500)
  , hot = Rx.Observable.interval(500).publish().refCount()

cold.subscribe(x => appendResults(x, 'cold1'))
setTimeout(function(){
  cold.subscribe(x => appendResults(x, 'cold2'))
}, 1500)


hot.subscribe(x => appendResults(x, 'hot1'))
setTimeout(function(){
  hot.subscribe(x => appendResults(x, 'hot2'))
}, 1500)
