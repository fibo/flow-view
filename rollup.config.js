import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import external from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';

const deps = Object.keys(pkg.dependencies || {})
const peerDeps = Object.keys(pkg.peerDependencies || {})

export default [
  {
    input: 'src/flow-view.js',
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'esm' }
    ],
    plugins: [
      external(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      terser()
    ],
    external: deps.concat(peerDeps)
  }
]
