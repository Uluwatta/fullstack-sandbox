import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Card, CardContent, CardActions, Button, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { Todo } from './Todo'
import { API_URL } from '../Constants'

const useStyles = makeStyles({
  card: {
    margin: '1rem'
  },
  todoLine: {
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    flexGrow: 1
  },
  standardSpace: {
    margin: '8px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  }
})

export const ToDoListForm = ({ activeList, onListCompletion }) => {
  const classes = useStyles()
  const [todoList, setTodoList] = useState({});

  const getTodoList = async (listId) => {
    const res = await fetch(`${API_URL}/todolists/${listId}/`);
    const data = await res.json();
    return data;
  }

  const saveTodo = async (listId, todo) => {
    const res = await fetch(`${API_URL}/todolists/${listId}/todos/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(todo)
    });
    const data = await res.json();
    const newTodoList = { ...todoList, todos: [...todoList.todos, data] }
    setTodoList(newTodoList);
    onListCompletion(activeList, checkCompletion(newTodoList));
    return data;
  }

  const updateTodo = async (todo) => {
    const res = await fetch(`${API_URL}/todolists/${activeList}/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(todo)
    });
    const data = await res.json();
    const newTodoList = { ...todoList, todos: [...todoList.todos.map((t) => t.id === todo.id ? data.todo : t)] }
    setTodoList(newTodoList);
    onListCompletion(activeList, checkCompletion(newTodoList));
    return data;
  }

  const deleteTodo = async (todoId) => {
    const res = await fetch(`${API_URL}/todolists/${activeList}/todos/${todoId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await res.json();
    const newTodoList = { ...todoList, todos: todoList.todos.filter(todo => todo.id !== todoId) }
    setTodoList(newTodoList);
    onListCompletion(activeList, checkCompletion(newTodoList));
    return data;
  }

  const checkCompletion = (list) => {
    return list.todos && list.todos.reduce((tot, todo) => todo.done && tot, true);
  }

  useEffect(() => {
    const setTodoListOnLoad = async () => {
      const todoList = await getTodoList(activeList);
      setTodoList(todoList);
    }
    setTodoListOnLoad();
  }, [activeList])

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography component='h2'>
          {todoList.title}
        </Typography>
        <>
          {todoList && todoList.todos && todoList.todos.map((todo, index) => (
            <Todo
              key={todo.id}
              number={index + 1}
              todo={todo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
            />
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                saveTodo(activeList, { name: '', done: false, 'dueDate': '' })
              }}
            >
              Add Todo <AddIcon />
            </Button>
            {/* <Button type='submit' variant='contained' color='primary'>
              Save
            </Button> */}
          </CardActions>
        </>
      </CardContent>
    </Card>
  )
}
