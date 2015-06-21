/*eslint-env node */
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer-core');

var NODE_ENV = process.env.NODE_ENV || 'development';
var DEVELOPMENT = (NODE_ENV !== 'production');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  })
];

if (!DEVELOPMENT) {
  plugins.push(new webpack.optimize.OccurenceOrderPlugin());
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: false,
        warnings: false
      }
    })
  );
}

module.exports = {
  context: path.join(__dirname, '/app'),
  entry: [
    './index.html',
    './main.js'
  ],
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js'
  },
  devtool: DEVELOPMENT ? '#inline-source-map' : undefined,
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint'
      }
    ],

    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      // .less files in /app/components/ are locally scoped
      {
        test: /\.less$/,
        exclude: /(node_modules|global)/,
        loader: DEVELOPMENT ?
            'style!css?module&importLoaders=2&' +
            'localIdentName=[path][name]---[local]---[hash:base64:5]' +
            '!postcss!less'
          :
            'style!css?module&importLoaders=2&localIdentName=[hash:base64:5]' +
            '!postcss!less'
      },
      // other stylesheets are globally scoped
      {
        test: /\.less$/,
        exclude: /app\/components/,
        loader: DEVELOPMENT ?
            'style!css?importLoaders=2!postcss!less'
          :
            'style!css?importLoaders=2!postcss!less'
      },
      {
        test: /\.css$/,
        loader: DEVELOPMENT ?
            'style!css?importLoaders=1!postcss'
          :
            'style!css?importLoaders=1!postcss'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&minetype=application/font-woff' +
          (DEVELOPMENT ? '&name=[name]_[hash].[ext]' : '')
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: DEVELOPMENT ? 'file?name=[name]_[hash].[ext]' : 'file'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url?limit=10000' +
          (DEVELOPMENT ? '&name=[name]_[hash].[ext]' : '')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },
  postcss: [
    autoprefixer
  ],
  eslint: {
    emitError: true,
    failOnError: true,
    formatter: require('eslint-friendly-formatter')
  },
  plugins: plugins
};
