const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const data = require('../data');

// root : api/todolists

// get all todo lists
router.get('/', (req, res) => {
    res.json(data);
})

// get specific todo list
router.get('/:list_id', (req, res) => {
    const list = data.find(list => list.id === req.params.list_id);
    if (list) {
        res.json(list);
    } else {
        res.status(400).json({ msg: `no list found with the id : ${req.params.list_id}` })
    }
})

// get todos
router.get('/:list_id/todos', (req, res) => {
    const list = data.find(list => list.id === req.params.list_id);
    if (list) {
        res.json(list.todos);
    } else {
        res.status(400).json({ msg: `no list found with the id : ${req.params.list_id}` })
    }
});

// get todo
router.get('/:list_id/todos/:todo_id', (req, res) => {
    const list = data.find(list => list.id === req.params.list_id);
    if (list) {
        const todo = list.todos.find(todo => todo.id === req.params.todo_id);
        if (todo) {
            res.json(todo);
        } else {
            res.status(400).json({ msg: `no todo found with the id : ${req.params.todo_id}` });
        }
    } else {
        res.status(400).json({ msg: `no list found with the id : ${req.params.list_id}` })
    }
});

// post todo
router.post('/:list_id/todos', (req, res) => {
    const list = data.find(list => list.id === req.params.list_id);
    if (list) {
        const id = uuid.v1();
        const todo = { id, ...req.body };
        list.todos.push(todo);
        res.json(todo);
    } else {
        res.status(400).json({ msg: `no list found with the id : ${req.params.list_id}` })
    }
});

// put todo
router.put('/:list_id/todos/:todo_id', (req, res) => {
    const list = data.find(list => list.id === req.params.list_id);
    if (list) {
        const todo = list.todos.find(todo => todo.id === req.params.todo_id);
        if (todo) {
            req.body.name ? todo.name = req.body.name : todo.name;
            req.body.done !== undefined ? todo.done = req.body.done : todo.done;
            req.body.dueDate ? todo.dueDate = req.body.dueDate : todo.dueDate;
            res.json({ msg: 'updated todo', todo });
        } else {
            res.status(400).json({ msg: `no todo found with id : ${req.params.todo_id}` });
        }
    } else {
        res.status(400).json({ msg: `no list found with the id : ${req.params.list_id}` })
    }
});

// delete todo
router.delete('/:list_id/todos/:todo_id', (req, res) => {
    const list = data.find(list => list.id === req.params.list_id);
    if (list) {
        const todo = list.todos.find(todo => todo.id === req.params.todo_id);
        if (todo) {
            list.todos = list.todos.filter(todo => todo.id !== req.params.todo_id);
            res.json({ msg: 'deleted todo', todo });
        } else {
            res.status(400).json({ msg: `no todo found with id : ${req.params.todo_id}` });
        }
    } else {
        res.status(400).json({ msg: `no list found with the id : ${req.params.list_id}` })
    }
});

module.exports = router;