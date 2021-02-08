"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemManager = void 0;
const FsDir_1 = require("./FsDir");
class FileSystemManager {
    constructor() {
        this.root = new FsDir_1.FsDir(FsDir_1.FS_ROOT_NAME);
        this.historyDir = new Pair();
        this.historyDir.add(this.root);
        this.fileSystem = new Map();
        this.fileSystem.set(this.root, this.root.content);
    }
    getRoot() {
        return this.root;
    }
    printDir(path) {
        const parentDir = this.get(path);
        if (!parentDir) {
            throw new Error('Unit not exists');
        }
        if (!(parentDir instanceof FsDir_1.FsDir)) {
            throw new Error('Should be directory');
        }
        const arrayContent = this.fileSystem.get(parentDir);
        if (arrayContent) {
            for (const item of arrayContent) {
                console.log(item);
            }
        }
    }
    getSizeDir(path) {
        const parentDir = this.get(path);
        if (!parentDir) {
            throw new Error('Unit not exists');
        }
        if (!(parentDir instanceof FsDir_1.FsDir)) {
            throw new Error('Should be directory');
        }
        return parentDir.size;
    }
    addUnit(path, unit) {
        const parentDir = this.get(path);
        if (!parentDir) {
            throw new Error('Unit not exists');
        }
        if (!(parentDir instanceof FsDir_1.FsDir)) {
            throw new Error('Should be directory');
        }
        // if (!(parentDir.checkUnit(unit))) {
        //     throw new Error('Element already exists');
        // }
        parentDir.add(unit);
        if (unit instanceof FsDir_1.FsDir) {
            this.fileSystem.set(unit, unit.content);
        }
        return true;
    }
    removeUnit(path, unit) {
        const parentDir = this.get(path);
        if (!parentDir) {
            throw new Error('Unit not exists');
        }
        if (!(parentDir instanceof FsDir_1.FsDir)) {
            throw new Error('Should be directory');
        }
        // if (parentDir.checkUnit(unit)) {
        //     throw new Error('Element not found');
        // }
        parentDir.content.splice(parentDir.content.indexOf(unit), 1);
        if (unit instanceof FsDir_1.FsDir) {
            this.fileSystem.delete(unit);
        }
        return true;
    }
    get(fsUnitPath) {
        if (fsUnitPath.length >= 1) {
            let unit;
            let unitPosition = 0;
            do {
                if (unitPosition == 0) {
                    unit = this.root.get(fsUnitPath[unitPosition]);
                }
                else if (unit && unit instanceof FsDir_1.FsDir) {
                    unit = unit.get(fsUnitPath[unitPosition]);
                }
                unitPosition++;
            } while (unitPosition < fsUnitPath.length && unit);
            if (unit == undefined) {
                throw new Error('Unit undefined');
            }
            return unit;
        }
        else {
            return this.root;
        }
    }
}
exports.FileSystemManager = FileSystemManager;
class Pair {
    constructor() {
        this.data = [];
        this.lastAddIndex = 0;
    }
    add(item) {
        if (this.lastAddIndex > 1) {
            this.lastAddIndex = 1;
            this.data[0] = this.data[1];
        }
        this.data[this.lastAddIndex] = item;
        this.lastAddIndex++;
    }
    getOldPointer() {
        return this.data[0];
    }
    list() {
        return this.data;
    }
}
//# sourceMappingURL=FileSystemManager.js.map