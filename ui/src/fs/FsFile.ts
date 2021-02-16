
import { FsDir, FileSystemUnitType } from "./FsDir";


class FsFile {
    private _content: string;
    private _name: string;
    private _size!: number;
    public _parentDir?: FsDir;
    public lastmod: Date;
    private _type: FileSystemUnitType;

    constructor(name: string, content: string) {
        this._name = name;
        this._content = content;
        this.setSize(content);
        this.lastmod = new Date();
        this._type = FileSystemUnitType.FILE;
    }

    private setSize(content: string) {
        try {
            this._size = new Blob([content]).size;
        } catch (error) {
            this._size = Buffer.byteLength(content, 'utf-8');
        }
    }

    
    get type() {
        return this._type;
    }

    get content() : string {
        return this._content;
    }

    get name() : string {
        return this._name;
    }

    get size() : number {
        return this._size;
    }

    setContent(content: string) {
        this._content = content;
        this.setSize(this._content)
    }

    concatContent(content: string) {
        const str = this._content.concat(content);
        this._content = str;
        this.setSize(this._content)
    }

    updateLastMode(param?: string) {
        if (param) {
            this.lastmod = new Date(param);
        } else {
            this.lastmod = new Date();
        }
        
    }

    setParentDir(parrentDir: FsDir){
        this._parentDir = parrentDir;
    }
}

export { FsFile };