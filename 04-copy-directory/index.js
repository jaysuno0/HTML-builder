const path = require('path');
const fs = require('fs/promises');
const filesPath = path.join(__dirname, 'files');
const copyFilesPath = path.join(__dirname, 'copy-files');

function copyDir(fromPath, toPath) {
  fs.rm(toPath, { force: true, recursive: true })
    .then(() => {
      fs.mkdir(toPath);
      fs.readdir(fromPath)
        .then((data) => {
          data.forEach(file => {
            fs.copyFile(path.join(fromPath, file), path.join(toPath, file));
          });
        });
    })
    .catch((err) => {
      throw err;
    });

  process.stdout.write('created a full copy');
}

copyDir(filesPath, copyFilesPath);