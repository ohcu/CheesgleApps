// Message when plugin has been loaded
//print("hello from example plugin!",'lightgreen')

// Adding commands
Object.assign(commands,{
  hello: [function(args) {
    // Code here
    return 'Hello, World! '+args; // You can also use the print(); function, returning is optional.
  },'- Example command'], // Command description
});

// Available space for functions and stuff