import React from 'react';
import '../App.css';
import connect from "react-redux/lib/connect/connect";
import {deleteTaskAC} from "../redux/reducer";
import axios from "axios";

class TodoListTask extends React.Component {

    state = {
        isEditModeActivated: false,
        title: this.props.task.title
    };

    onChangeHandler = (e) => {
        this.setState({title: e.currentTarget.value})
    };

    onIsDoneChanged = (e) => {
        this.props.changeStatus(this.props.task, e.currentTarget.checked ? 2 : 0)
    };

    enablingEditMode = () => {
        this.setState({isEditModeActivated: !this.state.isEditModeActivated});
    };

    disablingEditMode = () => {
        this.setState({isEditModeActivated: !this.state.isEditModeActivated});
        this.props.changeTitle(this.props.task, this.state.title)
    };

    onKeyPressHandler = (e) => {
        if (e.key === "Enter") this.disablingEditMode();
    };

    deleteTask = () => {
        axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/
        ${this.props.todoListId}/tasks/${this.props.task.id}`,
            {
                withCredentials: true,
                headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
            }
        )
            .then(res => {
                    if (res.data.resultCode === 0) this.props.deleteTask(this.props.task.id, this.props.todoListId)
                }
            )
    };

    _deleteTask = () => {
        this.props.deleteTask(this.props.task.id, this.props.todoListId)
    };

    render() {

        let priority = this.props.task.priority === 0 ? 'Low' : 1 ? 'Middle' : 2 ?
            'High' : 3 ? 'Urgently' : 'Later';

        return (
            <div className={this.props.task.status === 2 ? 'todoList-task done' : 'todoList-task'}>
                <input type="checkbox" checked={this.props.task.status === 2}
                       onChange={(e) => this.onIsDoneChanged(e)}/>
                <span>id: {this.props.task.id}
                    {this.state.isEditModeActivated ?
                        <input value={this.state.title} onBlur={this.disablingEditMode} autoFocus={true}
                               onKeyPress={this.onKeyPressHandler}
                               onChange={(e) => this.onChangeHandler(e)}/> :
                        <span onClick={this.enablingEditMode}>
                            --{this.props.task.title}
                        </span>}
                    , priority: {priority}</span>
                <span className={'close'} onClick={this.deleteTask}>
                    X
                </span>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteTask: (taskId, todoListId) => {
            const action = deleteTaskAC(taskId, todoListId);
            dispatch(action)
        }
    }
};

const ConnectedTodoListTask = connect(null, mapDispatchToProps)(TodoListTask);

export default ConnectedTodoListTask;

