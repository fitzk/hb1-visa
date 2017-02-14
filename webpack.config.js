var path = require('path');
var webpack = require('webpack');
var HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');

var loaders = [
  {
    "test": /\.js?$/,
    "exclude": /node_modules/,
    "loader": "babel-loader",
    "query": {
      "presets": [
        "es2015",
        "react",
        "stage-0"
      ],
      "plugins": []
    }
  },
  {
    "test": /\.css?$/,
    "loader": "style-loader!css-loader"
  },
  {
    "test": /\.csv?$/,
    "loader": "csv-loader"
  }, {
    "test": /\.json?$/,
    "loader": "json-loader"
  }
];

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    main: [
      "babel-polyfill",
      "react-hot-loader/patch",
      "webpack-dev-server/client?http://localhost:8080",
      path.resolve('src', 'main.js')
    ]
  },
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      data: path.resolve(__dirname, "data")
    },
    extensions: [".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html'
    }),
    new HotModuleReplacementPlugin()
  ],
  module: {
    loaders: loaders
  },
  devServer: {
    hot: true,
    stats: {
      colors: true
    }
  },
  node: {
    fs: "empty"
  }
};
