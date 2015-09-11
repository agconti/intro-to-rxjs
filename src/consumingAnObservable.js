import {appendResults} from 'utils'
import Rx from 'Rx'

let source = Rx.Observable.interval(125)

source
  .filter(x => x % 2 === 0)
  .map(x => '.')
  .subscribe(x => appendResults(x, 'results'))
