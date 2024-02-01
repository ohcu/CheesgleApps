var ThemeTest = 0;

Object.assign(commands,{
  themetest: function() {
    ThemeTest = 1;
    return ':)';
  }
})

document.addEventListener("textprinted", function(){
  if (ThemeTest == 1) {
    theme()
  }
});

function theme() {
  body = document.getElementsByTagName("body")[0];
  els = document.getElementsByTagName("*");
  body.style.background = '#59294e';
  for (const el of els) {
    el.style.color = '#ffefef';
  }
}