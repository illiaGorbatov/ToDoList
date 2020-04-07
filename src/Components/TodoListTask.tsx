import * as React from 'react';
import '../App.css';
import {connect} from 'react-redux';
import {deleteTaskTC} from "../redux/reducer";
import {TaskType} from "../redux/entities";
import {AppStateType} from "../redux/store";

type StateType = {
    isEditModeActivated: boolean;
    title: string;
};
type OwnPropsType = {
    task: TaskType;
    changeStatus: (task: TaskType, status: number) => void;
    key: string;
    changeTitle: (task: TaskType, title: string) => void;
    todoListId: string;
}
type PropsType = MapDispatchToPropsType & OwnPropsType;

class TodoListTask extends React.Component<PropsType, StateType> {

    state: StateType = {
        isEditModeActivated: false,
        title: this.props.task.title
    };

    onChangeHandler = (e: any) => {
        this.setState({title: e.currentTarget.value})
    };

    onIsDoneChanged = (e: any) => {
        this.props.changeStatus(this.props.task, e.currentTarget.checked ? 2 : 0)
    };

    enablingEditMode = () => {
        this.setState({isEditModeActivated: !this.state.isEditModeActivated});
    };

    disablingEditMode = () => {
        this.setState({isEditModeActivated: !this.state.isEditModeActivated});
        this.props.changeTitle(this.props.task, this.state.title)
    };

    onKeyPressHandler = (e: any) => {
        if (e.key === "Enter") this.disablingEditMode();
    };

    onDeleteTask = () => {
        this.props.deleteTask(this.props.todoListId, this.props.task.id)
    };

    render() {

        let priority = this.props.task.priority === 0 ? 'Low' : 1 ? 'Middle' : 2 ?
            'High' : 3 ? 'Urgently' : 'Later';

        return (
            <div className={this.props.task.status === 2 ? 'todoList-task done' : 'todoList-task'}>
                <input type="checkbox" checked={this.props.task.status === 2}
                       onChange={(e) => this.onIsDoneChanged(e)}/>
                <span>
                    {this.state.isEditModeActivated ?
                        <input value={this.state.title} onBlur={this.disablingEditMode} autoFocus={true}
                               onKeyPress={this.onKeyPressHandler}
                               onChange={(e) => this.onChangeHandler(e)}/> :
                        <span onClick={this.enablingEditMode}>
                            {this.props.task.title}
                        </span>}
                    , priority: {priority}</span>
                <span className={'close'} onClick={this.onDeleteTask}>
                    X
                </span>
            </div>
        );
    }
}

type MapDispatchToPropsType = {
    deleteTask: (todoListId: string, taskId: string) => void;
};

const mapDispatchToProps = (dispatch: any): MapDispatchToPropsType => {
    return {
        deleteTask: (todoListId, taskId) => {
            dispatch(deleteTaskTC(todoListId, taskId))
        }
    }
};

const ConnectedTodoListTask = connect<void, MapDispatchToPropsType, OwnPropsType, AppStateType>
(null, mapDispatchToProps)(TodoListTask);

export default ConnectedTodoListTask;

