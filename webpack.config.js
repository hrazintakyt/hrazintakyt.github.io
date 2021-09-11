const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const DIST = path.resolve(__dirname, 'dist')

module.exports = {
  mode: 'development',
  entry: './public/metaMask.js',
  output: {
    filename: 'bundle.js',
    path: DIST,
    publicPath: DIST,
  },
  devServer: {
    contentBase: DIST,
    port: 2045,
    writeToDisk: true,
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),

    // for build scripts
    new CopyPlugin({
      patterns: [
        {
          flatten: true,
          from: './public/*',
          globOptions: {
            ignore: ['**/*.raw'],
          },
        },
      ],
    }),
  ],
}
