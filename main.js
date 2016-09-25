const {app, BrowserWindow, ipcMain} = require('electron');
fs = require('fs');

app.on('ready', function() {
  // open window
  let win = new BrowserWindow({show: false});
  win
  win.once('ready-to-show', function() {
    win.show();
  })
  // load default html page
  win.loadURL(`file://${__dirname}/helpdesk.html`);
  win.setFullScreen(true);

  // listen for add person request from renderer
  ipcMain.on(`add_person`, function(event, arg) {
    // read json file into an array of objects
    // add a new person object to array
    // write array back to json file

    var filename = `${__dirname}/helpdesk_log.json`;
    // read json file
    fs.readFile(filename, `utf8`, function (err, data) {
      if (err)
        console.log(`Error reading JSON file: ${err}`);
      var people = JSON.parse(data);
      // add person
      people.push(arg);
      // write json file
      fs.writeFile(filename, JSON.stringify(people), function(err) {
        if(err)
          // return failure message to sender
          event.send.send(`add_person_reply`, `Error writing to JSON file: ${err}`);
        else
          //return success message to sender
          event.sender.send(`add_person_reply`, `Successfully added: ${JSON.stringify(arg)}`);
      });
    });
  });
});
