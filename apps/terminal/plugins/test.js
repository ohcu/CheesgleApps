// legacy
// Object.assign(commands,{
//   test: function() {
//     term.log('test message :D')
//   },
// });

// test commands

term.registerCommand(['test','testalias'], async (args) => {
  term.log('test message '+args);
  await sleep(1000);
  term.warn('warning');
  await sleep(1000);
  term.error('error');
});

term.registerCommand('colors', () => {
  for (var i = 0, _pj_a = 16; i < _pj_a; i += 1) {
    txt = "";
    for (var j = 0, _pj_b = 16; j < _pj_b; j += 1) {
      code = (i * 16 + j).toString();
      txt = txt + "\u001b[48;5;" + code + "m " + code.padEnd(4);
    }
    term.log(txt)
  }
});