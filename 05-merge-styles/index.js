const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');
const stdout = process.stdout;
const stylesFolderPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

process.on('exit', () => {
  stdout.write('css build is ready');
});

fsPromises.writeFile(bundlePath, '');

fsPromises.readdir(stylesFolderPath)
  .then((files) => {
    let count = -1;

    (function streamToBundle(){
      count++;
      if (count < files.length) {
        if (path.extname(files[count]) === '.css') {
          const readStream = fs.createReadStream(path.join(stylesFolderPath, files[count]));

          readStream.on('data', (chunk) => {
            fs.appendFile(bundlePath, chunk, (err) => {
              if (err) throw err;
            });
          });

          readStream.on('close', streamToBundle);
        } else streamToBundle();
      }
    })();
  })
  .catch((err) => {
    throw err;
  });

