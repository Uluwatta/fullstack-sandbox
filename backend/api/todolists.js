const express = require('express');
const router = express.Router();
const data = require('../data');

// root : api/todolists

// get all todo lists
router.get('/', (req, res) => {
    res.json(data);
})

// get specific todo list
router.get('/:id', (req, res) => {
    res.json(data[req.params.id]);
})

// update all todos in a list
router.post('/:id/todos', (req, res) => {
    data[req.params.id].todos = req.body;
    res.json(data[req.params.id]);
});

module.exports = router;