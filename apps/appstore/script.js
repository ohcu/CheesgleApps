const appTemplate = `<div class="app">
  <img>
  <h3>Title</h3>
  <p class="category">Category</p>
  <p>Description</p>
  <span class="install">Install</span>
</div>`

let appsContainer = document.getElementById(`apps`);
let main = document.getElementById(`main`);
let loading = document.getElementById(`loading`);

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

async function loadApps() {
  await fetch(`https://ohcu.github.io/cheesgle-apps/apps/appstore/apps.json`).then(async (r) => {
    if (r.status == 200) {
      let json = await r.json()
      appsContainer.innerHTML = ``
      for (let i = 0; i < json.length; i++) {
        let html = createElementFromHTML(appTemplate)
        
        let appPath = json[i]
        
        let app
        await $.getJSON(appPath+'/package.json', function(data) {
          app = data;
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
    } else {
      loadApps()
    }
  }).catch(console.error)
  loading.hidden = true
  main.hidden = false
}

let phoneApps = []
window.addEventListener('message', function ({ data }) {
  if (data.type == "info") {
    phoneApps = data.phoneApps;
    loadApps()
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