"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pair = exports.Parser = void 0;
class Parser {
    static parsePath(path) {
        let position = 0;
        const pathTo = [];
        while (position < path.length) {
            pathTo[position] = path[position].split('/');
            position++;
        }
        return pathTo;
    }
    static parse(line) {
        const args = [];
        const elems = [];
        const kw = /\s*(cd|mkdir|rmdir|touch|rm|ls|pwd|cat|echo|help)\s*/;
        const flags = /\s*-(p|d|r|f|v|c|Q|1|s|S|t|l|E|n|b)+\s*/g;
        const text = /\s*('[^\']+')\s*/;
        const path = /\s*([A-Za-z][A-Za-z0-9_\-\.]*\/?)+\s*/g;
        const re = /[^>]*/;
        let str = line;
        let otherStr = '';
        const index = line.indexOf('>');
        if (index != -1) {
            str = line.slice(0, index);
            otherStr = line.slice(index);
        }
        let elem = str.match(kw);
        if ((elem == null)) {
            throw new Error('Bad command');
        }
        args.push(elem[0].trim());
        str = str.replace(kw, '');
        elem = str.match(flags);
        if (elem != null) {
            for (let i = 0; i < elem.length; i++) {
                elem[i] = elem[i].trim();
            }
            let flagsElem = elem.join('');
            flagsElem = '-' + flagsElem.split('-').join('');
            args.push(flagsElem);
            str = str.replace(flags, '');
        }
        if (args[0] == 'echo') {
            elem = str.match(re);
            if (elem == null) {
                throw new Error('Invalid input');
            }
            args.push(elem[0].trim());
            str = str.replace(re, '');
        }
        else {
            elem = str.match(text);
            if (elem != null) {
                args.push(elem[0]);
                str = str.replace(text, '');
            }
            elem = str.match(path);
            if (elem != null) {
                let string = elem.join('');
                string = string.trim();
                args.push(string);
                str = str.replace(path, '');
            }
        }
        if (str != '') {
            throw new Error('Invalid input');
        }
        if (otherStr != '') {
            elems.push(...otherStr.split(' '));
            if (elems.length > 2) {
                throw new Error('Invalid input');
            }
            for (let i = 0; i < 2; i++) {
                elems[i] = elems[i].trim();
            }
        }
        return new Pair(args, elems);
    }
    static parseFlags(args, supportedFlagsList) {
        return new Set(args
            .filter(option => option.indexOf('-') === 0)
            .map(option => option.replace('-', ''))
            .join('')
            .split('')
            .filter(option => supportedFlagsList.includes(option)));
    }
}
exports.Parser = Parser;
class Pair {
    constructor(elem1, elem2) {
        this.elem1 = elem1;
        this.elem2 = elem2;
    }
    getElem1() {
        return this.elem1;
    }
    getElem2() {
        return this.elem2;
    }
}
exports.Pair = Pair;
//# sourceMappingURL=Parser.js.map