import React from 'react';
import '../App.css';

class TodoListTask extends React.Component {
    render() {
        return (
            <div className="todoList-task">
                <input type="checkbox" checked={this.props.task.isDone}
                       onChange={(event) => this.props.changeStatus(this.props.task, event.currentTarget.checked)}/>
                <span>{this.props.task.title}, priority: {this.props.task.priority}</span>
            </div>
        );
    }
}

export default TodoListTask;

