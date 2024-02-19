// example plugin (more later!)

// Adding commands
term.registerCommand('example', () => {
  term.log('normal');
  term.warn('warn');
  term.error('error');
  term.log('\x1b[0;94mcustom color')
});