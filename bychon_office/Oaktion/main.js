var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;
var splashscreen = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

  splashscreen = new BrowserWindow({width: 800, height: 400, transparent: true, frame: false});
  splashscreen.loadUrl('file://' + __dirname + "/splashscreen.html");

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1600, height: 800, 'min-width': 1000, 'min-height': 600, show : false, 'node-integration': false});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  setTimeout(function() {
    splashscreen.close();
    mainWindow.show();
  }, 3000);


  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
