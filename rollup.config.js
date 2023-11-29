import legacy from '@rollup/plugin-legacy';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';
import image from '@rollup/plugin-image';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import postcssVariables from 'postcss-css-variables';
import cssnano from 'cssnano';
import esmShim from '@rollup/plugin-esm-shim';
import url from '@rollup/plugin-url';
import strip from '@rollup/plugin-strip';

const Consts = {
  DIR_STYLES: 'style/**',
  DIR_NODE_MODULES: 'node_modules/**',
  DIR_INCLUDES: ['src/**', 'style/**'],
};

const config = [
  {
    perf: false,
    context: 'window',
    treeshake: 'safest',
    strictDeprecations: true,
    external: ['lodash'],
    input: ['src/index.js'],
    output: [
      {
        dir: 'dist/',
        entryFileNames: `cafealberoo.min.js`,
        chunkFileNames: `cafealberoo-[hash].min.js`,
        format: 'umd',
        name: 'cafealberoo',
        compact: true,
        strict: false,
        sourcemap: 'hidden',
        banner: '',
        footer: '',
        globals: {
          loadsh: '_',
        },
        plugins: [
          terser({
            ecma: 5,
            module: false,
            toplevel: true,
            ie8: true,
            safari10: true,
            keep_classnames: false,
            keep_fnames: false,
            maxWorkers: 4,
            parse: {
              bare_returns: false,
              html5_comments: false,
            },
            compress: {
              defaults: true,
              arrows: false,
              keep_fargs: true,
              booleans_as_integers: false,
              drop_console: false,
              drop_debugger: true,
              passes: 2,
              top_retain: '',
            },
            mangle: {
              eval: true,
              reserved: [],
            },
            format: {
              ascii_only: false,
              braces: false,
              comments: /@preserve/,
              webkit: true,
            },
          }),
        ],
      },
    ],
    plugins: [
      esmShim(),
      url({
        include: ['**/*.woff', '**/*.woff2'],
        limit: Infinity,
      }),
      image({
        dom: false,
        include: Consts.DIR_INCLUDES,
        exclude: [Consts.DIR_NODE_MODULES],
      }),
      eslint({
        include: Consts.DIR_INCLUDES,
        exclude: [Consts.DIR_NODE_MODULES, Consts.DIR_STYLES],
        throwOnWarning: true,
        throwOnError: true,
      }),
      legacy({}),
      commonjs({
        sourceMap: false,
        transformMixedEsModules: true,
      }),
      nodePolyfills({
        include: [Consts.DIR_NODE_MODULES],
        exclude: [Consts.DIR_STYLES],
        sourceMap: false,
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: true,
        moduleDirectories: ['node_modules'],
        extensions: ['.mjs', '.js', '.json', '.node'],
        modulesOnly: false,
      }),
      json({
        compact: true,
      }),
      postcss({
        extract: false,
        inject: true,
        modules: false,
        extensions: ['.css', '.sss', '.pcss'],
        use: ['sass', 'stylus', 'less'],
        autoModules: true,
        minimize: true,
        sourceMap: false,
        exec: true,
        plugins: [
          postcssPresetEnv({
            stage: 4,
            autoprefixer: {},
          }),
          postcssVariables({
            preserve: false,
            preserveAtRulesOrder: true,
          }),
          cssnano({
            preset: 'cssnano-preset-default',
          }),
        ],
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: [Consts.DIR_NODE_MODULES],
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
      }),
      strip({
        include: ['**/*.(mjs|cjs|js)'],
        exlude: Consts.DIR_NODE_MODULES,
        debugger: true,
        functions: ['console.log', 'assert.*'],
        labels: ['unittest'],
        sourceMap: true,
      }),
    ],
  },
];
export default config;
