const path = require('path');
const { rm, mkdir, readdir, copyFile, readFile, writeFile } = require('fs/promises');

const destFolder = path.join(__dirname, 'project-dist');
const styleFolder = path.join(__dirname, 'styles');
const componentFolder = path.join(__dirname, 'components');
const assetsFromFolder = path.join(__dirname, 'assets');
const assetsToFolder = path.join(destFolder, 'assets');

const prepareFolder = async () => {
  return rm(destFolder, { force: true, recursive: true, maxRetries: 100 })  // Очищаем папку
    .then(() => mkdir(destFolder, { recursive: true }))  // Создаем заново
    .catch(err => console.log('PrepareFolder', err));
};

const copyAssets = async (folderFrom, folderTo) => {  // Рекурсивная функция копирования каталога
  return rm(folderTo, { force: true, recursive: true, maxRetries: 100 })  // Удаляем старый каталог с вложениями
    .then(() => {
      return mkdir(folderTo, { recursive: true });       // Создаем каталог
    })
    .then(() => {
      return readdir(folderFrom, { withFileTypes: true }); // Получаем список файлов в каталоге
    })
    .then(files => {
      const mass = [];
      for (let file of files) {
        if (file.isDirectory()) {                                     // Если каталог, то рекурсия
          mass.push(copyAssets(path.join(folderFrom, file.name), path.join(folderTo, file.name)));
        }
        if (file.isFile()) {                                          // Если файл, то копируем
          mass.push(copyFile(path.join(folderFrom, file.name), path.join(folderTo, file.name)));
        }
      }
      return Promise.all(mass);
    })
    .catch(err => console.log('Copy assets', err));
};

const joinCssStyle = async (folderFrom) => {
  return readdir(folderFrom, { withFileTypes: true })
    .then(files => {
      const mass = [];
      files.forEach(file => {
        if (file.isFile() && /\.css$/.test(file.name)) {
          mass.push(readFile(path.join(folderFrom, file.name), { encoding: 'utf8' }));
        }
      });
      return Promise.all(mass)
        .then(cssData => cssData.join('\n'))
        .then(outfile => writeFile(path.join(destFolder, 'style.css'), outfile, { encoding: 'utf8' }));
    });
};

const solveTemplate = async (fileFrom, fileTo, folderFrom) => {
  return readFile(fileFrom, { encoding: 'utf8' }) // Смотрим исходный файл
    .then(content => {
      const mass = content
        .split('\n')
        .map(str => {                             // Проверяем все строки на шаблон
          let res = str.match(/\{\{(\w+?)\}\}/);
          if (!res) {
            return Promise.resolve(str);          // Если нет шаблона, то возвращаем строку
          } else {
            const filename = res[1] + '.html';    // Имя файла из шаблона
            return readFile(path.join(folderFrom, filename), { encoding: 'utf8' })  // Читаем файл шаблона
              .then(templateContent => {
                return templateContent            // Добавляем пробелы перед каждой строкой
                  .split('\n')
                  .map(templateStr => ' '.repeat(res.index) + templateStr)
                  .join('\n');
              });
          }
        });
      return Promise.all(mass);
    })
    .then(mass => {
      const outfile = mass.join('\n');
      return writeFile(fileTo, outfile, { encoding: 'utf8' });
    });
};

const main = async () => {
  return prepareFolder()
    .then(() => {
      const promises = [];
      promises.push(copyAssets(assetsFromFolder, assetsToFolder));
      promises.push(joinCssStyle(styleFolder));
      promises.push(solveTemplate(path.join(__dirname, 'template.html'),
        path.join(destFolder, 'index.html'),
        componentFolder));
      return Promise.all(promises);
    });
};

main().then(() => console.log('Done!'));
