import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default [
  {
    input: 'flow-view.js',
    output: {
      file: pkg.module,
      format: 'es'
    },
    plugins: [
      terser({
        mangle: false,
        module: true,
        sourcemap: true
      })
    ]
  }
]
