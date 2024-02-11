const appTemplate = `<div class="app">
  <img>
  <h3>Title</h3>
  <p class="category">Category</p>
  <p>Description</p>
  <span class="install">Install</span>
</div>`
const appTemplate2 = `<div class="app">
  <img>
  <h3>Title</h3>
  <p class="category">Category</p>
  <p>Description</p>
  <span class="install">Install</span>
</div>`

let browseContainer = document.getElementById(`browseApps`);
let appsContainer = document.getElementById(`installedApps`);
let loading = document.getElementById(`loading`);
let main = document.getElementById(`apps`);
let installed = document.getElementById(`installed`);

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

async function loadApps() {
  await fetch(`https://ohcu.github.io/cheesgle-apps/apps/appstore/apps.json`).then(async (r) => {
    if (r.status == 200) {
      let json = await r.json()
      browseContainer.innerHTML = ``
      for (let i = 0; i < json.length; i++) {
        let html = createElementFromHTML(appTemplate)
        
        let appPath = json[i]
        
        let app
        await fetch(appPath+`/package.json`).then(async (r) => {
          app = await r.json()
        });

        html.title = `${app.title}\nApp by ${app.author}\nPermissions: ${app.permissions.join(', ')}`
        html.getElementsByTagName(`img`)[0].src = `${appPath}/${app.icon}`
        html.getElementsByTagName(`h3`)[0].innerText = app.title
        html.getElementsByTagName(`p`)[1].innerText = app.description
        html.getElementsByTagName(`p`)[0].innerText = app.category
        let install = html.getElementsByTagName(`span`)[0]
        install.innerText = "Install"
        if (phoneApps.includes(appPath)) {
          install.innerText = "Uninstall"
          install.classList = ["uninstall"]
        }
        install.addEventListener('click', () => {
          if (phoneApps.includes(appPath)) {
            install.innerText = "Install"
            install.classList = ["install"]
            removeApp(appPath)
          }else{
            install.innerText = "Uninstall"
            install.classList = ["uninstall"]
            addApp(appPath)
          }
        });
        browseContainer.appendChild(html)
      }
    } else {
      loadApps()
    }
  }).catch(console.error)
}

async function loadInstalled() {
  appsContainer.innerHTML = ``
  for (let i = 0; i < phoneApps.length; i++) {
    let html = createElementFromHTML(appTemplate2)
   
    if (i.endsWith('/') { i.slice(0,-1); }
    let appPath = i

    let app
    await fetch(appPath+`/package.json`).then(async (r) => {
      console.log(r.json())
      app = await r.json()
    });

    html.title = `${app.title}\nApp by ${app.author}\nPermissions: ${app.permissions.join(', ')}`
    html.getElementsByTagName(`img`)[0].src = `${appPath}/${app.icon}`
    html.getElementsByTagName(`h3`)[0].innerText = app.title
    html.getElementsByTagName(`p`)[1].innerText = app.description
    html.getElementsByTagName(`p`)[0].innerText = app.category
    let install = html.getElementsByTagName(`span`)[0]
    install.innerText = "Install"
    if (phoneApps.includes(appPath)) {
      install.innerText = "Uninstall"
      install.classList = ["uninstall"]
    }
    install.addEventListener('click', () => {
      if (phoneApps.includes(appPath)) {
        install.innerText = "Install"
        install.classList = ["install"]
        removeApp(appPath)
      }else{
        install.innerText = "Uninstall"
        install.classList = ["uninstall"]
        addApp(appPath)
      }
    });
    appsContainer.appendChild(html)
  }
}

let phoneApps = []
window.addEventListener('message', function ({ data }) {
  if (data.type == "info") {
    phoneApps = data.phoneApps;
    await loadApps()
    await loadInstalled()
    goto('main')
  }
});

function addApp(url) {
  phoneApps.push(url)
  phoneApps = phoneApps.sort((a, b) => {
    return a.localeCompare(b)
  })
  parent.postMessage({
    type: "installApp",
    app: url
  }, "*")
  customAlert("Installed app!")
}

function removeApp(url) {
  let index = phoneApps.indexOf(url);
  if (index > -1) {
    phoneApps.splice(index, 1);
  }
  parent.postMessage({
    type: "uninstallApp",
    app: url
  }, "*")
  customAlert("Uninstalled app!")
}

function customAlert(msg) {
  var contents = Array.from(document.getElementById('alertContainer').children)
  var count = 0
  while(contents.includes(msg)){
    count = count + 1
    ctext = count.toString();
    msg = "("+ctext+")"+msg
  }
  const txt = createElementFromHTML('<p id="alert">'+msg+'</p>');
  var append = document.getElementById('alertContainer').appendChild(txt);
  setTimeout(function(){
    document.getElementById('alertContainer').removeChild(append);
  },3000)
}

function loadJSON(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(JSON.parse(xhr.responseText));
      }
      else {
        error(xhr);
      }
    }
  };
  xhr.open('GET', path, true);
  xhr.send();
}

function goto(menu) {
  loading.hidden = true
  main.hidden = true
  installed.hidden = true
  menu.hidden = false
}