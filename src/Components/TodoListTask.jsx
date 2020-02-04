import React from 'react';
import '../App.css';

class TodoListTask extends React.Component {

    onIsDoneChanged = (e) => {
        this.props.changeStatus(this.props.task, e.currentTarget.checked)
    };

    render() {
        return (
            <div className={this.props.task.isDone ? 'todoList-task done' : 'todoList-task'}>
                <input type="checkbox" checked={this.props.task.isDone}
                       onChange={(e) => this.onIsDoneChanged(e)}/>
                <span>{this.props.task.title}, priority: {this.props.task.priority}</span>
            </div>
        );
    }
}

export default TodoListTask;

