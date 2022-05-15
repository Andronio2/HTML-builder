const path = require('path');
const fname = path.join(__dirname, 'secret-folder');
const fs = require('fs');

fs.readdir(fname, {withFileTypes: true}, (err, files) => {
  files.forEach(file => {
    if (file.isFile()) {
      fs.stat(path.join(fname, file.name), (err, stats) => {
        const fileinfo = path.parse(file.name);
        const size = (stats.size <= 1024) ? stats.size + ' B' : (stats.size / 1000) + ' kB';
        console.log(fileinfo.name + ' - ' + fileinfo.ext.slice(1) + ' - ' + size);
      });
    }
  });
});
