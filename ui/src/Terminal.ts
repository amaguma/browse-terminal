import { FileSystemClient } from './fs/FileSystemClient';
import { FileSystemManager } from './fs/FileSystemManager';
import { Parser } from './Parser';
import { Pair } from './Parser';

class Terminal {
    private client: FileSystemClient;
    private historyCommand: HistoryCommand<string>;

    constructor(fileSystem: FileSystemManager) {
        this.client = new FileSystemClient(fileSystem);
        this.historyCommand = new HistoryCommand();
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
            } else if (cmd.length == 2){
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
            const flags = Parser.parseFlags(cmd, ['1','l','Q','t','s', 'S']);
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

    addWorkLine(terminal: HTMLElement)  {
        let str = '';
        if (this.client.pwd() == '/home') {
            str = '/';
        } else {
            str = this.client.pwd().slice(5);
        }
        // const newWorkLine = document.querySelector('.work__line:last-child')?.cloneNode(true);
        const input = document.querySelector('[contenteditable=true]:last-child');
        if (input) {
            input.setAttribute('contenteditable', 'false');
        }
        // if (newWorkLine) {
        //     terminal.appendChild(newWorkLine);
        // }
        // const path = document.querySelectorAll('.path');
        // if (path != null) {
        //     path[path.length - 1].innerHTML = '(' + str + ')$';
        // }
     
     
        const newWorkLine = document.createElement('div');
        newWorkLine.className = "work__line";
        newWorkLine.innerHTML = '<span class="initial__entry">guest:</span>' + '<span class="path">' + '(' + str + ')' + '$' + '</span>' + 
        '<span id="input" contenteditable="true" class="input" autocorrect="off" autocapitalize="none" autocomplete="off"></span>';
        terminal.appendChild(newWorkLine);  
        // const newInput = newWorkLine.querySelector('#input');
        // if (newInput != null) {
        //     newInput.innerHTML = ' ';
        //     newInput.focus()
        // }       
    }

    CommandOutput(line: string, terminal: HTMLElement) {
        let output: string | undefined;
        try {
            output = this.runCommand(Parser.parse(line));
        } catch (error) {
            output = (error as Error).message;
        }       
        if (output) {
            const outputCommand = output.split('\n');
            for (const item of outputCommand) {
                let div = document.createElement('div');
                div.innerHTML = item;
                terminal.appendChild(div);  
            }
        }
    }
    sendCommand(body: HTMLElement) {
        body.addEventListener('keypress', (event) => {
            if (event.code != 'Enter') return;
            const terminal = document.getElementById('terminal');
            if (terminal == null) {
                return;
            }
            let commandInput: string | undefined;
            const input = document.querySelector('[contenteditable=true]:last-child');
            if (input != null) {
                commandInput = input.textContent?.trim();
            } 
            if (!commandInput || commandInput == '') {
                this.addWorkLine(terminal)
            } else {
                this.historyCommand.add(commandInput);
                this.CommandOutput(commandInput, terminal);
                this.addWorkLine(terminal);
                console.log(this.historyCommand.getLength());

            }
            event.preventDefault();
            return;
        });
        return;
    }

    scrollCommands(body: HTMLElement) {
        if (this.historyCommand.getLength() == 0) {
            return;
        }
        console.log('AAAAAAAAAAAAAAAAAAAAAAAA');
        let index = this.historyCommand.getLength() - 1;
        body.addEventListener('keydown', (event) => {
            const input = document.querySelector('[contenteditable=true]:last-child');
            if (event.code == 'ArrowUp') {
                if (index < 0) {
                    index = 0;
                }
                input?.textContent == this.historyCommand.getElem(index);
                index--;
            } else if (event.code == 'ArrowDown') {
                if (index > this.historyCommand.getLength() - 1) {
                    index = this.historyCommand.getLength() - 1;
                }
                input?.textContent == this.historyCommand.getElem(index);
                index++;
            } else {
                return;
            }
        });
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
            for(let i = 0; i < this.data.length - 1; i++) {
                this.data[i] = this.data[i + 1];
            }
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
}

export { Terminal }