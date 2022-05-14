const {stdout, exit} = process;
const path = require('path');

const fname = path.join(path.dirname(__filename), 'text.txt');  // Формирование пути и имени файла

const fs = require('fs');
const fStream = fs.createReadStream(fname, 'utf-8');

let file = '';
fStream.on('data', data => file += data);
fStream.on('end', () => {
  stdout.write(file);
  exit();
});
fStream.on('error', error => {
  console.log('Error', error.message);
});

