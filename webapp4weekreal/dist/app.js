import express from "express";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
const DATAFILE = path.join(__dirname, '../data.json');
const initDataFile = () => {
    if (!fs.existsSync(DATAFILE)) {
        fs.writeFileSync(DATAFILE, JSON.stringify([]));
    }
};
const readUsers = () => {
    try {
        const data = fs.readFileSync(DATAFILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        return [];
    }
};
const writeUsers = (users) => {
    fs.writeFileSync(DATAFILE, JSON.stringify(users, null, 2));
};
initDataFile();
app.post('/add', (req, res) => {
    const { name, todo } = req.body;
    if (!name || !todo) {
        res.status(400).send('Name and Todo are required');
        return;
    }
    const users = readUsers();
    const existingUser = users.find(u => u.name.toLowerCase() === name.toLowerCase());
    if (existingUser) {
        existingUser.todos.push(todo);
    }
    else {
        const newUser = {
            name: name,
            todos: [todo]
        };
        users.push(newUser);
    }
    writeUsers(users);
    res.send(`Todo added successfully for user ${name}.`);
});
app.get('/todos/:id', (req, res) => {
    const searchName = req.params.id;
    const users = readUsers();
    const user = users.find(u => u.name.toLowerCase() === searchName.toLowerCase());
    if (user) {
        res.json(user.todos);
    }
    else {
        res.status(404).send('User not found');
    }
});
app.delete('/delete', (req, res) => {
    const { name } = req.body;
    let users = readUsers();
    const initialLength = users.length;
    users = users.filter(u => u.name.toLowerCase() !== name.toLowerCase());
    if (users.length < initialLength) {
        writeUsers(users);
        res.send('User deleted successfully.');
    }
    else {
        res.status(404).send('User not found.');
    }
});
app.put('/update', (req, res) => {
    const { name, todo } = req.body;
    const users = readUsers();
    const user = users.find(u => u.name.toLowerCase() === name.toLowerCase());
    if (user) {
        const todoIndex = user.todos.indexOf(todo);
        if (todoIndex > -1) {
            user.todos.splice(todoIndex, 1);
            writeUsers(users);
            res.send('Todo deleted successfully.');
        }
        else {
            res.status(404).send('Todo not found for this user.');
        }
    }
    else {
        res.status(404).send('User not found.');
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
