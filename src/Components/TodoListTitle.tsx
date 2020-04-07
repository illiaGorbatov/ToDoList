import * as React from 'react'
import '../App.css';

type OwnPropsType = {
    title: string;
    onClickHandler?: () => void;
};

class TodoListTitle extends React.Component<OwnPropsType> {
    render() {
        return (
            <h3 className="todoList-header__title" onClick={this.props.onClickHandler}>{this.props.title}</h3>
        );
    }
}

export default TodoListTitle;

