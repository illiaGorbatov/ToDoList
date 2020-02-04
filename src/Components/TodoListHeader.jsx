import React from 'react';
import '../App.css';

class TodoListHeader extends React.Component {

    state = {
        error: false,
        title: ''
    };

    onTitleChanged = (e) => {
        let newValue = e.currentTarget.value;
        this.setState({title: newValue});
        if (this.state.title !=='')
            this.setState({error: false})
    };

    onAddTaskClickHandler = () => {
        if (this.state.title === '') {
            this.setState({error: true})
        } else {
            this.props.onAddTaskClick(this.state.title);
            this.setState({error: false, title: ''})
        }
    };

    onKeyPressHandler = (e) => {
        if (e.key === "Enter") this.onAddTaskClickHandler()
    };

    render() {
        return (
            <div className="todoList-header">
                <h3 className="todoList-header__title">What to Learn</h3>
                <div className="todoList-newTaskForm">
                    <input type="text" className={this.state.error ? 'error' : false}
                           placeholder="New task name" value={this.state.title}
                           onChange={this.onTitleChanged} onKeyPress={this.onKeyPressHandler}
                    />
                    <button onClick={this.onAddTaskClickHandler}>Add</button>
                </div>
            </div>
        );
    }
}

export default TodoListHeader;

