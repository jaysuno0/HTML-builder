const path = require('path');
const fs = require('fs');
const { stdin, stdout, exit } = process;
const dataFile = fs.createWriteStream(path.join(__dirname, 'data.txt'), 'utf-8');

process.on('exit', () => stdout.write('Have a nice day!'));

stdout.write('Hello! \nEnter the data you want me to save: \n');


stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') exit();
  dataFile.write(data);
});

process.on('SIGINT', exit);

