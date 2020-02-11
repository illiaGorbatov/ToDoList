import React from 'react';
import '../App.css';

class TodoListTask extends React.Component {

    state = {
        isEditModeActivated: false
    };

    onIsDoneChanged = (e) => {
        this.props.changeStatus(this.props.task.id, e.currentTarget.checked)
    };

    switchEditMode = () => {
        this.setState({isEditModeActivated: !this.state.isEditModeActivated})
    };

    onKeyPressHandler = (e) => {
        if (e.key === "Enter") this.switchEditMode();
    };

    render() {
        return (
            <div className={this.props.task.isDone ? 'todoList-task done' : 'todoList-task'}>
                <input type="checkbox" checked={this.props.task.isDone}
                       onChange={(e) => this.onIsDoneChanged(e)}/>

                <span>id: {this.props.task.id}
                {this.state.isEditModeActivated ?
                    <input value={this.props.task.title} onBlur={this.switchEditMode} autoFocus={true}
                           onKeyPress={this.onKeyPressHandler}
                           onChange={(e) => this.props.changeTitle(this.props.task.id, e.currentTarget.value)}/> :
                    <span onClick={this.switchEditMode}>  {this.props.task.title}</span>},
                    priority: {this.props.task.priority}</span>
            </div>
        );
    }
}

export default TodoListTask;

