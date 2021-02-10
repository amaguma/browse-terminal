import {FileSystemClient} from './fs/FileSystemClient';
import {FileSystemManager} from './fs/FileSystemManager';
import {Parser} from './Parser';
import {Pair} from './Parser';

class Terminal {
    private client: FileSystemClient;
    private historyCommand: HistoryCommand<string>;
    private currentHistoryIndex: number;
    private readonly terminalElem: HTMLDivElement;
    private readonly workLineElem: HTMLDivElement;
    private readonly pathElem: HTMLSpanElement;
    private readonly inputElem: HTMLSpanElement;

    constructor(fileSystem: FileSystemManager) {
        this.client = new FileSystemClient(fileSystem);
        this.historyCommand = new HistoryCommand();
        this.terminalElem = document.createElement('div');
        this.workLineElem = document.createElement('div');
        this.pathElem = document.createElement('span');
        this.inputElem = document.createElement('span');
        this.currentHistoryIndex = this.historyCommand.getLength();
        this.init();
    }

    private init() {
        this.terminalElem.id = 'terminal';
        this.terminalElem.className = 'container';

        this.workLineElem.className = "work__line";
        this.workLineElem.innerHTML = '<span class="initial__entry">guest:</span>';

        this.pathElem.className = 'path';
        this.setPath('/');

        this.inputElem.className = 'input';
        this.inputElem.setAttribute('contenteditable', 'true');
        this.inputElem.setAttribute('autocorrect', 'off');
        this.inputElem.setAttribute('autocapitalize', 'none');
        this.inputElem.setAttribute('autocomplete', 'off');
        this.inputElem.addEventListener('blur', this.handleMouseUp)

        this.workLineElem.appendChild(this.pathElem);
        this.workLineElem.appendChild(this.inputElem);
        this.terminalElem.appendChild(this.workLineElem);
        document.body.appendChild(this.terminalElem);
        document.body.addEventListener('keydown', this.handleKeyDown);
        this.inputElem.focus();
    }

    runCommand(args: Pair<string>): string | undefined {
        const cmd = args.getElem1();
        const additionalArg = args.getElem2();
        const commandName = cmd[0];
        let str: string | undefined;
        if (commandName == 'cd') {
            if (cmd.length == 3) {
                const lastIndex = cmd.length - 1;
                const path = cmd[lastIndex].split('/');
                this.client.cd(path);
            } else if (cmd.length == 2) {
                this.client.cd([]);
            } else {
                throw new Error('Invalid input');
            }
        } else if (commandName == 'mkdir') {
            if (cmd.length != 3) {
                throw new Error('Invalid input');
            }
            const flags = Parser.parseFlags(cmd, ['p']);
            const lastIndex = cmd.length - 1;
            const path = cmd[lastIndex].split(' ');
            this.client.mkdir(path, flags);
        } else if (commandName == 'echo') {
            if (cmd.length != 3) {
                throw new Error('Invalid input');
            }
            const content = this.client.echo(cmd[2]);
            if (additionalArg.length != 0) {
                if (additionalArg[0] == '>>') {
                    this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), content);
                } else if (additionalArg[0] == '>') {
                    this.client.setOutputInTargetFile(additionalArg[1].split('/'), content);
                } else {
                    throw new Error('Invalid input');
                }
            } else {
                str = content;
                console.log(str);
            }
        } else if (commandName == 'rmdir') {
            if (cmd.length != 3) {
                throw new Error('Invalid input');
            }
            const flags = Parser.parseFlags(cmd, ['p']);
            const lastIndex = cmd.length - 1;
            const path = cmd[lastIndex].split('/');
            this.client.rmdir(path, flags);
        } else if (commandName == 'touch') {
            const flags = Parser.parseFlags(cmd, ['c', 'd', 'r']);
            const lastIndex = cmd.length - 1;
            const path = cmd[lastIndex].split(' ');
            if (cmd.length == 3) {
                this.client.touch(path, flags)
            } else if (cmd.length == 4) {
                const param = cmd[2];
                this.client.touch(path, flags, param);
            } else {
                throw new Error('Invalid input');
            }
        } else if (commandName == 'ls') {
            const flags = Parser.parseFlags(cmd, ['1', 'l', 'Q', 't', 's', 'S']);
            if (cmd.length == 2) {
                const content = this.client.ls(flags).join('\n');
                if (additionalArg.length != 0) {
                    if (additionalArg[0] == '>>') {
                        this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), content);
                    } else if (additionalArg[0] == '>') {
                        this.client.setOutputInTargetFile(additionalArg[1].split('/'), content);
                    } else {
                        throw new Error('Invalid input');
                    }
                } else {
                    str = content;
                }
            } else if (cmd.length == 3) {
                const path = cmd[2].split('/');
                const content = this.client.ls(flags, path).join('\n');
                if (additionalArg.length != 0) {
                    if (additionalArg[0] == '>>') {
                        this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), content);
                    } else if (additionalArg[0] == '>') {
                        this.client.setOutputInTargetFile(additionalArg[1].split('/'), content);
                    } else {
                        throw new Error('Invalid input');
                    }
                } else {
                    str = content;
                }
            } else {
                throw new Error('Invalid input');
            }
        } else if (commandName == 'pwd') {
            if (cmd.length > 2) {
                throw new Error('Invalid input');
            }
            const content = this.client.pwd();
            if (additionalArg.length != 0) {
                if (additionalArg[0] == '>>') {
                    this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), content);
                } else if (additionalArg[0] == '>') {
                    this.client.setOutputInTargetFile(additionalArg[1].split('/'), content);
                } else {
                    throw new Error('Invalid input');
                }
            } else {
                str = content;
            }
        } else if (commandName == 'rm') {
            if (cmd.length != 3) {
                throw new Error('Invalid input');
            }
            const flags = Parser.parseFlags(cmd, ['r', 'f', 'v', 'd']);
            const path = cmd[2].split(' ');
            const content = this.client.rm(path, flags)?.join('\n');
            if (additionalArg.length != 0 && content) {
                if (additionalArg[0] == '>>') {
                    this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), content);
                } else if (additionalArg[0] == '>') {
                    this.client.setOutputInTargetFile(additionalArg[1].split('/'), content);
                } else {
                    throw new Error('Invalid input');
                }
            } else {
                str = content;
            }
        } else if (commandName == 'cat') {
            if (cmd.length != 3) {
                throw new Error('Invalid input');
            }
            const flags = Parser.parseFlags(cmd, ['E', 'n', 'b']);
            const path = cmd[2].split(' ');
            const content = this.client.cat(path, flags).join('\n');
            if (additionalArg.length != 0) {
                if (additionalArg[0] == '>>') {
                    this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), content);
                } else if (additionalArg[0] == '>') {
                    this.client.setOutputInTargetFile(additionalArg[1].split('/'), content);
                } else {
                    throw new Error('Invalid input');
                }
            } else {
                str = content;
            }
        } else if (commandName == 'help') {
            if (cmd.length > 2) {
                throw new Error('Invalid input');
            }
            const content = this.client.help().join('\n');
            if (additionalArg.length != 0) {
                if (additionalArg[0] == '>>') {
                    this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), content);
                } else if (additionalArg[0] == '>') {
                    this.client.setOutputInTargetFile(additionalArg[1].split('/'), content);
                } else {
                    throw new Error('Invalid input');
                }
            } else {
                str = content;
            }
        }
        return str;
    }

    commandOutput(line: string) {
        let output: string | undefined;
        try {
            output = this.runCommand(Parser.parse(line));
        } catch (error) {
            output = (error as Error).message;
        }
        if (output) {
            const outputCommand = output.split('\n');
            for (const item of outputCommand) {
                const div = document.createElement('div');
                div.innerHTML = item;
                this.terminalElem.insertBefore(div, this.workLineElem);
            }
        }
    }

    setPath(path: string) {
        this.pathElem.innerText = `(${path})$`
    }

    handleKeyDown = (event: KeyboardEvent) => {
        console.log('index222222222: ' + this.currentHistoryIndex);
        if (event.code == 'Enter') {
            event.preventDefault();
            this.sendCommand(this.inputElem.innerText.trim());
            this.inputElem.innerText = '';
            this.currentHistoryIndex = this.historyCommand.getLength();
        } else if (event.code == 'ArrowUp' || event.code == 'ArrowDown') {
            event.preventDefault();
            this.scrollCommand(event.code);
        }
    }

    handleMouseUp = () => {
        this.inputElem.focus();
    }

    sendCommand(command: string) {
        this.terminalElem.insertBefore(this.workLineElem.cloneNode(true), this.workLineElem);
        if (command !== '') {
            this.historyCommand.add(command);
            this.commandOutput(command);
        }
        const path = this.client.pwd() == '/home' ? '/' : this.client.pwd().slice(5);
        this.setPath(path);
    }

    scrollCommand(str: string) {
        if (this.historyCommand.getLength() == 0) {
            return;
        }
        console.log(this.historyCommand.getList());
        if (str == 'ArrowUp') {
            this.currentHistoryIndex--;
            if (this.currentHistoryIndex < 0) {
                this.currentHistoryIndex = 0;
            }
            this.inputElem.innerText = this.historyCommand.getElem(this.currentHistoryIndex);
        } else if (str == 'ArrowDown') {
            this.currentHistoryIndex++;
            if (this.currentHistoryIndex > this.historyCommand.getLength() - 1) {
                this.currentHistoryIndex = this.historyCommand.getLength();
                this.inputElem.innerText = '';
            } else {
                this.inputElem.innerText = this.historyCommand.getElem(this.currentHistoryIndex);
            }
        }
    }
}

class HistoryCommand<T> {
    private data: T[];
    private lastIndex: number;

    constructor() {
        this.data = [];
        this.lastIndex = 0;
    }

    add(item: T) {
        if (this.lastIndex > 14) {
            this.lastIndex = 14;
            if (this.data[this.lastIndex] == item) {
                return;
            }
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

    getLength(): number {
        return this.data.length;
    }

    getList() {
        return this.data;
    }
}

export {Terminal}
