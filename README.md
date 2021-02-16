# browser-terminal

UTerm - это универсальная имитация терминала в браузере.<b>

Файловая система представляет собой дерево, вершинами которого могут быть файлы или дирректории.<b>
Ее реализацию можно найти в ui/src/fs<b>

Реализация команд расположена в ui/src/fs/FileSystemClient.ts<b>

Вся визуализация находится в ui/stc/Terminal.ts<b>

## Запуск

ui/dist/index.html<b>
## Возможности

В терминале реализованы команды:<b>

cd [DIR] - changes the current folder.<b>
mkdir [OPTION] [DIR]... - creates a directory.<b>
rmdir [OPTION] [DIR] - removes a directory if it is empty.<b>
touch [OPTION]... [FILE]... - creates a file.<b>
pwd - shows the path to the current directory.<b>
rm [OPTION]... [FILE]... - removes directory or file.<b>
ls [OPTION]... [DIR] - shows directory contents.<b>
cat [OPTION]... [FILE]... - print the contents of FILE (s) to standard output.<b>
echo [STRING] - print a string to standard output.<b>
clear - clears the window.<b>

Чтобы узнать больше о каждой команде:<b>
[command] --help<b>

Также есть возможность перенаправлять поток вывода<b>
Например: cat >> file или ls -l > file<b>
## Планы на будущее

1) Добавить БД:<b>
    добавить серверную часть<b>
    добавить авторизацию<b>
    добавить задания и оформить все в виде обучения<b>
    добавить страницу профиля<b>
2) Добавить компилятор Bash<b>
