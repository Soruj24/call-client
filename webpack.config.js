const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      global: require.resolve('global'),
      buffer: require.resolve('buffer'),
      process: require.resolve('process/browser'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      global: 'global',
    }),
  ],
};
