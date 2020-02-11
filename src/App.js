import React from 'react';
import TodoListHeader from './Components/TodoListHeader.jsx';
import TodoListTasks from './Components/TodoListTasks.jsx';
import TodoListFooter from './Components/TodoListFooter.jsx';
import './App.css'

class App extends React.Component {

    componentDidMount() {
        this.restoreState()
    }

    saveState = () => {
        let stateAsString = JSON.stringify(this.state);
        localStorage.setItem('our state',stateAsString);
    };

    restoreState = () => {
        let state = {
            tasks: [],
            filterValue: 'All',
        };
        let stateAsString = localStorage.getItem('our state');
        if (stateAsString != null) state = JSON.parse(stateAsString);
        this.setState(state);
    };

    onAddTaskClick = (value) => {
        let newTask = {
            title: value,
            isDone: false,
            priority: 'high',
            id: this.state.tasks.length ? this.state.tasks.length + 1 : 1,
        };
        let newTasks = [...this.state.tasks, newTask];
        this.setState({tasks: newTasks}, () => this.saveState());
    };

    changeFilter = (newFilterValue) => {
        this.setState({
            filterValue: newFilterValue
        },  () => this.saveState());
    };

    changeStatus = (taskId, isDone) => {
        this.changeTask(taskId, {isDone: isDone});
    };

    changeTitle = (taskId, title) => {
         this.changeTask(taskId, {title: title});
    };

    changeTask = (taskId, object) => {
        let newTasks = this.state.tasks.map( task => {
            if (task.id !== taskId) return task;
            else {
                return {...task, ...object}
            }
        });
        this.setState({tasks: newTasks},  () => this.saveState());
    };

    state = {
        tasks: [],
        filterValue: 'All',
    };

    render() {
        window.store = this.state;
        let filteredTasks = this.state.tasks.filter(task => {
            return this.state.filterValue === 'All' ? true :
            this.state.filterValue === 'Completed' && task.isDone === true ? true :
            this.state.filterValue === 'Active' && task.isDone === false
        });

        return (
            <div className="App">
                <div className="todoList">
                    <TodoListHeader onAddTaskClick={this.onAddTaskClick}/>
                    <TodoListTasks tasks={filteredTasks} changeStatus={this.changeStatus}
                                   changeTitle={this.changeTitle}/>
                    <TodoListFooter filterValue={this.state.filterValue} changeFilter={this.changeFilter}/>
                </div>
            </div>
        );
    }
}

export default App;

