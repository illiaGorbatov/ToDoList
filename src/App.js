import React from 'react';
import TodoListHeader from './Components/TodoListHeader.jsx';
import TodoListTasks from './Components/TodoListTasks.jsx';
import TodoListFooter from './Components/TodoListFooter.jsx';
import './App.css'

class App extends React.Component {

    onAddTaskClick = (value) => {
        let newTask = {
            title: value,
            isDone: false,
            priority: 'high',
        };
        let newTasks = [...this.state.tasks, newTask];
        this.setState({tasks: newTasks});
    };

    changeFilter = (newFilterValue) => {
        this.setState({
            filterValue: newFilterValue
        })
    };

    changeStatus = (checkedTask, check) => {
        let newTasks = this.state.tasks.map( task => {
            if (task !== checkedTask) return task;
            else {
                return {...task, isDone: check}
            }
        });
        this.setState({tasks: newTasks})
    };

    state = {
        tasks: [
            {title: 'JS', isDone: true, priority: 'high'},
            {title: 'HTML', isDone: true, priority: 'low'},
            {title: 'CSS', isDone: true, priority: 'high'},
            {title: 'React', isDone: false, priority: 'high'},
        ],
        filterValue: 'All',
    };

    render() {

        let filteredTasks = this.state.tasks.filter(task => {
            return this.state.filterValue === 'All' ? true :
            this.state.filterValue === 'Completed' && task.isDone === true ? true :
            this.state.filterValue === 'Active' && task.isDone === false
        });

        return (
            <div className="App">
                <div className="todoList">
                    <TodoListHeader onAddTaskClick={this.onAddTaskClick}/>
                    <TodoListTasks tasks={filteredTasks} changeStatus={this.changeStatus}/>
                    <TodoListFooter filterValue={this.state.filterValue} changeFilter={this.changeFilter}/>
                </div>
            </div>
        );
    }
}

export default App;

