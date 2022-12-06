const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById("submit").addEventListener("click", function(e){
    e.preventDefault();
    const item = document.querySelector('#Item').value;
    ipcRenderer.send('item:add', item);
});