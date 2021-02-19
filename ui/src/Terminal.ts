import {Commands} from './Commands';
import {FileSystem} from './fs/FileSystem';
import {Pair, Parser} from './Parser';
import {ListHistory} from './ListHistory'

class Terminal {
    private client: Commands; // командная оболочка.
    private historyCommand: ListHistory<string>; // история команд.
    private currentHistoryIndex: number;
    private readonly terminalElem: HTMLDivElement; // окно терминала.
    private readonly historyLogElem: HTMLDivElement; // div объект, в котором все предыдущие.
    private readonly workLineElem: HTMLDivElement; // строка приглашения.
    private readonly pathElem: HTMLSpanElement; // span объект, в котором указан путь до текущей директории.
    private readonly inputCmdElem: HTMLSpanElement; // окно для ввода команды.
    private readonly inputParamElem: HTMLSpanElement; // окно для ввода текста. 

    constructor(fileSystem: FileSystem) {
        this.client = new Commands(fileSystem);
        this.historyCommand = new ListHistory(15);
        this.terminalElem = document.createElement('div');
        this.historyLogElem = document.createElement('div');
        this.workLineElem = document.createElement('div');
        this.pathElem = document.createElement('span');
        this.inputCmdElem = document.createElement('span');
        this.inputParamElem = document.createElement('span');
        this.currentHistoryIndex = this.historyCommand.getLength();
        this.init();
    }

    private init() {
        this.terminalElem.id = 'terminal';
        this.terminalElem.className = 'container';

        this.historyLogElem.className = 'history__log';

        this.workLineElem.className = 'work__line';
        this.workLineElem.innerHTML = '<span class="initial__entry">guest:</span>';

        this.pathElem.className = 'path';
        this.setPath('/');

        this.inputCmdElem.className = 'input__cmd';
        this.inputCmdElem.setAttribute('contenteditable', 'true');
        this.inputCmdElem.setAttribute('autocorrect', 'off');
        this.inputCmdElem.setAttribute('autocapitalize', 'none');
        this.inputCmdElem.setAttribute('autocomplete', 'off');
        this.inputCmdElem.addEventListener('blur', this.handleInputCmdBlur);
        this.inputCmdElem.addEventListener('keydown', this.handleInputCmdKeyDown);

        this.inputParamElem.classList.add('input__param', 'hidden');
        this.inputParamElem.setAttribute('contenteditable', 'true');
        this.inputParamElem.setAttribute('autocorrect', 'off');
        this.inputParamElem.setAttribute('autocapitalize', 'none');
        this.inputParamElem.setAttribute('autocomplete', 'off');
        this.inputParamElem.addEventListener('blur', this.handleInputParamBlur);
        this.inputParamElem.addEventListener('keydown', this.handleInputParamKeyDown);

        this.workLineElem.appendChild(this.pathElem);
        this.workLineElem.appendChild(this.inputCmdElem);
        this.terminalElem.appendChild(this.historyLogElem);
        this.terminalElem.appendChild(this.inputParamElem);
        this.terminalElem.appendChild(this.workLineElem);
        document.body.appendChild(this.terminalElem);
        this.inputCmdElem.focus();
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
        } else if (commandName == 'clear') {
            if (cmd.length > 2 || cmd[1] != '-') {
                throw new Error('Invalid input');
            }
        } else {
            throw new Error('Bad command');
        }
        return str;
    }

    commandOutput(line: string) {
        if (line.startsWith('cat >')) {
            this.workLineElem.classList.add('hidden');
            this.inputParamElem.classList.remove('hidden');
            this.inputParamElem.setAttribute('command', line);
            this.inputParamElem.focus();
            return;
        }
        if (line === 'clear') {
            this.historyLogElem.innerHTML = '';
            return;
        }
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
                div.className = 'output';
                div.innerHTML = item;
                this.historyLogElem.appendChild(div);
            }
        }
    }

    setPath(path: string) {
        this.pathElem.innerText = `(${path})$`
    }

    handleInputCmdKeyDown = (event: KeyboardEvent) => {
        if (event.code == 'Enter') {
            event.preventDefault();
            this.sendCommand();
            this.currentHistoryIndex = this.historyCommand.getLength();
        } else if ((event.code == 'ArrowUp' || event.code == 'ArrowDown')) {
            event.preventDefault();
            this.scrollCommand(event.code);
        }
    }

    handleInputParamKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.code === 'KeyD') {
            event.preventDefault();
            this.sendParam();
            this.inputParamElem.classList.add('hidden');
            this.workLineElem.classList.remove('hidden')
            this.inputCmdElem.focus();
        }
    }

    handleInputCmdBlur = () => {
        this.inputCmdElem.focus();
    }

    handleInputParamBlur = () => {
        this.inputParamElem.focus();
    }

    sendCommand() {
        const command = this.inputCmdElem.innerText.trim();
        this.historyLogElem.appendChild(this.workLineElem.cloneNode(true));  // добавление в браузер приглашение для ввода.
        if (command != '') {
            this.historyCommand.add(command); // добавление команды в историю команд.
            this.commandOutput(command); 
        }
        const path = this.client.pwd(new Set<string>([])) == '/home' ? '/' : this.client.pwd(new Set<string>([])).slice(5);
        this.setPath(path); // добавление пути до текущей дирректории в приглашение для ввода.
        this.inputCmdElem.innerText = '';
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
            this.inputCmdElem.innerText = this.historyCommand.getElem(this.currentHistoryIndex);
            const range = document.createRange();
            range.selectNodeContents(this.inputCmdElem);
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
                this.inputCmdElem.innerText = '';
            } else {
                this.inputCmdElem.innerText = this.historyCommand.getElem(this.currentHistoryIndex);
            }
        }
    }

    sendParam() {
        const str = this.inputParamElem.innerText.trim();
        this.historyLogElem.appendChild(this.inputParamElem.cloneNode(true));
        let cmd = this.inputParamElem.getAttribute('command');
        if (cmd) {
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
        this.inputParamElem.innerText = '';
    }
}

export {Terminal}
