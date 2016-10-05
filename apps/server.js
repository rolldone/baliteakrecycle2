var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
fs = require('fs');
var configuration = JSON.parse(
    fs.readFileSync('configuration.json')
);

//
// ini menentukan apakah project
// dalam status production atau development
// cara bikinnya di windows command promt ketil 'set NODE_ENV = "DEVELOPMENT" '
// process.env.NODE_ENV = "development";
// versi default process.env.NODE_ENV !== "production";
var debug = configuration.mode_option.debug !== false;
// console.log(debug);
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
// ini menentukan hasil 
// mau develop atau production
var whatOptionFolderMode = dev_folder;
if(debug){
  whatOptionFolderMode = dev_folder;
}else{
  whatOptionFolderMode = dist_folder;
}
// ---

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  contentBase: './'+whatOptionFolderMode
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});