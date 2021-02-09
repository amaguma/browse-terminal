import { FileSystemManager } from './fs/FileSystemManager';
import { FsFile } from './fs/FsFile';
import { Parser } from './Parser';
import { Terminal } from './Terminal';
import './style/style.css';
 
var initialFilesystem = new FileSystemManager();


initialFilesystem
  .addUnit([], new FsFile('tmp.txt', '123123123'));

// initialFilesystem
//   .addUnit([], new FsDir('NewDIR1'));

// initialFilesystem
//   .addUnit(['NewDIR'], new FsFile('more.txt', 'lalalala')); 

// initialFilesystem
//   .addUnit(['NewDIR'], new FsDir('NewDIR2')); 

// initialFilesystem
//   .addUnit(['NewDIR', 'NewDIR2'], new FsFile('more1.txt', 'lalalala')); 

// initialFilesystem.printDir([]);

// initialFilesystem.printDir(['NewDIR']);

var terminal = new Terminal(initialFilesystem);
let str = 'mkdir -p NewDIR1/NewDIR12/NewDIR123 NewDIR2/NewDIR21/NewDIR213';
const elems = Parser.parse(str);
// let str2 = 'ls -l -Q >> file1.txt';
// const elems2 = Parser.parse(str2);
// const elems11 = Parser.parse('cat -n -E file1.txt')
// let str3 = 'cd NewDIR1/NewDIR12';
// const elems3 = Parser.parse(str3);
// const elems10 = Parser.parse('ls -l > file1.txt')
// const elems12 = Parser.parse('ls -l')



// client.mkdir(['NewDIR1/NewDIR12/NewDIR123', 'NewDIR2/NewDIR21/NewDIR213'], flags);
terminal.runCommand(elems);
// terminal.runCommand(elems2);
// terminal.runCommand(elems11);
// terminal.runCommand(elems3);
// terminal.runCommand(elems2);
// terminal.runCommand(elems10);
// terminal.runCommand(elems12);
// terminal.runCommand(elems11);

terminal.handleKeyDownEvent(document.body)

// const term = document.getElementById('terminal');
// if (term != null) {
//   terminal.addWorkLine(term)
// } else {
//   console.log('ЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫы')
// }
// terminal.runCommand(elems3);
// terminal.runCommand(elems4);
// terminal.runCommand(elems2);
// terminal.runCommand(elems5);
// terminal.runCommand(elems6);
// terminal.runCommand(elems8);
// terminal.runCommand(elems2);
// terminal.runCommand(elems7);
// terminal.runCommand(elems2);
// terminal.runCommand(elems9);
// terminal.runCommand(elems10);
// client.cd(['NewDIR1']);
// client.touch(['file1.txt'], flags2, '04 Jan');

// client.cat([['file1.txt']], ['NewDIR12', 'file2.txt'], flags1, 1);
// client.cat([['NewDIR12', 'file2.txt'], ['file1.txt']], ['NewDIR12','NewDIR123', 'file3.txt'], flags1, 1);
// client.cat([['NewDIR12','NewDIR123', 'file3.txt'], ['NewDIR12', 'file2.txt'], ['file1.txt']], ['file51.txt'], flags1, 1);
// client.cat(['file1.txt'], flags4);
// client.echo('123');
// client.cat(['file1.txt'], flags4);
// client.rm([['NewDIR12', 'NewDIR123'], ['NewDIR12'], ['file1.txt']], flags1);
// client.touch([['NewDIR12', 'file2.txt'], ['file3.txt']], flags1);
// client.rm([['file1.txt'], ['NewDIR12']], flags);
// client.pwd();
// client.printContent();
// client.ls(flags3);
console.log('end')
// client.cd(['NewDIR12']);
// client.printContent();
// console.log('end')
// client.touch([['NewDIR12', 'NewDIR123', 'file2.txt']], []);
// client.touch([['NewDIR12', 'file1.txt'], ['NewDIR12', 'NewDIR123', 'file3.txt']], ['r', 'c'])
// client.printContent();
// console.log('end');
// client.cd(['NewDIR12']);
// client.printContent();
// console.log('end');
// client.cd(['NewDIR123']);
// client.printContent();
// console.log('end');
// client.touch(['file1', 'file3'], ['r', 'c']);
// client.pwd();
// initialFilesystem
//   .addUnit(['NewDIR1', 'NewDIR12'], new FsFile('more1.txt', 'lalalala')); 

// client.rmdir(['NewDIR1', 'NewDIR12', 'NewDIR123'],  '');

// client.cd(['NewDIR1', 'NewDIR12', 'NewDIR123']);
// client.cd([]);
// client.cd(['NewDIR2', 'NewDIR21', "NewDIR213"]);
// client.cd(['NewDIR2', '..']);

// client.cd(['NewDIR', 'NewDIR2']);

// client.cd(['..', '..', 'NewDIR']);

// client.cd(['-']);

// client.cd([]);

// client.printContent();
// client.cd(['NewDIR3']);
// client.printContent();


// client.printHistory();

// console.log('321321321321321');

// initialFilesystem.printDir(['NewDIR', 'NewDIR2']);

// console.log(elems)


// const line = 'echo 123 >> NewDIR1/file.txt';
// const tmp = line.slice(0, line.indexOf('>'));
// console.log(tmp)
// const tmp2 = line.slice(line.indexOf('>'));
// console.log(tmp2);


const line = ['ls', '-']
console.log(Parser.parseFlags(line, ['1','l','Q','t','s', 'S']))
