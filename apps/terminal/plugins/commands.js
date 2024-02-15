
// echo command

term.registerCommand('echo', (args) => {
  term.log(args.join(' '));
});

// app command

term.registerCommand('app', (args) => {
  const action = args[0]
  const url = args[1]
  if (action == "remove") {
    term.log(byte.uninstallApp(url))
  } else if (action == "add") {
    term.log(byte.installApp(url))
  } else if (action == "list") {
    const apps = phoneApps;
    if (apps.length == 0) {
      term.warn("please restart the app and try again.");
      return;
    }
    term.log('installed apps on your byte:');
    term.log('- '+apps.join('\n- '));
  } else {
    term.log('command options: \'remove\' \'add\' \'list\'')
  }
});

// plugin commands

term.registerCommand('plugin', (args) => {
  term.warn('this command will come later!')
});

term.registerCommand('reload', () => {
  els = document.getElementsByClassName("plugin-script")
  while(els.length > 0) { els[0].parentNode.removeChild(els[0]); }
  loadPlugins()
});