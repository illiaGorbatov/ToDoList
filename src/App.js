import React from 'react';
import { TodoListHeader } from './Components/TodoListHeader.jsx';
import { TodoListTasks } from './Components/TodoListTasks.jsx';
import { TodoListFooter } from './Components/TodoListFooter.jsx';
import './App.css'

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <div className="todoList">
                    <TodoListHeader />
                    <TodoListTasks />
                    <TodoListFooter />
                </div>
            </div>
        );
    }
}

export default App;

