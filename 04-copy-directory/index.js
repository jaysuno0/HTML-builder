const path = require('path');
const fs = require('fs/promises');
const filesPath = path.join(__dirname, 'files');
const copyFilesPath = path.join(__dirname, 'copy-files');

function copyDir(fromPath, toPath) {
  fs.mkdir(toPath, { recursive: true });
  fs.readdir(fromPath)
    .then((data) => {
      data.forEach(file => {
        fs.copyFile(path.join(fromPath, file), path.join(toPath, file));
      });
    })
    .catch((err) => {
      throw err;
    });
}

copyDir(filesPath, copyFilesPath);