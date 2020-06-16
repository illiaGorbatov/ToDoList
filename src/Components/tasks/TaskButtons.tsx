import React from "react";
import styled from "styled-components/macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const TaskButtonWrapper = styled.div`
    z-index: 0;
    position: absolute;
    width: 0rem;
    height: 0rem;
    transform: translateX(-70%);
    transition: .25s cubic-bezier(0.25, 0, 0, 1);
    overflow: hidden;
`;

const Button = styled.div`
    display: grid;
    place-items: center;
    position: absolute;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    font-size: 15px;
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid #ca6a9a;
    transition: .25s cubic-bezier(0.25, 0, 0, 1);
    &:hover {
        background-color: rgba(202, 106, 154, 0.8);
        color: white;
    }
    &:first-child:nth-last-child(2),
        &:first-child:nth-last-child(2) ~ * { 
            &:nth-child(1) {
                left: 0;
                top: 0;
            }
            &:nth-child(2) {
                left: 0;
                bottom: 0;
            }
        }
`;


type PropsType = {
    deleteTask: () => void;
    editTask: () => void
}

const TaskButtons: React.FC<PropsType> = ({deleteTask, editTask}) => {

    return (
        <TaskButtonWrapper>
            <Button onClick={editTask}>
                <FontAwesomeIcon icon="edit"/>
            </Button>
            <Button onClick={deleteTask}>
                <FontAwesomeIcon icon="trash"/>
            </Button>
        </TaskButtonWrapper>
    );
}

export default React.memo(TaskButtons);

