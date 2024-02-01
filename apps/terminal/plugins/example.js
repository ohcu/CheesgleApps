// message when plugin has been loaded
//print("hello from example plugin!",'lightgreen')

// adding commands
Object.assign(commands,{
  hello: [function(args) {
    // code
    return 'Hello, World! '+args; // you can replace this with print for colors.
  },'- Example command'], // cmd description
});

// available space for more functions and stuff