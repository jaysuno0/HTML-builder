const fs = require('fs/promises');
const path = require('path');
const secretFolderPath = path.join(__dirname, 'secret-folder');
const stdout = process.stdout;

fs.readdir(secretFolderPath, {
  withFileTypes: true,
})
  .then((data) => {
    data.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(secretFolderPath, file.name);
        const fileExtension = path.extname(filePath).slice(1);
        const fileName = file.name.match(/.*(?=\.)/)[0];

        fs.stat(filePath).then(stats => {
          const sizeInKb = Math.ceil(stats.size / 1024);
          stdout.write(`${fileName} - ${fileExtension} - ${sizeInKb}kb \n`);
        });
      } 
    });
  })
  .catch((err) => {
    throw err;
  });