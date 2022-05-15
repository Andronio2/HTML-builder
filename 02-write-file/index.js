const { stdin, stdout} = require('process');
const readline = require('readline');
const path = require('path');
const fname = path.join(__dirname, 'text.txt');

const fs = require('fs');
const fStream = fs.createWriteStream(fname);

fStream.write('');  // Создаем пустой файл
const rl = readline.createInterface({ input: stdin, output: stdout });

stdout.write('Введите текст\n');

process.on('exit', () => {
  rl.close();
  stdout.write('До свидания!\n');
});

rl.on('line', (answer) => {
  // if (answer.indexOf('exit') > -1) {
  if (answer === 'exit') {
    process.exit();
  }
  fStream.write(answer + '\n');
});
