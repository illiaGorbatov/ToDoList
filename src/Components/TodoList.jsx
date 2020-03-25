import React from 'react';
import TodoListTasks from './TodoListTasks.jsx';
import TodoListFooter from './TodoListFooter.jsx';
import '../App.css'
import AddNewItemForm from "./AddNewItemForm";
import TodoListTitle from "./TodoListTitle";
import connect from "react-redux/lib/connect/connect";
import {addTaskAC, changeTaskAC, changeTodoListTitleAC, deleteTodoListAC, setTasksAC} from "../redux/reducer";
import {api} from "./api";

class TodoList extends React.Component {

    componentDidMount() {
        this.restoreState()
    };

    restoreState = () => {
        api.restoreTodoListState(this.props.id).then(res => {
            let allTasks = res.data.items;
            this.props.setTasks(allTasks, this.props.id)
        })
    };

    onAddTaskClick = (title) => {
        api.addTask(this.props.id, title).then(res => {
            if (res.data.resultCode === 0) this.props.addTask(res.data.data.item, this.props.id)
        })
    };

    changeFilter = (newFilterValue) => {
        this.setState({
            filterValue: newFilterValue
        }, () => this.saveState());
    };

    changeStatus = (task, status) => {
        let newTask = {...task, status: status};
        api.changeStatus(this.props.id, task.id, newTask).then(res => {
            if (res.data.resultCode === 0) this.props.changeTask(res.data.data.item);
        })
    };

    changeTitle = (task, title) => {
        let newTask = {...task, title: title};
        api.changeTitle(this.props.id, task.id, newTask).then(res => {
            if (res.data.resultCode === 0) this.props.changeTask(res.data.data.item);
        })
    };

    deleteTodoList = () => {
        api.deleteTodoList(this.props.id).then(res => {
                if (res.data.resultCode === 0) this.props.deleteTodoList(this.props.id)
            }
        )
    };

    changeTodoListTitle = () => {
        api.changeTodoListTitle(this.props.id, this.state.title).then(res => {
                if (res.data.resultCode === 0) this.props.changeTodoListTitle(this.props.id, this.state.title)
            }
        )
    };

    state = {
        isEditModeActivated: false,
        title: this.props.title
    };

    onChangeHandler = (e) => {
        this.setState({title: e.currentTarget.value})
    };

    enablingEditMode = () => {
        this.setState({isEditModeActivated: !this.state.isEditModeActivated});
    };

    disablingEditMode = () => {
        this.setState({isEditModeActivated: !this.state.isEditModeActivated});
        this.changeTodoListTitle()
    };

    onKeyPressHandler = (e) => {
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
                    <AddNewItemForm onAddItemClick={this.onAddTaskClick} todoListName={this.props.todoListName}/>
                    <span className={'close'} onClick={this.deleteTodoList}>
                        X
                    </span>
                </div>
                <TodoListTasks tasks={tasks} changeStatus={this.changeStatus}
                               changeTitle={this.changeTitle} todoListId={this.props.id}/>
                <TodoListFooter filterValue={this.state.filterValue} changeFilter={this.changeFilter}/>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTask: (newTask, todoListId) => {
            const action = addTaskAC(newTask, todoListId);
            dispatch(action)
        },
        changeTask: (task) => {
            const action = changeTaskAC(task);
            dispatch(action)
        },
        deleteTodoList: (todoListId) => {
            const action = deleteTodoListAC(todoListId);
            dispatch(action)
        },
        setTasks: (tasks, todoListId) => {
            const action = setTasksAC(tasks, todoListId);
            dispatch(action)
        },
        changeTodoListTitle: (todoListId, todoListTitle) => {
            const action = changeTodoListTitleAC(todoListId, todoListTitle);
            dispatch(action)
        }
    }
};

const ConnectedTodoList = connect(null, mapDispatchToProps)(TodoList);

export default ConnectedTodoList;
