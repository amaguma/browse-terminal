# browser-terminal

UTerm - это универсальная имитация терминала в браузере.<br>

Файловая система представляет собой дерево, вершинами которого могут быть файлы или дирректории.<br>
Ее реализацию можно найти в ui/src/fs<br>

Реализация команд расположена в ui/src/fs/FileSystemClient.ts<br>

Вся визуализация находится в ui/stc/Terminal.ts<br>

## Запуск

ui/dist/index.html<br>
## Возможности

В терминале реализованы команды:<br>

cd [DIR] - changes the current folder.<br>
mkdir [OPTION] [DIR]... - creates a directory.<br>
rmdir [OPTION] [DIR] - removes a directory if it is empty.<br>
touch [OPTION]... [FILE]... - creates a file.<br>
pwd - shows the path to the current directory.<br>
rm [OPTION]... [FILE]... - removes directory or file.<br>
ls [OPTION]... [DIR] - shows directory contents.<br>
cat [OPTION]... [FILE]... - print the contents of FILE (s) to standard output.<br>
echo [STRING] - print a string to standard output.<br>
clear - clears the window.<br>

Чтобы узнать больше о каждой команде:<br>
[command] --help<br>

Также есть возможность перенаправлять поток вывода<br>
Например: cat >> file или ls -l > file<br>
## Планы на будущее

1) Добавить БД:<br>
    добавить серверную часть<br>
    добавить авторизацию<br>
    добавить задания и оформить все в виде обучения<br>
    добавить страницу профиля<br>
2) Добавить компилятор Bash<br>
