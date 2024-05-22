import incremental from '@mprt/rollup-plugin-incremental'
import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import meta from 'rollup-plugin-import-meta-env';
import json from '@rollup/plugin-json';

export default [
  {
    input: 'src/main.ts',
    //ATTENTION: treeshaking must be disabled!
    // treeshake: false,
    output: [
      {
        name: 'Pokerogue',
        format: 'cjs',
        file: 'dist/pokerogue.cjs.js',
        globals: { phaser: 'Phaser' },
        //ATTENTION: preserveModules must be enabled!
        // preserveModules: true,
        // preserveModulesRoot: 'src',
        //ATTENTION: minifyInternalExports must be disabled!
        minifyInternalExports: false
      },
    ],
    external: ['phaser'],
    plugins: [
      // incremental(),
      typescript({ module: "ES2020" }),
      json(),
      // resolve(),
      //ATTENTION: this fixes issues with syntheticNamedExports in commonjs modules
      //it should be last
      // incremental.fixSNE(),
    ]
  }
];
