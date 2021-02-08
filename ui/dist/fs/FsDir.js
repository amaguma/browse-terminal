"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsDir = exports.FS_ROOT_NAME = void 0;
const FsFile_1 = require("./FsFile");
exports.FS_ROOT_NAME = ':';
;
class FsDir {
    constructor(name) {
        this._name = name;
        this.content = new Array();
        this.lastmod = new Date();
        this._type = "DIR" /* DIR */;
    }
    get type() {
        return this._type;
    }
    get name() {
        return this._name;
    }
    get size() {
        let allSize = 0;
        this.content.forEach(item => {
            allSize += item.size;
        });
        this._size = allSize;
        return this._size;
    }
    get parentDir() {
        return this._parentDir;
    }
    add(fsUnit) {
        if (fsUnit instanceof FsFile_1.FsFile) {
            fsUnit.setParentDir(this);
        }
        else {
            fsUnit._parentDir = this;
        }
        this.content.push(fsUnit);
    }
    removeThisDir(unit) {
        unit.parentDir.content.splice(unit.parentDir.content.indexOf(unit), 1);
    }
    remove(unit) {
        this.content.splice(this.content.indexOf(unit), 1);
    }
    get(name) {
        for (const item of this.content) {
            if (item.name == name) {
                return item;
            }
        }
    }
    checkUnit(fsUnit, type) {
        for (const item of this.content) {
            if (item.name == fsUnit && item.type == type) {
                return false;
            }
        }
        return true;
    }
    updateLastMode() {
        this.lastmod = new Date();
    }
}
exports.FsDir = FsDir;
//# sourceMappingURL=FsDir.js.map