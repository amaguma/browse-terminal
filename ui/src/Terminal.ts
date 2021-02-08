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
        try {
            if (commandName == 'cd') {
                if (cmd.length != 2) {
                    throw new Error('Invalid input');
                }
                const path = cmd[1].split('/');
                this.client.cd(path);
            } else if (commandName == 'mkdir') {
                if (cmd.length == 2 || cmd.length == 3) {
                    const flags = Parser.parseFlags(cmd, ['p']);
                    const lastIndex = cmd.length - 1;
                    const path = cmd[lastIndex].split(' ');
                    this.client.mkdir(path, flags);
                } else {
                    throw new Error('Invalid input');
                }
            } else if (commandName == 'echo') {
                if (cmd.length != 2) {
                    throw new Error('Invalid input');
                }
                str = this.client.echo(cmd[1]);
                if (additionalArg.length != 0) {
                    if (additionalArg[0] == '>>') {
                        this.client.cancateOutputInTargetFile(additionalArg[1].split('/'), str)
                    } else if (additionalArg[0] == '>') {
                        this.client.setOutputInTargetFile(additionalArg[1].split('/'), str)
                    } else {
                        throw new Error('Invalid input'); 
                    }
                } else {
                    console.log(str);
                }
            } else if (commandName == 'rmdir') {
                if (cmd.length == 2 || cmd.length == 3) {
                    const flags = Parser.parseFlags(cmd, ['p']);
                    const lastIndex = cmd.length - 1;
                    const path = cmd[lastIndex].split('/');
                    this.client.mkdir(path, flags);
                } else {
                    throw new Error('Invalid input');
                }
            } else if (commandName == 'touch') {
                const flags = Parser.parseFlags(cmd, ['c', 'd', 'r']);
                const lastIndex = cmd.length - 1;
                const path = cmd[lastIndex].split(' ');
                if (cmd.length == 2 || cmd.length == 3) {
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
                if (cmd.length > 1) {
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
                this.client.rm(path, flags);
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
                if (cmd.length > 1) {
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
        } catch (error) {
            str = error;
        }
        return str;
    }

    addWorkLine(terminal: HTMLHtmlElement)  {
        const input = document.querySelector('[contenteditable=true]:last-child');
        if (input) {
            input.setAttribute('contenteditable', 'false');
        }
        const str = this.client.pwd().slice(5);
        let newWorkLine = document.createElement('div');
        newWorkLine.className = "work__line";
        newWorkLine.innerHTML = '<span class="initial__entry">guest:</span><span class="path">' + '(' + str + ')' + '$' + 
        '</span><span id = "input" contenteditable="true" class="input" autocorrect="off" autocapitalize="none" autocomplete="off"></span>';
        terminal.appendChild(newWorkLine);  
    }

    CommandOutput(line: string, terminal: HTMLHtmlElement) {
        const output = this.runCommand(Parser.parse(line));
        if (output) {
            const outputCommand = output.split('\n');
            for (const item of outputCommand) {
                let div = document.createElement('div');
                div.innerHTML = item;
                terminal.appendChild(div);  
            }
        }
    }
    sendCommand(body: HTMLBodyElement) {
        body.addEventListener('keypress', (event) => {
            if (event.code != 'Enter') return;
        });
    }
}

export { Terminal }