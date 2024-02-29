const express = require('express');          // web sunucusu oluşturmak için
const bodyParser = require('body-parser');    //HTTP isteklerini işlemek için 
const ejs = require('ejs');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'todo_list'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});


function getTodos(callback) {
    const query = 'SELECT * FROM todos';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching todos from MySQL database: ', err);
            return callback([]);
        }
        callback(results);
    });
}

function addTodo(todoText, callback) {
    const query = 'INSERT INTO todos (text) VALUES (?)';
    connection.query(query, [todoText], (err, result) => {
        if (err) {
            console.error('Error adding todo to MySQL database: ', err);
            return callback(false);
        }
        callback(true);
    });
}

const app = express();
app.set('view engine', 'ejs');  
app.use(bodyParser.urlencoded({ extended: true }));



//veritabanındakileri html sayfasında görütüler
app.get('/', (req, res) => {
    getTodos((todos) => {
        res.render('index', { todos });
    });
});

app.post('/', (req, res) => {
    const newTodo = req.body.todo;
    addTodo(newTodo, (success) => {
        if (success) {
            res.redirect('/');
        } else {
            res.status(500).send('Error adding todo');
        }
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM todos WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting todo from MySQL database: ', err);
            res.status(500).send('Error deleting todo');
            return;
        }
        console.log(`Deleted todo with id ${id}`);
        res.sendStatus(204);
    });
});

//sunucu dinlemek için
app.listen(3000, function () {
    console.log("server started at 3000")
})


