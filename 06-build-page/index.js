const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const distPath = path.join(__dirname, 'project-dist');
const throwErr = (err) => {
  if (err) throw err;
};

process.on('exit', () => process.stdout.write('BUILD CREATED'));

// create dist folder
fs.mkdir(distPath, { recursive: true }, (err) => throwErr(err));


// generate index html from templates
fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
  throwErr(err);

  (function generateFromTemplate() {
    const match = data.match(/{{(.*)}}/i);
    if (match) {
      fs.readFile(path.join(__dirname, 'components', match[1] + '.html'), 'utf-8',(err, html) => {
        throwErr(err);
        data = data.replace(match[0], html);
        generateFromTemplate();
      });
    } else fs.writeFile(path.join(distPath, 'index.html'), data, (err) => throwErr(err));
  })();
});


//copy assets folder
function copyDir(fromPath, toPath) {
  fsPromises.rm(toPath, { force: true, recursive: true })
    .then(() => {
      fsPromises.mkdir(toPath);
      fsPromises.readdir(fromPath)
        .then((data) => {
          data.forEach(file => {
            if (path.extname(file) === '') {
              copyDir(path.join(fromPath, file), path.join(toPath, file));
            } else {
              fsPromises.copyFile(path.join(fromPath, file), path.join(toPath, file));
            }
          });
        });
    })
    .catch((err) => {
      throw err;
    });
}

copyDir(path.join(__dirname, 'assets'), path.join(distPath, 'assets'));


//create css-build
function buildCss() {
  const buildPath = path.join(distPath, 'style.css');
  const srcPath = path.join(__dirname, 'styles');
  fsPromises.writeFile(buildPath, '');

  fsPromises.readdir(srcPath)
    .then((files) => {
      let count = -1;

      (function streamToBundle(){
        count++;
        if (count < files.length) {
          if (path.extname(files[count]) === '.css') {
            const readStream = fs.createReadStream(path.join(srcPath, files[count]));

            readStream.on('data', (chunk) => {
              fs.appendFile(buildPath, chunk, (err) => {
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
}

buildCss();