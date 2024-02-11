
// commands

Object.assign(commands,{
  echo: [function(args) {
    return args.join(' ');
  },'- Display Message'],

  app: [function(args) {
    const action = args[0]
    const url = args[1]
    if (action == "del") {
      window.removeApp(url)
      return `Removed App.`
    } else if (action == "add") {
      window.addApp(url)
      return `Installed App.`
    } else if (action == "list") {
      const apps = phoneApps;
      if (apps.length == 0) {
        return "Please restart the app and try again."
      }
      print('List Of Apps:')
      print('• '+apps.join('\n• '),"#c6c928")
    } else {
      return 'Options: "del" "add" "list"'
    }
  },'- Manage Apps'],

  reload: [function() {
    els = document.getElementsByClassName("pluginscript")
    while(els.length > 0){
      els[0].parentNode.removeChild(els[0]);
    }
    input.blur()
    output.innerHTML = ''
    loadPlugins()
  },'- Reloads plugins.'],
});

function testclean(args) {
  return 'hi' + args
}