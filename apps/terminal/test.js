Object.assign(commands,{
  test: function() {
    return 'test message :D'
  },
});

term = new class {
  commands() {
   print('nothing lol')
  }
}

term.commands.add = new class {
  add() {
    print('you are adding')
  }
}

term.commands.add('newcmd', () => {
  return 'This is a message.'
});