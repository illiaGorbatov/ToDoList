import React from "react";
import '../App.css';
import styled from "styled-components/macro";

const ListTitle = styled.div`
  font-family: 'DINNextLTPro-Bold';
  font-size: 20px;
  text-align: center;
  padding: 5px 0;
`;

type PropsType = {
    title: string;
    onClickHandler?: () => void;
};

const TodoListTitle: React.FC<PropsType> = (props) => {
    return (
        <ListTitle className="todoList-header__title" onClick={props.onClickHandler}>
            {props.title}
        </ListTitle>
    );
}

export default React.memo(TodoListTitle);

