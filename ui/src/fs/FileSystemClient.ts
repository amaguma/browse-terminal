
import { FileSystemManager } from "./FileSystemManager";
import { FileSystemUnitType, FsDir } from "./FsDir";
import { FsFile } from "./FsFile";
import { Parser } from "../Parser"

const enum Comands {
    CD = 'cd [DIR] - changes the current folder.',
    MKDIR = 'mkdir [OPTION] [DIR] - creates a directory.',
    RMDIR = 'rmdir [OPTION] [DIR] - removes a directory if it is empty.',
    TOUCH = 'touch [OPTION]... [FILE]... - creates a file.',
    PWD = 'pwd - shows the path to the current directory.',
    RM = 'rm [OPTION]... [FILE]... - removes directory or file.',
    LS = 'ls [OPTION]... [DIR] - shows directory contents.',
    CAT = 'cat [OPTION]... [FILE]... - print the contents of FILE (s) to standard output.',
    ECHO = 'echo [STRING] - print a string to standard output.'
};

class FileSystemClient {
    private home: FileSystemManager;
    private pointer: FsDir;
    
    constructor(home: FileSystemManager) {
        this.home = home;
        this.pointer = home.getRoot();
    }

    cd(pathTo: string[]): boolean {
        const currentDir = this.pointer;
        if (pathTo.length > 0) {
            if (pathTo.length == 1 && pathTo[0] == '-') {
                this.pointer = this.home.historyDir.getOldPointer();
            } else {
                let childDir: FsDir | FsFile | undefined;
                let position = 0;
                do {
                   if (pathTo[position] == '..') {
                        if (this.pointer == this.home.getRoot()) {
                            this.pointer == this.home.getRoot();
                        } else {
                            this.pointer = this.pointer.parentDir;
                        }
                    } else {
                        if (pathTo[position] == 'home' && position == 0) {
                            this.pointer = this.home.getRoot();
                        } else {
                            childDir = this.pointer.get(pathTo[position]);
                            if (!childDir) {
                                this.pointer = currentDir;
                                throw new Error(`${pathTo.join('/')} not found`);
                            }
                            if (!(childDir instanceof FsDir)) {
                                this.pointer = currentDir;
                                throw new Error(`${pathTo.join('/')} is not a directory`);
                            }
                            this.pointer = childDir;
                        }
                    } 
                    position++;
                } while (position < pathTo.length);
            }
        } else {
            this.pointer = this.home.getRoot();
        }
        this.home.historyDir.add(this.pointer);
        return true;
    }

    mkdir(path: string[], flags: Set<string>): boolean {
        const pathTo: string[][] = Parser.parsePath(path);
        if (pathTo.length == 0) {
            throw new Error('Invalid input');
        }
        let position = 0;
        let elem = 0;
        const currentDir = this.pointer;
        if (flags.size == 0) {
            while(position < pathTo.length) {
                if (pathTo[position].length == 1) {
                    this.addDir(pathTo[position][0]);
                } else {
                    const indexElem = pathTo[position].length - 1;
                    this.cd(pathTo[position].slice(0, indexElem));
                    this.addDir(pathTo[position][indexElem]);
                }
                this.pointer = currentDir;
                position++;
            }
        } else {
            if (this.hasAll(flags, 'p') && flags.size == 1) {
                while(position < pathTo.length) {
                    while (elem < pathTo[position].length) {
                        const childDir = this.addDir(pathTo[position][elem]);
                        this.pointer = childDir;
                        elem++;
                    }
                    this.pointer = currentDir;
                    position++;
                    elem = 0;
                }
            } else {
                throw new Error('Invalid flag');
            }
        }
        return true;
    }

    rmdir(pathTo: string[], flags: Set<string>): boolean {
        if (pathTo.length == 0) {
            throw new Error('Invalid input');
        }
        let position = 0;
        const currentDir = this.pointer; 
        if (flags.size == 0) {
            this.cd(pathTo.slice(0, pathTo.length))
            if (this.pointer.content.length == 0) {
                this.pointer.parentDir.removeThisDir(this.pointer);
            } else {
                throw new Error('Directory must be empty');
            }
            this.pointer = currentDir;
        } else {
            if (this.hasAll(flags, 'p') && flags.size == 1) {
                while(position < pathTo.length) {
                    this.cd(pathTo.slice(0, pathTo.length - position))
                    if (this.pointer.content.length == 0) {
                        this.pointer.parentDir.removeThisDir(this.pointer);
                    } else {
                        throw new Error('Directory must be empty');
                    }
                    this.pointer = currentDir;
                    position++;
                }
            } else {
                throw new Error('Invalid flag');
            }
        }
        return true;
    }

    touch(path: string[], flags: Set<string>, param?: string): boolean {
        const pathTo: string[][] =  Parser.parsePath(path);
        if (pathTo.length == 0) {
            throw new Error('Invalid input');
        }
        if ((param && !this.hasAll(flags, 'd')) || (!param && this.hasAll(flags, 'd'))) {
            throw new Error('Invalid input');
        }
        let position = 0;
        const currentDir = this.pointer;
        if (flags.size == 0 || (this.hasAll(flags, 'c') && flags.size == 1)) {
            while(position < pathTo.length) {
                if (pathTo[position].length == 1) {
                    this.createFile(pathTo[position][0], this.hasAll(flags, 'c'));
                } else {
                    const indexElem = pathTo[position].length - 1;
                    this.cd(pathTo[position].slice(0, indexElem));
                    this.createFile(pathTo[position][indexElem], this.hasAll(flags, 'c'));
                }
                position++;
                this.pointer = currentDir;
            }
        } else {
            if (this.hasAll(flags, 'd')) {
                while(position < pathTo.length) {
                    if (pathTo[position].length == 1) {
                        this.createFile(pathTo[position][0], this.hasAll(flags, 'c'), param)
                    } else {
                        const indexElem = pathTo[position].length - 1;
                        this.cd(pathTo[position].slice(0, indexElem));
                        this.createFile(pathTo[position][indexElem], this.hasAll(flags, 'c'), param)
                    }
                    position++;
                    this.pointer = currentDir;
                }
            } else if (this.hasAll(flags, 'r')) { 
                if (pathTo.length != 2) {
                    throw new Error('Invalid input');
                }
                if (pathTo[0].length == 1) {
                    const file1 = this.getFile(pathTo[0][0]);
                    if (pathTo[1].length == 1) {
                        this.pushLastMode(pathTo[1][0], file1, this.hasAll(flags, 'c'));
                    } else {
                        const indexElem = pathTo[1].length - 1;
                        this.cd(pathTo[1].slice(0, indexElem));
                        this.pushLastMode(pathTo[1][indexElem], file1, this.hasAll(flags, 'c'));
                    }
                } else {
                    const indexElem = pathTo[0].length - 1;
                    this.cd(pathTo[0].slice(0, indexElem));
                    const file1 = this.getFile(pathTo[0][indexElem]);
                    this.pointer = currentDir;
                    if (pathTo[1].length == 1) {
                        this.pushLastMode(pathTo[1][0], file1, this.hasAll(flags, 'c'));
                    } else {
                        const indexElem = pathTo[1].length - 1;
                        this.cd(pathTo[1].slice(0, indexElem));
                        this.pushLastMode(pathTo[1][indexElem], file1, this.hasAll(flags, 'c'));
                    } 
                }
                this.pointer = currentDir;
            } else {
                throw new Error('Invalid flag');
            }
        }
        return true;
    }

    pwd() {
        const elemOfPath = [];
        const currentDir = this.pointer; 
        while(this.pointer != this.home.getRoot()) {
            elemOfPath.push(this.pointer.name);
            this.pointer = this.pointer.parentDir;
        }
        this.pointer = currentDir;
        elemOfPath.push('home');
        const path = '/' + elemOfPath.reverse().join('/');
        console.log(path);
        return path;
    }

    rm(path: string[], flags: Set<string>) {
        const pathTo: string[][] =  Parser.parsePath(path); 
        if (pathTo.length == 0) {
            throw new Error('Invalid input')
        }
        let position = 0;
        const currentDir = this.pointer;
        if (flags.size == 0) {
            const str: string[] = [];
            while(position < pathTo.length) {
                if (pathTo[position].length == 1) {
                    const elemDel  = this.deleteFile(pathTo[position][0], str);
                    this.messageErrorFile(pathTo[position][0], elemDel);
                } else {
                    const indexElem = pathTo[position].length - 1;
                    this.cd(pathTo[position].slice(0, indexElem));
                    const elemDel = this.deleteFile(pathTo[position][indexElem], str);
                    this.messageErrorFile(pathTo[position][indexElem], elemDel);
                }
                position++;
                this.pointer = currentDir;
            }
        } else { 
            if (this.hasAll(flags, 'r', 'f', 'v') && flags.size == 3) {
                const str: string[] = [];
                while(position < pathTo.length) {
                    if (pathTo[position].length == 1) {
                        this.deleteDir(pathTo[position][0], str);
                    } else {
                        const indexElem = pathTo[position].length - 1;
                        this.cd(pathTo[position].slice(0, indexElem));
                        this.deleteDir(pathTo[position][indexElem], str);
                    }
                    position++;
                    this.pointer = currentDir;
                }
                for (let i = 0; i < str.length; i++) {
                    str[i] = 'removed ' + str[i];
                }
                str.map(item => {
                    console.log(item);
                });
                return str;
            } else if (this.hasAll(flags, 'r', 'v') && flags.size == 2) {
                const str: string[] = [];
                while(position < pathTo.length) {
                    if (pathTo[position].length == 1) {
                        const elemDel = this.deleteDir(pathTo[position][0], str);
                        this.messageErrorDir(pathTo[position][0], elemDel);
                    } else {
                        const indexElem = pathTo[position].length - 1;
                        this.cd(pathTo[position].slice(0, indexElem));
                        const elemDel = this.deleteDir(pathTo[position][indexElem], str);
                        this.messageErrorDir(pathTo[position][indexElem], elemDel);
                    }
                    position++;
                    this.pointer = currentDir;
                }
                for (let i = 0; i < str.length; i++) {
                    str[i] = 'removed ' + str[i];
                }
                str.map(item => {
                    console.log(item);
                });
                return str;
            } else if (this.hasAll(flags, 'r', 'f') && flags.size == 2) {
                const str: string[] = [];
                while(position < pathTo.length) {
                    if (pathTo[position].length == 1) {
                        this.deleteDir(pathTo[position][0], str);
                    } else {
                        const indexElem = pathTo[position].length - 1;
                        this.cd(pathTo[position].slice(0, indexElem));
                        this.deleteDir(pathTo[position][indexElem], str);
                    }
                    position++;
                    this.pointer = currentDir;
                }
            } else if (this.hasAll(flags, 'v', 'f') && flags.size == 2) {
                const str: string[] = [];
                while(position < pathTo.length) {
                    if (pathTo[position].length == 1) {
                        const elemDel  = this.deleteFile(pathTo[position][0], str);
                        if (elemDel instanceof FsDir) {
                            this.deleteDir(pathTo[position][0], str);
                        }
                    } else {
                        const indexElem = pathTo[position].length - 1;
                        this.cd(pathTo[position].slice(0, indexElem));
                        const elemDel = this.deleteFile(pathTo[position][indexElem], str);
                        if (elemDel instanceof FsDir) {
                            this.deleteDir(pathTo[position][indexElem], str);
                        }
                    }
                    position++;
                    this.pointer = currentDir;
                }
                for (let i = 0; i < str.length; i++) {
                    str[i] = 'removed ' + str[i];
                }
                str.map(item => {
                    console.log(item);
                });
                return str;
            } else if (this.hasAll(flags, 'r') && flags.size == 1) {
                const str: string[] = [];
                while(position < pathTo.length) {
                    if (pathTo[position].length == 1) {
                        const elemDel = this.deleteDir(pathTo[position][0], str);
                        this.messageErrorDir(pathTo[position][0], elemDel);
                    } else {
                        const indexElem = pathTo[position].length - 1;
                        this.cd(pathTo[position].slice(0, indexElem));
                        const elemDel = this.deleteDir(pathTo[position][indexElem], str);
                        this.messageErrorDir(pathTo[position][indexElem], elemDel);
                    }
                    position++;
                    this.pointer = currentDir;
                }
            } else if (this.hasAll(flags, 'v') && flags.size == 1) {
                const str: string[] = [];
                while(position < pathTo.length) {
                    if (pathTo[position].length == 1) {
                        const elemDel  = this.deleteFile(pathTo[position][0], str);
                        if (elemDel instanceof FsDir) {
                            this.deleteDir(pathTo[position][0], str);
                        }
                        this.messageError(pathTo[position][0], elemDel);
                    } else {
                        const indexElem = pathTo[position].length - 1;
                        this.cd(pathTo[position].slice(0, indexElem));
                        const elemDel = this.deleteFile(pathTo[position][indexElem], str);
                        if (elemDel instanceof FsDir) {
                            this.deleteDir(pathTo[position][indexElem], str);
                        }
                        this.messageError(pathTo[position][indexElem], elemDel);
                    }
                    position++;
                    this.pointer = currentDir;
                }
                for (let i = 0; i < str.length; i++) {
                    str[i] = 'removed ' + str[i];
                }
                str.map(item => {
                    console.log(item);
                });
                return str;
            } else if (this.hasAll(flags, 'f') && flags.size == 1) {
                const str: string[] = [];
                while(position < pathTo.length) {
                    if (pathTo[position].length == 1) {
                        this.deleteFile(pathTo[position][0], str);
                    } else {
                        const indexElem = pathTo[position].length - 1;
                        this.cd(pathTo[position].slice(0, indexElem));
                        this.deleteFile(pathTo[position][indexElem], str);
                    }
                    position++;
                    this.pointer = currentDir;
                }
            } else if (this.hasAll(flags, 'd') && flags.size == 1) {
                while(position < pathTo.length) {
                    this.rmdir(pathTo[position], new Set<string>([]));
                    position++;
                }
            } else {
                throw new Error('Invalid flag');
            }
        }
    }

    ls(flags: Set<string>, pathTo?: string[]) {
        const elems: Array<FsDir | FsFile> = [];
        const str: string[] = [];
        const currentDir = this.pointer;
        if (pathTo) {
            this.cd(pathTo);
        }
        this.pointer.content.map(item => {
            elems.push(item);
            str.push(item.name);
        });
        if (this.hasAll(flags, 'Q')) {
            for (let i = 0; i < str.length; i++) {
                str[i] = '"' + str[i] + '"';
            }
        } 
        if (this.hasAll(flags, 'S')) {
            for (let i = 0; i < elems.length - 1; i++) {
                for (let j = i + 1; j < elems.length; j++) {
                    if (elems[i].size < elems[j].size) {
                        this.swap(elems, i, j);
                        this.swap(str, i, j);
                    }
                }
            } 
        }
        if (this.hasAll(flags, 't')) {
            for (let i = 0; i < elems.length - 1; i++) {
                for (let j = i + 1; j < elems.length; j++) {
                    if (elems[i].lastmod < elems[j].lastmod) {
                        this.swap(elems, i, j);
                        this.swap(str, i, j);
                    }
                }
            } 
        }
        if (this.hasAll(flags, 'l')) {
            let sum = 0;
            for (let i = 0; i < elems.length; i++) {
                if (elems[i] instanceof FsFile) {
                    sum += elems[i].size;
                }
                str[i] = this.collectString(elems[i]) + str[i];
            } 
            str.push('total ' + sum);  
        }
        if (this.hasAll(flags, 's')) {
            let sum = 0; 
            for (let i = 0; i < elems.length; i++) {
                if (elems[i] instanceof FsFile) {
                    str[i] = elems[i].size.toString() + ' ' + str[i];
                    sum += elems[i].size;
                } else {
                    str[i] = '0 ' + str[i];
                }
                
            } 
            if (!(str.includes('total ' + sum))) {
                str.push('total ' + sum);
            }
        }
        if (str.length > elems.length) {
            const sumElem = str.pop();
            if (sumElem) {
                str.unshift(sumElem)
            }
        }
        str.map(item => {
            console.log(item);
        });
        this.pointer = currentDir;
        return str;
    }

    cat(source: string[], flags: Set<string>) {
        const sourcePath: string[][] =  Parser.parsePath(source);
        const currentDir = this.pointer;
        let str: string[] = [];
        let position = 0;
        if (sourcePath.length == 0) {
            throw new Error('Invalid input');
        }
        while (position < sourcePath.length) {
            this.getContentInSourceFile(sourcePath, str, position);
            this.pointer = currentDir;
            position++;
        }
        if (this.hasAll(flags, 'E')) {
            const fullContent = str.join('\n');
            str = fullContent.split('\n');
            for(let i = 0; i < str.length; i++) {
                str[i] = str[i] + '$';
            }
        }
        if (this.hasAll(flags, 'n')) {
            const fullContent = str.join('\n');
            str = fullContent.split('\n');
            for(let i = 0; i < str.length; i++) {
                str[i] = '\t' + (i + 1) + ' ' + str[i];
            }
        } else if (this.hasAll(flags, 'b')) {
            const fullContent = str.join('\n');
            str = fullContent.split('\n');
            let counter = 1;
            for(let i = 0; i < str.length; i++) {
                if (str[i] != '') {
                    str[i] = '\t' + counter + ' ' + str[i];
                    counter++;
                }
            }
        }
        console.log(str.join('\n'));
        return str;
    }

    echo(content: string) {
        return content;
    }

    setOutputInTargetFile(targetPath: string[], content: string) {
        if (targetPath.length == 0) {
            throw new Error('Invalid input');
        }
        const currentDir = this.pointer;
        this.putInTargetFile(targetPath, content, 1);
        this.pointer = currentDir;
    }

    cancateOutputInTargetFile(targetPath: string[], content: string) {
        if (targetPath.length == 0) {
            throw new Error('Invalid input');
        }
        const currentDir = this.pointer;
        this.putInTargetFile(targetPath, content, 2);
        this.pointer = currentDir;
    }

    help() {
        const str = [
            Comands.CD,
            Comands.MKDIR,
            Comands.RMDIR,
            Comands.TOUCH,
            Comands.PWD,
            Comands.RM,
            Comands.LS,
            Comands.CAT,
            Comands.ECHO
        ];
        str.map(item => {
            console.log(item);
        })
        return str;
    }

    private getContentInSourceFile(source: string[][], str: string[], index: number) {
        if (source[index].length == 1) {
            this.getContentFile(source[index][0], str);
        } else {
            const indexElem = source[index].length - 1;
            this.cd(source[index].slice(0, indexElem));
            this.getContentFile(source[index][indexElem], str);
        }
    }

    private putInTargetFile(target: string[], content: string, counter: number) {
        if (target.length == 1) {
            this.pushContentFile(target[0], content, counter);
        } else {
            const indexElem = target.length - 1;
            this.cd(target.slice(0, indexElem));
            this.pushContentFile(target[indexElem], content, counter);
        }
    }

    private pushContentFile(path: string, str: string, counter: number) {
        this.touch([path], new Set<string>([]));
        const file = this.pointer.get(path);
        if (file instanceof FsFile) {
            if (counter == 1) {
                file.setContent(str);
            }
            if (counter == 2) {
                if (file.content != '') {
                    file.concatContent('\n' + str);
                } else {
                    file.concatContent(str);
                }
            }
        }
        this.messageErrorFile(path, file);
    }

    private getContentFile(path: string, str: string[]) {
        const file = this.pointer.get(path);
        if (file instanceof FsFile) {
            str.push(file.content);
        }
        this.messageErrorFile(path, file);
    }

    private collectString(elem: FsDir | FsFile) {
        const str = elem.size + ' ' + this.getMonth(elem.lastmod.getMonth()) + ' ' + this.checkTime(elem.lastmod.getDate()) + ' ' + this.checkTime(elem.lastmod.getHours()) + ':' + this.checkTime(elem.lastmod.getMinutes())  + ' ';
        return str;
    }

    private checkTime(time: number) {
        if (time < 10) {
            return '0' + time;
        }
        return time;
    }

    private hasAll<T>(set: Set<T>, ...elems: T[]): boolean {
        for (const elem of elems) {
            if (!set.has(elem)) {
                return false;
            }
        }
        return true;
    }

    private deleteFile(path: string, str: string[]) {
        const fileInp = this.pointer.get(path);
        if (fileInp instanceof FsFile) {
            str.push(fileInp.name);
            this.pointer.remove(fileInp);
        } 
        return fileInp;
    }

    private deleteDir(path: string, str: string[]) {
        const dirInp = this.pointer.get(path);
        if (dirInp instanceof FsDir) {
            str.push(...this.removeAll(dirInp));
        }
        return dirInp;
    }

    private messageErrorFile(path: string, elem?: FsDir | FsFile) {
        if (!elem) {
            throw new Error(`${path} not found`);
        }
        if (elem instanceof FsDir) {
            throw new Error(`${path} is directory`);
        } 
    }

    private messageErrorDir(path: string, elem?: FsDir | FsFile) {
        if (!elem) {
            throw new Error(`${path} not found`);
        }
        if (elem instanceof FsFile) {
            throw new Error(`${path} is file`);
        } 
    }

    private messageError(path: string, elem?: FsDir | FsFile) {
        if (!elem) {
            throw new Error(`${path} not found`);
        }
    }

    private createFile(path: string, availability: boolean, param?: string) {
        const fileInp = this.pointer.get(path);
        if (!(fileInp instanceof FsFile) && !availability) {
            const file = new FsFile(path, '')
            file.updateLastMode(param);
            this.pointer.add(file);
        } else if (fileInp instanceof FsFile) {
            fileInp.updateLastMode(param);
        } 
    }

    private pushLastMode(path: string, file: FsFile, availability: boolean) {
        const fileInp = this.pointer.get(path);
        if (!(fileInp instanceof FsFile) && !availability) {
            const file2 = new FsFile(path, '')
            file2.lastmod = file.lastmod;
            this.pointer.add(file2);
        } else if (fileInp instanceof FsFile) {
            fileInp.lastmod = file.lastmod;
        } 
    }

    private getFile(path: string): FsFile {
        const file1 = this.pointer.get(path);
        if (!(file1 instanceof FsFile)) {
            throw new Error(`${path} not found`);
        }    
        return file1;       
    }

    private removeAll(dir: FsDir): string[] {
        const str = [];
        while(dir.content.length > 0) {
            const elem = dir.content.pop();
            if (elem) {
                str.push(elem.name);
            }
            if (elem instanceof FsDir) {
                str.push(...this.removeAll(elem));
            }
        }
        if (dir.parentDir.get(dir.name)) {
            dir.parentDir.content.splice(dir.parentDir.content.indexOf(dir), 1);
            str.push(dir.name);
        }
        return str;
    }

    private addDir(path: string): FsDir {
        if (!(this.pointer.checkUnit(path, FileSystemUnitType.DIR))) {    
            throw new Error('Directory already exists');
        }
        const childDir = new FsDir(path);
        this.pointer.add(childDir);
        return childDir;
    }

    private swap<T>(array: T[], i: number, j: number) {
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }

    private getMonth(index: number){
        let month: string;
        switch(index){
            case 0: {
                month = 'Jan';
                break;
            }
            case 1: {
                month = 'Feb';
                break;
            }
            case 2: {
                month = 'Mar';
                break;
            }
            case 3: {
                month = 'Apr';
                break;
            }
            case 4: {
                month = 'May';
                break;
            }
            case 5: {
                month = 'Jun';
                break;
            }
            case 6: {
                month = 'Jul';
                break;
            }
            case 7: {
                month = 'Aug';
                break;
            }
            case 8: {
                month = 'Sept';
                break;
            }
            case 9: {
                month = 'Oct';
                break;
            }
            case 10: {
                month = 'Nov';
                break;
            }
            case 11: {
                month = 'Dec';
                break;
            }
            default: {
                throw new Error('error')
            }
        }
        return month;
    }
}

export { FileSystemClient }
