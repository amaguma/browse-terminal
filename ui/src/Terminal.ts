import {FileSystemClient} from './fs/FileSystemClient';
import {FileSystemManager} from './fs/FileSystemManager';
import {Parser, Pair} from './Parser';
import { ListHistory } from './ListHistory'

class Terminal {
    private client: FileSystemClient;
    private historyCommand: ListHistory<string>;
    private currentHistoryIndex: number;
    private readonly terminalElem: HTMLDivElement;
    private readonly workLineElem: HTMLDivElement;
    private divParam!: HTMLDivElement;
    private readonly pathElem: HTMLSpanElement;
    private readonly inputElem: HTMLSpanElement;
    private inputParam: HTMLSpanElement; 
    private isFocus: boolean;

    constructor(fileSystem: FileSystemManager) {
        this.client = new FileSystemClient(fileSystem);
        this.historyCommand = new ListHistory(15);
        this.terminalElem = document.createElement('div');
        this.workLineElem = document.createElement('div');
        this.pathElem = document.createElement('span');
        this.inputElem = document.createElement('span');
        this.inputParam = document.createElement('span'); 
        this.currentHistoryIndex = this.historyCommand.getLength();
        this.isFocus = true;
        this.init();
    }

    private init() {
        this.terminalElem.id = 'terminal';
        this.terminalElem.className = 'container';

        this.workLineElem.className = 'work__line';
        this.workLineElem.innerHTML = '<span class="initial__entry">guest:</span>';

        this.pathElem.className = 'path';
        this.setPath('/');

        this.inputElem.className = 'input__cmd';
        this.inputElem.setAttribute('contenteditable', 'true');
        this.inputElem.setAttribute('autocorrect', 'off');
        this.inputElem.setAttribute('autocapitalize', 'none');
        this.inputElem.setAttribute('autocomplete', 'off');
        this.inputElem.addEventListener('blur', this.handleMouseUpInputCmd);

        this.inputParam = this.inputElem.cloneNode(true) as HTMLSpanElement;   
        this.inputParam.className = 'input__param'    

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
            const flags = Parser.parseFlags(cmd, ['-help']);
            if (cmd.length == 3) {
                const lastIndex = cmd.length - 1;
                const path = cmd[lastIndex].split('/');
                str = this.client.cd(path, flags);
            } else if (cmd.length == 2) {
                str = this.client.cd([], flags);
            } else {
                throw new Error('Invalid input');
            }
        } else if (commandName == 'mkdir') {
            const flags = Parser.parseFlags(cmd, ['p', '-help']);
            const lastIndex = cmd.length - 1;
            const path = cmd[lastIndex].split(' ');
            str = this.client.mkdir(path, flags);
        } else if (commandName == 'echo') {
            if (cmd.length != 3) {
                throw new Error('Invalid input');
            }
            const content = this.client.echo(cmd[1]);
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
        } else if (commandName == 'rmdir') {
            const flags = Parser.parseFlags(cmd, ['p', '-help']);
            const lastIndex = cmd.length - 1;
            const path = cmd[lastIndex].split('/');
            str = this.client.rmdir(path, flags);
        } else if (commandName == 'touch') {
            const flags = Parser.parseFlags(cmd, ['c', 'd', 'r', '-help']);
            const lastIndex = cmd.length - 1;
            const path = cmd[lastIndex].split(' ');
            if (cmd.length == 3 || cmd.length == 2) {
                str = this.client.touch(path, flags)
            } else if (cmd.length == 4) {
                const param = cmd[2];
                str = this.client.touch(path, flags, param);
            } else {
                throw new Error('Invalid input');
            }
        } else if (commandName == 'ls') {
            const flags = Parser.parseFlags(cmd, ['l', 'Q', 't', 's', 'S', '-help']);
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
            const flags = Parser.parseFlags(cmd, ['-help']);
            const content = this.client.pwd(flags);
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
            const flags = Parser.parseFlags(cmd, ['r', 'f', 'v', 'd', '-help']);
            const lastIndex = cmd.length - 1;
            const path = cmd[lastIndex].split(' ');
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
            if (cmd.length == 2 && additionalArg.length == 2) {
                return str;
            } else if (cmd.length == 3 || cmd.length == 2) {
                const flags = Parser.parseFlags(cmd, ['E', 'n', 'b']);
                const lastIndex = cmd.length - 1;
                const path = cmd[lastIndex].split(' ');
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
            } else {
                throw new Error('Invalid input');
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
            const cmd = Parser.parse(line)
            output = this.runCommand(cmd);
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
        } else {
            const re = /cat >/;
            if (re.test(line)) {
                this.inputParam.innerHTML = '';
                this.divParam =  document.createElement('div');
                this.divParam.className = 'param__line';
                this.inputElem.removeEventListener('blur', this.handleMouseUpInputCmd);
                this.inputParam.addEventListener('blur', this.handleMouseUpInputParam);
                this.divParam.appendChild(this.inputParam);
                this.terminalElem.append(this.divParam);
                this.inputParam.focus();
            } 
        } 
    }

    setPath(path: string) {
        this.pathElem.innerText = `(${path})$`
    }

    handleKeyDown = (event: KeyboardEvent) => {
        if (event.code == 'Enter' && this.isFocus) {
            event.preventDefault();
            this.sendCommand(this.inputElem.innerText.trim());
            if (this.isFocus) {
                this.inputElem.innerText = '';
            }
            this.currentHistoryIndex = this.historyCommand.getLength();
        } else if ((event.code == 'ArrowUp' || event.code == 'ArrowDown') && this.isFocus) {
            event.preventDefault();
            this.scrollCommand(event.code);
        } else if (event.ctrlKey && !this.isFocus) {
            event.preventDefault();
            this.sendParam(this.inputParam.innerText.trim(), this.inputElem.innerText.trim());
            this.isFocus = true;
            this.inputParam.removeEventListener('blur', this.handleMouseUpInputParam);
            this.inputElem.addEventListener('blur', this.handleMouseUpInputCmd);
            this.terminalElem.insertBefore(this.workLineElem.cloneNode(true), this.divParam); // вот тут вставляется не там
            this.inputElem.innerText = '';
            this.inputElem.focus();
        }
    }

    handleMouseUpInputCmd = () => {
        this.inputElem.focus();
    }

    handleMouseUpInputParam = () => {
        this.inputParam.focus();
    }

    sendCommand(command: string) {
        const re = /cat >/;
        if (re.test(command)) {
            this.isFocus = false;
        } else {
            this.inputParam.removeEventListener('blur', this.handleMouseUpInputParam);
            this.inputElem.addEventListener('blur', this.handleMouseUpInputCmd);
            this.terminalElem.insertBefore(this.workLineElem.cloneNode(true), this.workLineElem);
            this.inputElem.focus();
            this.isFocus = true;
        }
        if (command != '') {
            this.historyCommand.add(command);
            this.commandOutput(command);
        }
        const path = this.client.pwd(new Set<string>([])) == '/home' ? '/' : this.client.pwd(new Set<string>([])).slice(5);
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
            const range = document.createRange();
            range.selectNodeContents(this.inputElem);
            range.collapse(false);
            const sel = window.getSelection();
            if (sel == null) {
                return;
            }
            sel.removeAllRanges();
            sel.addRange(range);
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

    sendParam(str: string, cmd: string) {
        const index = cmd.indexOf('>');
        cmd = cmd.slice(index);
        cmd = cmd.trim()
        const re = />/g;
        const counter = cmd.match(re);
        const elems = cmd.split(' ');
        for (let i = 0; i < 2; i++) {
            elems[i] = elems[i].trim();
        }
        if (counter?.length == 1) {
            this.client.setOutputInTargetFile(elems[1].split('/'), str)
        } else if (counter?.length == 2) {
            this.client.cancateOutputInTargetFile(elems[1].split('/'), str)
        }
    }
}

export { Terminal }
