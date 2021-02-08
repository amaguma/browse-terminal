"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsFile = void 0;
;
class FsFile {
    constructor(name, content) {
        this._name = name;
        this._content = content;
        this.setSize(content);
        this.lastmod = new Date();
        this._type = "FILE" /* FILE */;
    }
    setSize(content) {
        try {
            this._size = new Blob([content]).size;
        }
        catch (error) {
            this._size = Buffer.byteLength(content, 'utf-8');
        }
    }
    get type() {
        return this._type;
    }
    get content() {
        return this._content;
    }
    get name() {
        return this._name;
    }
    get size() {
        return this._size;
    }
    setContent(content) {
        this._content = content;
        this.setSize(this._content);
    }
    concatContent(content) {
        const str = this._content.concat(content);
        this._content = str;
        this.setSize(this._content);
    }
    updateLastMode(param) {
        if (param) {
            this.lastmod = new Date(param);
        }
        else {
            this.lastmod = new Date();
        }
    }
    setParentDir(parrentDir) {
        this._parentDir = parrentDir;
    }
}
exports.FsFile = FsFile;
//# sourceMappingURL=FsFile.js.map