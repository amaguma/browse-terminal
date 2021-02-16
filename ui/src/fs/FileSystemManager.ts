import { FileSystemUnitType, FsDir, FS_ROOT_NAME } from './FsDir';
import { FsFile } from './FsFile';
import { ListHistory } from '../ListHistory'

class FileSystemManager {
    public fileSystem: Map<FsDir, Array<FsDir | FsFile>>;
    private root: FsDir;
    public historyDir: ListHistory<FsDir>;

    constructor() {
        this.root = new FsDir(FS_ROOT_NAME);
        this.historyDir = new ListHistory(2);
        this.historyDir.add(this.root);
        this.fileSystem = new Map();
        this.fileSystem.set(this.root, this.root.content);
    }

    getRoot() {
        return this.root;
    }

    printDir(path: string[]) {
        const parentDir = this.get(path);
        if (!parentDir) {
            throw new Error('Unit not exists');
        }
        if (!(parentDir instanceof FsDir)) {
            throw new Error('Should be directory');
        }
        const arrayContent = this.fileSystem.get(parentDir);
        if (arrayContent) {
            for (const item of arrayContent) {
                console.log(item);
            }
        }
    } 

    getSizeDir(path: string[]) {
        const parentDir = this.get(path);
        if (!parentDir) {
            throw new Error('Unit not exists');
        }
        if (!(parentDir instanceof FsDir)) {
            throw new Error('Should be directory');
        }
        return parentDir.size;
    }

  

    addUnit(path: string[], unit: FsDir | FsFile): boolean {
        const parentDir = this.get(path);
        if (!parentDir) {
            throw new Error('Unit not exists');
        }
        if (!(parentDir instanceof FsDir)) {
            throw new Error('Should be directory');
        }
        if (!(parentDir.checkUnit(unit.name, FileSystemUnitType.DIR))) {
            throw new Error('Element already exists');
        }
        parentDir.add(unit);
        if (unit instanceof FsDir) {
            this.fileSystem.set(unit, unit.content);
        } 
        return true;
    }

    removeUnit(path: string[], unit: FsDir | FsFile): boolean {
        const parentDir = this.get(path);
        if (!parentDir) {
            throw new Error('Unit not exists');
        }
        if (!(parentDir instanceof FsDir)) {
            throw new Error('Should be directory');
        }
        if (parentDir.checkUnit(unit.name, FileSystemUnitType.DIR)) {
            throw new Error('Element not found');
        }
        parentDir.content.splice(parentDir.content.indexOf(unit), 1);
        if (unit instanceof FsDir) {
            this.fileSystem.delete(unit);
        }
        return true;
    }

    get(fsUnitPath: string[]): FsDir | FsFile {
        if (fsUnitPath.length >= 1) {
            let unit: FsDir | FsFile | undefined;
            let unitPosition = 0;
            do {
                if (unitPosition == 0) {
                    unit = this.root.get(fsUnitPath[unitPosition]);
                } else if (unit && unit instanceof FsDir) {
                    unit = unit.get(fsUnitPath[unitPosition]);
                }
                unitPosition++;
            } while (unitPosition < fsUnitPath.length && unit);
            if (unit == undefined) {
                throw new Error('Unit undefined');
            }
            return unit;
        } else {
            return this.root;
        }
    }
}

export { FileSystemManager };
