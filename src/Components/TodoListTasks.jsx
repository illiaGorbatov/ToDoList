import React from 'react';
import '../App.css';
import TodoListTask from "./TodoListTask";

class TodoListTasks extends React.Component {
    render() {

        let tasksElements = this.props.tasks.map(task =>
            <TodoListTask title={task.title} priority={task.priority} isDone={task.isDone}/>
        );

        return (
            <div className="todoList-tasks">
                {tasksElements}
            </div>
        );
    }
}

export default TodoListTasks;

