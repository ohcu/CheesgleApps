Object.assign(commands,{
  test: function() {
    return 'test message :D'
  },
});

class Term {
  static commands = {
    register: function(cmd, func) {
      console.log('you are registering '+cmd)
    }
  };
}

Term.commands.register('newcmd', (args) => {
  return 'This is a message. '+args;
});