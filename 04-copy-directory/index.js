const path = require('path');
const fs = require('fs');
// const { format } = require('path');

function copyDir(folderFrom, folderTo) {
  fs.rm(folderTo, {force: true, recursive: true}, err => {  // Удаляем старый каталог с вложениями
    if (err) console.log('Del dir',err);
    fs.mkdir(folderTo, { recursive: true }, err => {        // Создаем каталог
      if (err) console.log('MKDIR', err);
      fs.readdir(folderFrom, { withFileTypes: true }, (err, files) => { // Получаем список файлов в каталоге
        for (let file of files) {
          if (file.isDirectory()) {                                     // Если каталог, то рекурсия
            copyDir(path.join(folderFrom, file.name), path.join(folderTo, file.name));
          }
          if (file.isFile()) {                                          // Если файл, то копируем
            fs.copyFile(path.join(folderFrom, file.name), path.join(folderTo, file.name), err => {
              if (err) console.log('Copy file', err);
            });
          }
        }
      });
    });
  });
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
