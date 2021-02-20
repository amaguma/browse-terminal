import {FileSystem} from './fs/FileSystem';
import {FsFile} from './fs/FsFile';
import {Parser} from './Parser';
import {Terminal} from './Terminal';
import { FsDir } from './fs/FsDir';
import './style/style.css';


var initialFilesystem = new FileSystem();

initialFilesystem.addUnit([], new FsFile('help.txt', 'cd [DIR] - changes the current folder.\n' +
    'mkdir [OPTION] [DIR]... - creates a directory.\n' +
    'rmdir [OPTION] [DIR] - removes a directory if it is empty.\n' +
    'touch [OPTION]... [FILE]... - creates a file.\n' +
    'pwd - shows the path to the current directory.\n' +
    'rm [OPTION]... [FILE]... - removes directory or file.\n' +
    'ls [OPTION]... [DIR] - shows directory contents.\n' +
    'cat [OPTION]... [FILE]... - print the contents of FILE (s) to standard output.\n' +
    'echo [STRING] - print a string to standard output.\n' +
    'clear - clears the window'));

initialFilesystem.addUnit([], new FsDir('programs'));

initialFilesystem.addUnit([], new FsDir('Downloads'));
initialFilesystem.addUnit(['Downloads'], new FsFile('tmp.txt', 'Просто какой-то файл'));
initialFilesystem.addUnit(['Downloads'], new FsFile('doc.txt', 'В ту ночь когда рождались волки'));

initialFilesystem.addUnit([], new FsDir('uni_study'));

initialFilesystem.addUnit(['uni_study'], new FsDir('database'));
initialFilesystem.addUnit(['uni_study','database'], new FsDir('lab1'));
initialFilesystem.addUnit(['uni_study','database', 'lab1'], new FsFile('lab1.docx', 'ER-схема'));
initialFilesystem.addUnit(['uni_study','database'], new FsFile('lab2.docx', '1.	Создать модель семантических объектов для предметной области, выбранной в лабораторной работе №1.'));

initialFilesystem.addUnit(['uni_study'], new FsDir('kursach'));
initialFilesystem.addUnit(['uni_study','kursach'], new FsFile('zapiska.docx', 'Разработка универсальной имитации терминала Linux в браузере'));

initialFilesystem.addUnit(['uni_study'], new FsDir('java'));
initialFilesystem.addUnit(['uni_study','java'], new FsFile('lab1.docx', 'Отчет по первой лабораторной работе'));

initialFilesystem.addUnit(['programs'], new FsDir('Visual Studio'));
initialFilesystem.addUnit(['programs', 'Visual Studio'], new FsFile('README.txt', 'Самая лучшая среда разработки'));

initialFilesystem.addUnit([], new FsDir('bin'));

initialFilesystem.addUnit(['bin'], new FsFile('log.txt', 'webpack 5.23.0 compiled successfully in 179 ms\ni ｢wdm｣: Compiled successfully.'));

var terminal = new Terminal(initialFilesystem);
let cmd = 'echo help >> help.txt';
const elem = Parser.parse(cmd);
terminal.runCommand(elem);



