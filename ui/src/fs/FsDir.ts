
import { FsFile } from "./FsFile";

export const FS_ROOT_NAME = ':';

export const enum FileSystemUnitType {
    FILE = 'FILE',
    DIR = 'DIR'
};

class FsDir {
    
    private _name: string;
    private _size!: number;
    public content: Array<FsDir | FsFile>;
    private _parentDir!: FsDir;
    public lastmod: Date;
    private _type: FileSystemUnitType;

    constructor(name: string) {
        this._name = name;
        this.content = new Array();
        this.lastmod = new Date();
        this._type = FileSystemUnitType.DIR;
    }

    get type() {
        return this._type;
    }

    get name(): string {
        return this._name;
    }

    get size(): number {
        let allSize = 0;
        this.content.forEach(item => {
            allSize += item.size
        });
        this._size = allSize;
        return  this._size;
    }

    get parentDir(): FsDir {
        return this._parentDir;
    }

    add(fsUnit: FsDir | FsFile) {
        if (fsUnit instanceof FsFile) {
            fsUnit.setParentDir(this);
        } else {
            fsUnit._parentDir = this;    
        }
        this.content.push(fsUnit);
    }

    removeThisDir(unit: FsDir) {
        unit.parentDir.content.splice(unit.parentDir.content.indexOf(unit), 1);
    }

    remove(unit: FsFile | FsDir) {
        this.content.splice(this.content.indexOf(unit), 1);
    }

    get(name: string) {
        for (const item of this.content) {
            if (item.name == name) {
                return item;
            }
        }
    }

    checkUnit(fsUnit: string, type: FileSystemUnitType): boolean {
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

export { FsDir };
