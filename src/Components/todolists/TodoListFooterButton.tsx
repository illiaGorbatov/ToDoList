import React from "react";
import '../../App.css';

type PropsType = {
    className: string;
    value: string;
    changeFilter: () => void;
}

const TodoListFooterButton: React.FC<PropsType> = (props) => {
    return (
        <button className={props.className} onClick={props.changeFilter}>
            {props.value}
        </button>
    );
}

export default TodoListFooterButton;

