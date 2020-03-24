import React from 'react';
import '../App.css';

class AddNewItemForm extends React.Component {

    state = {
        error: false,
        title: ''
    };

    onTitleChanged = (e) => {
        let newValue = e.currentTarget.value;
        this.setState({title: newValue});
        if (this.state.title !== '')
            this.setState({error: false})
    };

    onAddItemClickHandler = () => {
        if (this.state.title === '') {
            this.setState({error: true})
        } else {
            this.props.onAddItemClick(this.state.title);
            this.setState({error: false, title: ''})
        }
    };

    onKeyPressHandler = (e) => {
        if (e.key === "Enter") this.onAddItemClickHandler()
    };

    render() {
        return (
            <div className="todoList-newTaskForm">
                <input type="text" className={this.state.error ? 'error' : ''}
                       placeholder="New item name" value={this.state.title}
                       onChange={this.onTitleChanged} onKeyPress={this.onKeyPressHandler}
                />
                <button onClick={this.onAddItemClickHandler}>Add</button>
            </div>
        );
    }
}

export default AddNewItemForm;

