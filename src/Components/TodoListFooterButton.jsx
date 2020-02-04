import React from 'react';
import '../App.css';

class TodoListFooterButton extends React.Component {
    render() {
        return (
            <button className={this.props.className} onClick={this.props.changeFilter}>
                {this.props.value}
            </button>
        );
    }
}

export default TodoListFooterButton;

