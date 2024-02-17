var output = document.getElementById("output");
var input = document.getElementById("input");
var inputForm = document.getElementById("inputForm");
var sleep = ms => new Promise(res => setTimeout(res, ms));

var commands = {
  help: [function() {
    term.log('Available Commands:')
    for (const [key, value] of Object.entries(commands)) {
      if (value[1]) {
        if (!value[1].includes('*hidden*')) {
          term.log(`${key} ${value[1]}`,'lightblue');
        }
      } else {
        term.log(`${key} - No Description`,'lightblue');
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

// classes

class Term {
  constructor() {
    this.registerCommand = function(cmd, func) {
      console.log('register '+cmd)
      if (cmd.isArray) { cmd = cmd.join() }
      cmd = cmd.toLowerCase();
      commands[cmd] = func
    }
    this.log = function(text) {
      text = ansiHtml(`${text}\u001b[m`)
      output.innerHTML += text + '\n';
      output.scrollTop = output.scrollHeight;
    }
    this.error = function(text) {
      text = ansiHtml(`\x1b[91;1;4m${text}\u001b[m`)
      output.innerHTML += text + '\n';
      output.scrollTop = output.scrollHeight;
    }
    this.warn = function(text) {
      text = ansiHtml(`\x1b[33;1;4m${text}\u001b[m`)
      output.innerHTML += text + '\n';
      output.scrollTop = output.scrollHeight;
    }
  }
}
let term = new Term

class Byte {
  constructor() {
    // install app
    this.installApp = function(url) {
        phoneApps.push(url)
        phoneApps = phoneApps.sort((a, b) => {
          return a.localeCompare(b)
        })
        parent.postMessage({
          type: "installApp",
          app: url
        }, "*")
        return 'installing app.'
    }
    // uninstall app
    this.uninstallApp = function(url) {
      let index = phoneApps.indexOf(url);
      if (index > -1) {
        phoneApps.splice(index, 1);
      }
      parent.postMessage({
        type: "uninstallApp",
        app: url
      }, "*")
      return 'removing app.'
    }
    // apps list
    this.phoneApps = function() {
      return phoneApps
    }
  }
}
let byte = new Byte


// plugins

async function loadPlugins() {
  plugins = ['./plugins/commands.js', './plugins/test.js']
  failed = []
  term.log(`loading ${plugins.length} plugin(s)...`)
  for (let i = 0; i < plugins.length; i++) {
    pl = plugins[i]
    plsplit = pl.split('/')
    plshort = plsplit[plsplit.length-1]
    term.log(`loading plugin: ../${plshort}`)
    try {
      let skip;
      if (pl.startsWith('http')) {
        await fetch(pl).then((re) => {
          if (re.status != 200) {
            term.error(`failed to fetch. status ${re.status}`)
            failed.push(plshort)
            skip = true
          }
        });
      }
      if (skip) { continue; }
      var script = document.createElement('script');
      script.src = pl;
      script.className = "plugin-script"
      script.setAttribute("defer","");
      document.getElementsByTagName('head')[0].appendChild(script);
      console.log(`loaded plugin: ../${plshort}`)
    } catch (e) {
      term.error(`error loading plugin: ${e}`);
      failed.push(plshort)
    }
  }
  term.log(``)
  clearTerminal()
  term.log(`Cheesgle Terminal v0.1\n\nType 'help' to get help.`)
  if (failed.length >= 1) {
    term.error(`${failed.length} plugin(s) failed to load.`);
  }
  term.log('')
}

// events

let phoneApps = []
window.addEventListener('message', function ({ data }) {
  //term.log(`received "${data.type}" data.`,'gray')
  if (data.type == "info") {
    phoneApps = data.phoneApps;
  }
  if (data.type == "closing") {
    term.log('Goodbye!')
  }
});

window.addEventListener("load", (event) => {
  input.focus()
  loadPlugins()
});

// terminal stuff

function clearTerminal() {
  output.innerHTML = '';
  clearInput();
}

function clearInput() {
  input.value = '';
  inputForm.hidden = false;
  input.focus();
}

function disableInput() {
  clearInput();
  inputForm.hidden = true;
}

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

$('#input').keydown(function(e) {
  if (e.keyCode == 13){
    e.preventDefault();
    handleInput();
  }
});

async function handleInput() {
  const command = input.value.trim();
  command = command.toLowerCase();
  disableInput();

  term.log(`> ${command}`)
  if (!command) { clearInput(); return; }

  let parts = command.split(/\s+/);
  let cmd = parts[0];
  let args = parts.slice(1);

  let keys = Object.keys(commands)
  let cmds = {}
  for (let i = 0; i < keys.length; i++) {
    let split = keys[i].split(',')
    for (let j = 0; j < split.length; j++) {
      cmds[split[j]] = keys[i]
    }
  }
  console.log(cmds)

  if (cmd in cmds) {
    let full = cmds[cmd]
    try {
      await commands[full][0](args);
    } catch (e) {
      try {
        await commands[full](args);
      } catch (e) {
        term.error(`error executing command: ${e}`);
      }
    }
  } else {
    term.log(`command not found: ${cmd}`);
  }
  clearInput();
}

// inputForm.addEventListener('submit', (event) => {
//   event.preventDefault();
//   handleInput();
// });

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