import './flow-view.scss'

import { HelloWorld } from './examples/HelloWorld'

export function App () {

  return (<div>
    <h1>Flow View</h1>

    <h2>Examples</h2>

    <div style={{position: 'relative'}}>
      <HelloWorld />
    </div>
  </div>
  )
}
