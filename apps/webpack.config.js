path = require('path');
const webpack = require('webpack');
fs = require('fs');
//
// load data file configuration.json nya 
var configuration = JSON.parse(
    fs.readFileSync('configuration.json')
);
// --

//
// ini menentukan apakah project
// dalam status production atau development
// process.env.NODE_ENV = "development";
// yang lama process.env.NODE_ENV !== "production";
var debug = configuration.mode_option.debug !== false;
// ---

//
// load copy-webpack-plugin third party
// dibutuhkan untuk melakukan copy assets
// dari dev ke dist css dan image
// jadi production
var CopyWebpackPlugin = require('copy-webpack-plugin');
// ---

//
// menentukan folder khusus untuk react development
// sumber code react ada disini
var main_folder = "/src";
// ---

//
// folder dev ini tempat bagian hasil development
// hasil compile dari folder reacts tapi masih development
var dev_folder = "/dev";
// ---

//
// semua assets dari folder dev juga ke copy otomatis ke
// folder dist seperti image, css, js biasa
// hasil compile dari folder reacts dalam bentuk production
var dist_folder = "/dist"
// ---

//
// root direktorinya
var APP_DIR = path.join(__dirname, "");
// ---

//
// ini menentukan hasil 
// mau develop atau production
var whatOptionFolderMode = dev_folder;
if(debug){
  whatOptionFolderMode = dev_folder;
}else{
  whatOptionFolderMode = dist_folder;
}
// ---

//
// ini adalah devTools 
// enable devTools in development environment
var devFlagPlugin = new webpack.DefinePlugin({  
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});
// ---

module.exports = {
  context: APP_DIR+main_folder,
  devtool: 'eval',
  entry: './main.jsx',
  output: {
    path: APP_DIR+whatOptionFolderMode,
    filename: 'bundle.js',
    //
    // kalo mau di dibuat public url seakan di folder lain
    // mungkin bisa berfungsi kalo webpacknya jadi server
    publicPath: '/',
    // ---
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)?$/,
        include : APP_DIR,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {

          //
          // depedency buat compiler jsx 
          // nya berfungsi
          presets: [
            'babel-preset-es2015',
            'babel-preset-react',
            'babel-preset-stage-0',
          ].map(require.resolve),
          // ---

          //
          // depedency buat compiler jsx 
          // nya berfungsi
          plugins: [
            'babel-plugin-react-html-attrs',
            'babel-plugin-transform-class-properties',
            'babel-plugin-transform-decorators-legacy'
          ].map(require.resolve),
          // ---
        }
      }
    ],
  },

  //
  // ini penting !!!!!
  // ini adalah fungsi untuk mengenali type file
  // di setiap folder dalam react folder jadi tinggal import folder doang pasti mau kok
  // 
  resolve:{
    extensions: ['','.jsx','.js', '.json'],
  },
  // ---

  plugins:[
    load_CopyWebpackPlugin(),
    load_watchingPlugin(),
    devFlagPlugin
  ],
  //
  // biar bisa akses lansung lewat root urlnya
  // beserta portnya
  devServer: {
    inline:true,
    port: 8008,
    outputPath: path.join(__dirname, 'dist')
  },
  // ---
};

//
// fitur penting untuk aktifkan 
// auto compile otomatis file terkait
// didalamnya
function load_watchingPlugin(){
  return new webpack.OldWatchingPlugin();
}
// ---

//
// ini adalah third party copy file atau folder
// tugasnya untuk melakukan copas dari development asset
// ke production asset
function load_CopyWebpackPlugin(){
  var ttt = "";
  if(debug == false){
    ttt = new CopyWebpackPlugin([
      { 
        from: APP_DIR+dev_folder+"/css", to: APP_DIR+dist_folder+"/css" 
      },
      {
        from: APP_DIR+dev_folder+"/images", to: APP_DIR+dist_folder+"/images" 
      },
      {
        from: APP_DIR+dev_folder+"/bower_components", to: APP_DIR+dist_folder+"/vendor"
      },
      {
        from: APP_DIR+dev_folder+"/js", to: APP_DIR+dist_folder+"/js" 
      }]);
  }else{
    return new CopyWebpackPlugin();
  }
  return ttt;
}

