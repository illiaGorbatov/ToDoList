import * as React from 'react';
import '../App.css';

type OwnPropsType = {
    className: string;
    value: string;
    changeFilter: () => void;
}

class TodoListFooterButton extends React.Component<OwnPropsType> {
    render() {
        return (
            <button className={this.props.className} onClick={this.props.changeFilter}>
                {this.props.value}
            </button>
        );
    }
}

export default TodoListFooterButton;

