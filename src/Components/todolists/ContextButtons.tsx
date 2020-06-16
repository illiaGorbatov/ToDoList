import React from "react";
import '../../App.css';
import styled from "styled-components/macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const ButtonWrapper = styled.div`
    z-index: 0;
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    border-radius: 100%;
    width: 0rem;
    height: 0rem;
    transform: translate(-50%, -50%);
    transition: .25s cubic-bezier(0.25, 0, 0, 1);
    overflow: hidden;
`;

const Button = styled.div<{ background: string }>`
    display: grid;
    place-items: center;
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 100%;
    cursor: pointer;
    font-size: 20px;
    background-image: ${props => props.background};
    transform: translate(-50%, -50%);
    transition: .25s cubic-bezier(0.25, 0, 0, 1);
    &:hover {
        background-image: linear-gradient(135deg, #ca6a9a 0%, #ca6a9a 100%);
        color: white
    }
    &:first-child:nth-last-child(3),
        &:first-child:nth-last-child(3) ~ * {
            &:nth-child(1) {
                left:50%;
                top:15.625%;
            }
            &:nth-child(2) {
                left:25%;
                top:25%;
            }
            &:nth-child(3) {
                left:15.625%;
                top:50%;
            }
        }
`;

type PropsType = {
    color: string,
    deleteTodoList: () => void,
    addTask: () => void,
    editList: () => void
};

const ContextButtons: React.FC<PropsType> = ({color, deleteTodoList, addTask, editList}) => {

    return (
        <ButtonWrapper>
            <Button background={color}
                    onClick={addTask}>
                <FontAwesomeIcon icon="plus"/>
            </Button>
            <Button background={color}
                    onClick={deleteTodoList}>
                <FontAwesomeIcon icon="trash"/>
            </Button>
            <Button background={color}
                    onClick={editList}>
                <FontAwesomeIcon icon="edit"/>
            </Button>
        </ButtonWrapper>
    );
}

export default React.memo(ContextButtons);

