import React from "react";
import '../App.css';

type OwnPropsType = {
    className: string;
    value: string;
    changeFilter: () => void;
}

const TodoListFooterButton: React.FC<OwnPropsType> = (props) => {
    return (
        <button className={props.className} onClick={props.changeFilter}>
            {props.value}
        </button>
    );
}

export default TodoListFooterButton;

