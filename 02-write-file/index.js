const { stdin, stdout} = require('process');
const readline = require('readline');
const path = require('path');
const fname = path.join(__dirname, 'text.txt');

const fs = require('fs');
const fStream = fs.createWriteStream(fname);

let flag = false;

fStream.write('');  // Создаем пустой файл
const rl = readline.createInterface({ input: stdin, output: stdout });

stdout.write('Введите текст\n');

process.on('exit', () => {
  rl.close();
  if (!flag) {
    stdout.write('До свидания!\n');
    flag = true;
  }
});

rl.on('SIGINT', () => {
  if (!flag) {
    stdout.write('До свидания!\n');
    flag = true;
  }
  process.exit();
})

rl.on('line', (answer) => {
  if (answer.trim() === 'exit') {
    process.exit();
  }
  fStream.write(answer + '\n');
});
