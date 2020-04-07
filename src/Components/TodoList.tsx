import * as React from 'react';
import TodoListTasks from './TodoListTasks';
import TodoListFooter from './TodoListFooter';
import '../App.css'
import AddNewItemForm from "./AddNewItemForm";
import TodoListTitle from "./TodoListTitle";
import {connect} from 'react-redux';
import {
    addTaskTC,
    changeTaskTC,
    changeTodoListTitleTC,
    deleteTodoListTC,
    restoreTasksTC
} from "../redux/reducer";
import {TaskType} from "../redux/entities";
import {AppStateType} from "../redux/store";

type StateType = {
    isEditModeActivated: boolean;
    title: string;
    filterValue: string;
};
type OwnPropsType = {
    id: string;
    key: string;
    title: string;
    tasks?: TaskType[];
};
type PropsType = OwnPropsType & MapDispatchToPropsType;

class TodoList extends React.Component<PropsType, StateType> {

    state: StateType = {
        isEditModeActivated: false,
        title: this.props.title,
        filterValue: "All"
    };

    componentDidMount() {
        this.restoreState()
    };

    restoreState = () => {
        this.props.restoreTasks(this.props.id)
    };

    changeFilter = (newFilterValue: string) => {
        this.setState({
            filterValue: newFilterValue
        });
    };

    onAddTaskClick = (title: string) => {
        this.props.addTask(title, this.props.id)
    };

    changeStatus = (task: TaskType, status: number) => {
        let newTask = {...task, status: status};
        this.props.changeTask(this.props.id, task.id, newTask)
    };

    changeTitle = (task: TaskType, title: string) => {
        let newTask = {...task, title: title};
        this.props.changeTask(this.props.id, task.id, newTask)
    };

    deleteTodoList = () => {
        this.props.deleteTodoList(this.props.id)
    };

    changeTodoListTitle = () => {
        this.props.changeTodoListTitle(this.props.id, this.state.title)
    };

    onChangeHandler = (e: any) => {
        this.setState({title: e.currentTarget.value})
    };

    enablingEditMode = () => {
        this.setState({isEditModeActivated: !this.state.isEditModeActivated});
    };

    disablingEditMode = () => {
        this.setState({isEditModeActivated: !this.state.isEditModeActivated});
        this.changeTodoListTitle()
    };

    onKeyPressHandler = (e: any) => {
        if (e.key === "Enter") this.disablingEditMode();
    };

    render() {

        let {tasks = []} = this.props;

        return (
            <div className="todoList">
                <div className="todoList-header">
                    {this.state.isEditModeActivated ?
                        <input value={this.state.title} onBlur={this.disablingEditMode} autoFocus={true}
                               onKeyPress={this.onKeyPressHandler}
                               onChange={(e) => this.onChangeHandler(e)}/> :
                        <TodoListTitle title={this.props.title} onClickHandler={this.enablingEditMode}/>}
                    <AddNewItemForm onAddItemClick={this.onAddTaskClick} todoListName={this.props.title}/>
                    <span className={'close'} onClick={this.deleteTodoList}>
                        X
                    </span>
                </div>
                <TodoListTasks changeStatus={this.changeStatus}
                               changeTitle={this.changeTitle} todoListId={this.props.id}
                               tasks={tasks.filter(t => {
                                   if (this.state.filterValue === "All") {
                                       return true;
                                   }
                                   if (this.state.filterValue === "Active") {
                                       return t.status === 0;
                                   }
                                   if (this.state.filterValue === "Completed") {
                                       return t.status === 2;
                                   }
                               })}/>
                <TodoListFooter filterValue={this.state.filterValue} changeFilter={this.changeFilter}/>
            </div>
        );
    }
}

type MapDispatchToPropsType = {
    addTask: (newTask: string, todoListId: string) => void;
    changeTask: (todoListId: string, taskId: string, newTask: TaskType) => void;
    deleteTodoList: (todoListId: string) => void;
    restoreTasks: (todoListId: string) => void;
    changeTodoListTitle: (todoListId: string, todoListTitle: string) => void;
};

const mapDispatchToProps = (dispatch: any): MapDispatchToPropsType => {
    return {
        addTask: (newTask, todoListId) => {
            dispatch(addTaskTC(newTask, todoListId))
        },
        changeTask: (todoListId, taskId, newTask) => {
            dispatch(changeTaskTC(todoListId, taskId, newTask))
        },
        deleteTodoList: (todoListId) => {
            dispatch(deleteTodoListTC(todoListId))
        },
        restoreTasks: (todoListId) => {
            dispatch(restoreTasksTC(todoListId))
        },
        changeTodoListTitle: (todoListId, todoListTitle) => {
            dispatch(changeTodoListTitleTC(todoListId, todoListTitle))
        }
    }
};

const ConnectedTodoList = connect<void, MapDispatchToPropsType, OwnPropsType, AppStateType>(null, mapDispatchToProps)(TodoList);

export default ConnectedTodoList;
