import React, { Fragment, useState, useEffect } from 'react'
import { Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Typography, Chip } from '@material-ui/core'
import ReceiptIcon from '@material-ui/icons/Receipt'
import { ToDoListForm } from './ToDoListForm'
import { API_URL } from '../Constants'

export const ToDoLists = ({ style }) => {
  const [toDoLists, setToDoLists] = useState({})
  const [activeList, setActiveList] = useState()
  const [completionState, setCompletionState] = useState({});

  const getPersonalTodos = async () => {
    const res = await fetch(`${API_URL}/todolists`);
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    const onLoad = async () => {
      const todoList = await getPersonalTodos();
      let tempCompletionStates = {};
      todoList.forEach(list => {
        tempCompletionStates = {
          ...tempCompletionStates,
          [list.id]: list.todos.length > 0 && list.todos.reduce((tot, item) => item.done && tot, true)
        };
      });
      setCompletionState(tempCompletionStates);
      setToDoLists(todoList);
    }
    onLoad();
  }, [])

  if (!toDoLists.length) return null
  return <Fragment>
    <Card style={style}>
      <CardContent>
        <Typography
          component='h2'
        >
          My ToDo Lists
        </Typography>
        <List>
          {toDoLists.map((list) => <ListItem
            key={list.id}
            button
            onClick={() => setActiveList(list.id)}
          >
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary={list.title} />
            {completionState[list.id] !== 0 && completionState[list.id] && <Chip label="Done"
              color="primary"
              variant="outlined"
            />}
          </ListItem>)}
        </List>
      </CardContent>
    </Card>
    {activeList && <ToDoListForm
      key={activeList} // use key to make React recreate component to reset internal state
      activeList={activeList}
      onListCompletion={(listId, state) => { setCompletionState({ ...completionState, [listId]: state }) }}
    />}
  </Fragment>
}
