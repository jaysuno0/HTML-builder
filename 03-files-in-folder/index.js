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
          stdout.write(`${fileName} - ${fileExtension} - ${stats.size}b \n`);
        });
      } 
    });
  })
  .catch((err) => {
    throw err;
  });