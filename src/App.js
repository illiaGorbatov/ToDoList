import React from 'react';
import TodoListHeader from './Components/TodoListHeader.jsx';
import TodoListTasks from './Components/TodoListTasks.jsx';
import TodoListFooter from './Components/TodoListFooter.jsx';
import './App.css'

class App extends React.Component {

    tasks = [
        {title: 'JS', isDone: true, priority: 'high'},
        {title: 'HTML', isDone: true, priority: 'low'},
        {title: 'CSS', isDone: true, priority: 'high'},
        {title: 'React', isDone: false, priority: 'high'},
    ];

    filterValue = 'All';

    render() {
        return (
            <div className="App">
                <div className="todoList">
                    <TodoListHeader/>
                    <TodoListTasks tasks={this.tasks}/>
                    <TodoListFooter filterValue={this.filterValue}/>
                </div>
            </div>
        );
    }
}

export default App;

