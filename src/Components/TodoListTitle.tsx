import * as React from 'react'
import '../App.css';

type OwnPropsType = {
    title: string;
    onClickHandler?: () => void;
};

const TodoListTitle: React.FC<OwnPropsType> = (props) => {
    return (
        <h3 className="todoList-header__title" onClick={props.onClickHandler}>{props.title}</h3>
    );
}

export default TodoListTitle;

