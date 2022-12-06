const electron = require('electron');
const url = require("url");
const path = require("path");

const { app, BrowserWindow , Menu , ipcMain } = electron;

//set env
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

app.on('ready', function () {
  //create new window
  mainWindow = new BrowserWindow({

    webPreferences: {
      nodeIntegration: true,
      contextIsolation:false
    }
  });
  //load html file
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  //quit app when close
  mainWindow.on('closed', function(){
      app.quit();
  })

  //build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  //insert menu
  Menu.setApplicationMenu(mainMenu);
});

//handle create addwindow
function createAddWindow(){
   


     //create new window
  addWindow = new BrowserWindow({
    width:400,
    height:300,
    title:'Add Shopping List',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation:false
    }
  });
  //load html file
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  addWindow.on('closed', function(){
        addWindow = null;
  });

}
//catch item:add

ipcMain.on('item:add', function(e, item){
  mainWindow.webContents.send('item:add', item);
  addWindow.close(); 
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});

//create menu template

const mainMenuTemplate = [
  {
    label: "file",
    submenu: [
      {
        label: "Add Item",
        click(){
            createAddWindow();
        }
      },
      {
        label: "Clear Items",
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: "Quit",
        accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',
        click() {
          app.quit();
        },
      },
    ],
  },
];

// add developer tools item if not in prod

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
                label:'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',

                click(item , focusedwindow){
                        focusedwindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
