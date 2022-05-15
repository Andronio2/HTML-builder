const path = require('path');
const { readdir, readFile, writeFile } = require('fs/promises');

const folderIn = path.join(__dirname, 'styles');
const fileOut = path.join(__dirname, 'project-dist', 'bundle.css');

readdir(folderIn, { withFileTypes: true })
  .then(files => {
    const promises = files.filter(file => file.isFile() && /\.css$/.test(file.name))   // Список css-файлов
      .map(file => readFile(path.join(folderIn, file.name), 'utf-8'));
    Promise.all(promises).then(mass => {
      const outfile = mass.join('\n');
      writeFile(fileOut, outfile).then(() => console.log('done'));
    });
  }).catch(err => console.log(err));
