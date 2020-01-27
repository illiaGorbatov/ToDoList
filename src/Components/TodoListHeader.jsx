import React from 'react';
import '../App.css';

class TodoListHeader extends React.Component {

    constructor(props) {
        super(props);
        this.headerInput = React.createRef();
    };

    onAddTaskClickHandler = () => {
        let newValue = this.headerInput.current.value;
        this.props.onAddTaskClick(newValue);
        this.headerInput.current.value = '';
    };

    render() {
        return (
            <div className="todoList-header">
                <h3 className="todoList-header__title">What to Learn</h3>
                <div className="todoList-newTaskForm">
                    <input type="text" placeholder="New task name" ref={this.headerInput}/>
                    <button onClick={this.onAddTaskClickHandler}>Add</button>
                </div>
            </div>
        );
    }
}

export default TodoListHeader;

