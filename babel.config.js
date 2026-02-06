/**
 * Babel configuration for Jest.
 *
 * This configuration is used by babel-jest to transform ESM modules
 * from node_modules into CommonJS for Jest.
 */
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
};
