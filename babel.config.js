const TARGETS_NODE = '12.13.0'
const CORE_JS_VERSION = '3.6'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: TARGETS_NODE },
        useBuiltIns: 'usage',
        corejs: {
          version: CORE_JS_VERSION,
          // List of supported proposals: https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#ecmascript-proposals
          proposals: true,
        },
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        // https://babeljs.io/docs/en/babel-plugin-transform-runtime/#core-js-aliasing
        // Setting the version here also requires `@babel/runtime-corejs3`
        corejs: { version: 3, proposals: true },
        // https://babeljs.io/docs/en/babel-plugin-transform-runtime/#version
        // Transform-runtime assumes that @babel/runtime@7.0.0 is installed.
        // Specifying the version can result in a smaller bundle size.
        // TODO: Grab version for package.json
        version: '^7.11.2',
      },
    ],
  ]
}