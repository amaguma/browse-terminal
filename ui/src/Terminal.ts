import { FileSystemClient } from './fs/FileSystemClient';
import { FileSystemManager } from './fs/FileSystemManager';
import { Parser } from './Parser';
import { Pair } from './Parser';

class Terminal {
    private client: FileSystemClient;

    constructor(fileSystem: FileSystemManager) {
        this.client = new FileSystemClient(fileSystem);
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
                    this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), content)
                } else if (additionalArg[0] == '>') {
                    this.client.setOutputInTargetFile(additionalArg[1].split('/'), content)
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
                str = this.client.ls(flags).join('\n');
                if (additionalArg.length != 0) {
                    if (additionalArg[0] == '>>') {
                        this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), str)
                    } else if (additionalArg[0] == '>') {
                        this.client.setOutputInTargetFile(additionalArg[1].split('/'), str)
                    } else {
                        throw new Error('Invalid input'); 
                    }
                }
            } else if (cmd.length == 3) {
                const path = cmd[2].split('/');
                str = this.client.ls(flags, path).join('\n');
                if (additionalArg.length != 0) {
                    if (additionalArg[0] == '>>') {
                        this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), str)
                    } else if (additionalArg[0] == '>') {
                        this.client.setOutputInTargetFile(additionalArg[1].split('/'), str)
                    } else {
                        throw new Error('Invalid input'); 
                    }
                }
            } else {
                throw new Error('Invalid input'); 
            }
        } else if (commandName == 'pwd') {
            if (cmd.length > 2) {
                throw new Error('Invalid input'); 
            }
            str = this.client.pwd();
            if (additionalArg.length != 0) {
                if (additionalArg[0] == '>>') {
                    this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), str)
                } else if (additionalArg[0] == '>') {
                    this.client.setOutputInTargetFile(additionalArg[1].split('/'), str)
                } else {
                    throw new Error('Invalid input'); 
                }
            }
        } else if (commandName == 'rm') {
            if (cmd.length != 3) {
                throw new Error('Invalid input'); 
            }
            const flags = Parser.parseFlags(cmd, ['r', 'f', 'v', 'd']);
            const path = cmd[2].split(' ');
            str = this.client.rm(path, flags)?.join('\n');
        } else if (commandName == 'cat') {
            if (cmd.length != 3) {
                throw new Error('Invalid input'); 
            }
            const flags = Parser.parseFlags(cmd, ['E', 'n', 'b']);
            const path = cmd[2].split(' ');
            str = this.client.cat(path, flags).join('\n');
            if (additionalArg.length != 0) {
                if (additionalArg[0] == '>>') {
                    this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), str)
                } else if (additionalArg[0] == '>') {
                    this.client.setOutputInTargetFile(additionalArg[1].split('/'), str)
                } else {
                    throw new Error('Invalid input'); 
                }
            }
        } else if (commandName == 'help') {
            if (cmd.length > 2) {
                throw new Error('Invalid input'); 
            }
            str = this.client.help().join('\n');
            if (additionalArg.length != 0) {
                if (additionalArg[0] == '>>') {
                    this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), str)
                } else if (additionalArg[0] == '>') {
                    this.client.setOutputInTargetFile(additionalArg[1].split('/'), str)
                } else {
                    throw new Error('Invalid input'); 
                }
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
        const terminal = document.getElementById('terminal');
        if (terminal == null) {
            return;
        }
        let commandInput: string | undefined;
        body.addEventListener('keypress', (event) => {
            const input = document.querySelector('[contenteditable=true]:last-child');
            if (event.code != 'Enter') return;
            if (input != null) {
                commandInput = input.textContent?.trim();
            } 
            if (!commandInput || commandInput == '') {
                this.addWorkLine(terminal)
            } else {
                this.CommandOutput(commandInput, terminal);
                this.addWorkLine(terminal)
            }
        });
    }
}

export { Terminal }