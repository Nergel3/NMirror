// Modules to control application life and create native browser window
const electron = require('electron');
const {app, BrowserWindow, globalShortcut} = electron;
const ipcMain = electron.ipcMain;
const static = require('node-static'); 

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
    let mainWindow = new BrowserWindow({show: true, autoHideMenuBar: true, icon: 'icon.png' });
    let onlineStatus = new BrowserWindow({show: true, autoHideMenuBar: true, icon: 'icon.png', width: 0, height: 0, show: false, parent: mainWindow });
    let calendarG = new BrowserWindow({show: true, autoHideMenuBar: true, icon: 'icon.png'});
                                   
    var file = new static.Server(`${__dirname}/src/calendar.html`)                  //Création du serveur web local
    httpServer = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response)
    }).resume()});


  httpServer.listen(8000);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/src' + '/index.html');
  mainWindow.setFullScreen(true);
  calendarG.loadURL('http://localhost:8000');

  globalShortcut.register('Ctrl+Q', () => {
    httpServer.close();
    app.quit();
  });

  /* mainWindow.webContents.on('did-finish-load', () => {            //Renvoie sur fenêtre mirroir les data de la fenetre calendar 
    
    console.log("mainWindow: OK");
    
    ipcMain.once("fetchOk", (event, arg) => {                   //Données météo chargés --> peut recevoir les données du calendrier --> évite freeze
      console.log("WeatherAJAX: OK");
      if (arg == true) {                //essayer While si bug §§§§§§§§§§§§§§§§§§§§§§§§§§§§
        ipcMain.on("mirrorCalendar", (event, arg) => {
          setInterval(function() {
            dataTransfer(mainWindow, "mirrorCalendar", arg);
          }, 60 * 1000); 
        })
      }
    })
  }) */

  mainWindow.webContents.on('did-finish-load', () => {            //Renvoie sur fenêtre mirroir les data de la fenetre calendar 
        
    ipcMain.on("mirrorCalendar", (event, arg) => {
        console.log("Calendar : ok");
        mainWindow.webContents.send('mirrorCalendar', arg);
    });
})

  function dataTransfer(window, channel, arg) {
    if (typeof arg != "undefined" && typeof window != undefined && typeof channel != undefined) {
      window.webContents.send(channel, arg); 
      console.log("data send"); 
    } else {console.log("undefined !")}
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
