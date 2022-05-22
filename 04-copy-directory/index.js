const path = require('path');
const fs = require('fs/promises');
const filesPath = path.join(__dirname, 'files');
const copyFilesPath = path.join(__dirname, 'copy-files');

process.on('exit', () => {
  process.stdout.write('created a full copy');
});

function copyDir(fromPath, toPath) {
  fs.rm(toPath, { force: true, recursive: true })
    .then(() => {
      fs.mkdir(toPath);
      fs.readdir(fromPath)
        .then((data) => {
          data.forEach(file => {
            if (path.extname(file) === '') {
              copyDir(path.join(fromPath, file), path.join(toPath, file));
            } else {
              fs.copyFile(path.join(fromPath, file), path.join(toPath, file));
            }
          });
        });
    })
    .catch((err) => {
      throw err;
    });
}

copyDir(filesPath, copyFilesPath);