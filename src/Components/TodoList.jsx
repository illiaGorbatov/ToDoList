import React from 'react';
import TodoListTasks from './TodoListTasks.jsx';
import TodoListFooter from './TodoListFooter.jsx';
import '../App.css'
import AddNewItemForm from "./AddNewItemForm";
import TodoListTitle from "./TodoListTitle";
import connect from "react-redux/lib/connect/connect";
import {addTaskAC, changeTaskAC, deleteTodoListAC, setTasksAC} from "../redux/reducer";
import axios from "axios";

class TodoList extends React.Component {

    componentDidMount() {
        this.restoreState()
    };

    saveState = () => {
        let stateAsString = JSON.stringify(this.state);
        localStorage.setItem('our-state-' + this.props.id, stateAsString);
    };

    restoreState = () => {
        axios.get(`https://social-network.samuraijs.com/api/1.1/todo-lists/${this.props.id}/tasks`,
            {
                withCredentials: true,
                headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
            }
        )
            .then(res => {
                let allTasks = res.data.items;
                this.props.setTasks(allTasks, this.props.id)
            })
    };

    onAddTaskClick = (title) => {
        axios.post(`https://social-network.samuraijs.com/api/1.1/todo-lists/${this.props.id}/tasks`,
            {title: title},
            {
                withCredentials: true,
                headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
            }
        )
            .then(res => {
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
        axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${this.props.id}/tasks/${task.id}`,
            newTask,
            {
                withCredentials: true,
                headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
            }
        )
            .then(res => {
                if (res.data.resultCode === 0) this.props.changeTask(res.data.data.item);
            })
    };

    changeTitle = (task, title) => {
        let newTask = {...task, title: title};
        axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${this.props.id}/tasks/${task.id}`,
            newTask,
            {
                withCredentials: true,
                headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
            }
        )
            .then(res => {
                if (res.data.resultCode === 0) this.props.changeTask(res.data.data.item);
            })
    };

    _changeTitle = (taskId, title) => {
        this.props.changeTask(taskId, {title: title}, this.props.id);
    };

    _changingTask = (taskId, object) => {
        let newTasks = this.state.tasks.map(task => {
            if (task.id !== taskId) return task;
            else {
                return {...task, ...object}
            }
        });
        this.props.changeTask(taskId, newTasks, this.props.id);
    };

    deleteTodoList = () => {
        axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${this.props.id}`,
            {
                withCredentials: true,
                headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
            }
        )
            .then(res => {
                if (res.data.resultCode === 0) this.props.deleteTodoList(this.props.id)
            }
        )
    };

    state = {
        filterValue: 'All',
    };

    render() {

        let {tasks = []} = this.props;

        return (
            <div className="todoList">
                <div className="todoList-header">
                    <TodoListTitle title={this.props.title}/>
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
    }
};

const ConnectedTodoList = connect(null, mapDispatchToProps)(TodoList);

export default ConnectedTodoList;
