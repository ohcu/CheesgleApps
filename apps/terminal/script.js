var output = document.getElementById("output");
var input = document.getElementById("input");
var inputForm = document.getElementById("inputForm");
var sleep = ms => new Promise(res => setTimeout(res, ms));

var commands = {
  help: [function() {
    print('Available Commands:')
    for (const [key, value] of Object.entries(commands)) {
      if (value[1]) {
        if (!value[1].includes('*hidden*')) {
          print(`${key} ${value[1]}`,'lightblue');
        }
      } else {
        print(`${key} - No Description`,'lightblue');
      }
    }
  },'- Command List'],
  clear: [function() {
    clearTerminal()
  },'- Clears Terminal'],
  exit: [function() {
    parent.postMessage({type:"close"},"*")
  },'- Exit To Home Page'],
};

async function loadPlugins() {
  plugins = ['https://ohcu.github.io/cheesgle-apps/apps/terminal/plugins/commands.js', 'https://ohcu.github.io/cheesgle-apps/apps/terminal/plugins/test.js']
  failed = []
  print(`loading ${plugins.length} plugin(s)...`,'lightgray')
  for (let i = 0; i < plugins.length; i++) {
    pl = plugins[i]
    plsplit = pl.split('/')
    plshort = plsplit[plsplit.length-1]
    print('loading plugin: ..'+plshort,'gray')
    try {
      await fetch(pl).then((re) => {
        if (re.status == 200) {
          var script = document.createElement('script');
          script.src = pl;
          script.className = "pluginscript"
          script.setAttribute("defer","");
          document.getElementsByTagName('head')[0].appendChild(script);
          print('loaded plugin: ..'+plshort,'green')
        } else {
          print(`failed to fetch. status ${re.status}`,'#FF9494')
          failed.push(plshort)
        }
      })
    } catch (e) {
      print(`An error occurred: ${e}`,'#FF9494');
      failed.push(plshort)
    }
  }
  clearTerminal()
  if (failed.length >= 1) {
    print(`${failed.length} plugin(s) failed to load.`,'#FF9494');
  }
}

let phoneApps = []
window.addEventListener('message', function ({ data }) {
  //print(`received "${data.type}" data.`,'gray')
  if (data.type == "info") {
    phoneApps = data.phoneApps;
  }
  if (data.type == "closing") {
    print('Goodbye!',"lightblue")
  }
});

window.addEventListener("load", (event) => {
  input.focus()
  loadPlugins()
});

function clearTerminal() {
  input.focus()
  output.innerHTML = ''
  print('Cheesgle Terminal v0.1\n','yellow')
  print('Welcome to the cheesgle terminal. Type "help" for a list of commands.')
}

function clearInput() {
  input.value = '';
}

function print(text, clr=null) {
  text = htmlEntities(text)
  if (clr == null) {
    output.innerHTML += text + '\n';
  } else {
    output.innerHTML += '<span style="color:'+clr+';">'+text+'</span>' + '\n';
  }
  output.scrollTop = output.scrollHeight;
  var event = new CustomEvent("textprinted");
  document.dispatchEvent(event);
}

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function handleInput() {
  const command = input.value.trim();
  if (!command) {
    clearInput();
    return;
  }
    
  const parts = command.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);
    
  if (cmd in commands) {
    print(`\n$ ${command}`)
    try {
      var result = commands[cmd][0](args);
    } catch {
      try {
        var result = commands[cmd](args);
      } catch (e) {
        print(`An error occurred: ${e}`,'#FF9494');
        clearInput();
        return;
      }
    }
    if (result != null) {
      print(`${result}`);
    }
  } else {
    print(`\n$ ${command}`);
    print(`Command not found: ${cmd}`,'#FF9494');
  }
    
  clearInput();
}

inputForm.addEventListener('submit', (event) => {
  event.preventDefault();
  handleInput();
});

function closeMenu() {
  var element = document.getElementById("menu");
  element.style.display = "none";
}

function openMenu(type) {
  var element = document.getElementById("menu");
  var rect = event.target.getBoundingClientRect();
  element.style.display = "block";
  element.style.left = (rect.left+110)+"px";
  element.style.top = (rect.top+41)+"px";
}

//command functions
function addApp(URL) {
  phoneApps.push(URL)
  phoneApps = phoneApps.sort((a, b) => {
    return a.localeCompare(b)
  })
  parent.postMessage({
    type: "installApp",
    app: URL
  }, "*")
}

function removeApp(URL) {
  let index = phoneApps.indexOf(URL);
  if (index > -1) {
    phoneApps.splice(index, 1);
  }
  parent.postMessage({
    type: "uninstallApp",
    app: URL
  }, "*")
}
