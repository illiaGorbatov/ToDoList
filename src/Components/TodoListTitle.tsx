import React from "react";
import '../App.css';

type PropsType = {
    title: string;
    onClickHandler?: () => void;
};

const TodoListTitle: React.FC<PropsType> = (props) => {
    return (
        <h3 className="todoList-header__title" onClick={props.onClickHandler}>{props.title}</h3>
    );
}

export default TodoListTitle;

