import {FileSystemManager} from './fs/FileSystemManager';
import {FsFile} from './fs/FsFile';
import {Parser} from './Parser';
import {Terminal} from './Terminal';
import { FsDir } from './fs/FsDir';
import './style/style.css';


var initialFilesystem = new FileSystemManager();

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

initialFilesystem.addUnit([], new FsDir('uni_study'));

initialFilesystem.addUnit(['programs'], new FsDir('dir1'));

initialFilesystem.addUnit(['programs'], new FsFile('doc.txt', 'В ту ночь когда рождались волки'));

var terminal = new Terminal(initialFilesystem);
let cmd = 'touch file.txt';
const elem = Parser.parse(cmd);
terminal.runCommand(elem);



