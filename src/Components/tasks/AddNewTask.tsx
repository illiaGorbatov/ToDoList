import React, {useRef} from "react";
import styled from "styled-components/macro";
import {animated, useSpring} from "react-spring";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const AddItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: fit-content;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid black;
`;

const AddItemText = styled(animated.span)`
  
`;

type PropsType = {
    addTask: () => void;
    itemType: string
};

const AddNewTask: React.FC<PropsType> = ({addTask, itemType}) => {

    const ref = useRef<HTMLDivElement>(null);

    const [{fontSize}, setSpring] = useSpring(() => ({
        fontSize: '30px',

    }));

    const message = itemType === 'todoList' ? 'Add new To Do List' : 'Add new task';

    return (
        <AddItemWrapper onClick={addTask}>
            <animated.span style={{fontSize}}>
                <FontAwesomeIcon icon="plus"/>
            </animated.span>
            <AddItemText ref={ref}>
                {message}
            </AddItemText>
        </AddItemWrapper>
    );
}

export default AddNewTask;

