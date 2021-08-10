import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { TextField, Button, Typography, Checkbox, Chip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

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


export const Todo = ({ number, todo, deleteTodo, updateTodo }) => {
    const classes = useStyles()

    const [name, setName] = useState(todo.name);
    const [dueDate, setDueDate] = useState(todo.dueDate ? todo.dueDate : new Date().toISOString().split('T')[0]);
    const [done, setDone] = useState(todo.done);

    const calculateDue = () => {
        const Today = new Date();
        return Math.ceil((new Date(dueDate) - Today) / 1000 / 3600 / 24);//need to do it better :)
    }

    return (
        <div className={classes.todoLine} >
            <Typography className={classes.standardSpace} variant='h6'>
                {number}
            </Typography>
            <Checkbox
                color="primary"
                checked={done}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                onChange={event => {
                    setDone(event.target.checked);
                    updateTodo({ id: todo.id, done: event.target.checked });
                }}
            />
            <TextField
                label='What to do?'
                value={name}
                onChange={event => {
                    setName(event.target.value);
                    updateTodo({ id: todo.id, name: event.target.value });
                }}
                className={classes.textField}
            />
            <TextField
                id="date"
                label="Due Date"
                type="date"
                value={!dueDate ? new Date().toISOString().split('T')[0] : dueDate}
                className={classes.textField}
                onChange={event => {
                    setDueDate(event.target.value);
                    updateTodo({ id: todo.id, dueDate: event.target.value });
                }}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            {dueDate && <Chip label={`${calculateDue()} ${calculateDue() >= 0 ? 'days remaining' : 'days overdue'}`}
                color={`${calculateDue() > 0 ? 'primary' : 'secondary'}`}
                variant="outlined"
                className={classes.standardSpace}
            />}
            <Button
                size='small'
                color='secondary'
                className={classes.standardSpace}
                onClick={() => {
                    deleteTodo(todo.id);
                }}
            >
                <DeleteIcon />
            </Button>
        </div>
    );
}