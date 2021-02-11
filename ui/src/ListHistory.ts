class ListHistory<T> {
    private data: T[];
    private lastIndex: number;
    private length: number;

    constructor(length: number) {
        this.length = length;
        this.data = [];
        this.lastIndex = 0;
    }

    add(item: T) {
        if (this.lastIndex > this.length - 1) {
            if (this.data[this.lastIndex - 1] == item) {
                return;
            }
            this.lastIndex = this.length - 1;
           
            for (let i = 0; i < this.data.length - 1; i++) {
                this.data[i] = this.data[i + 1];
            }
        }
        if (this.data[this.lastIndex - 1] == item) {
            return;
        }
        this.data[this.lastIndex] = item;
        this.lastIndex++;
    }

    getElem(index: number): T {
        return this.data[index];
    }

    getList() {
        return this.data;
    }

    getLength(): number {
        return this.data.length;
    }
}

export { ListHistory } 