import React from "react";
import '../../App.css';
import styled from "styled-components/macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NeumorphColorsType} from "./TodoList";

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

const Button = styled.div<{ background: NeumorphColorsType }>`
    display: grid;
    place-items: center;
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 100%;
    cursor: pointer;
    font-size: 20px;
    background: ${props => props.background.background};
    color: ${props => props.background.color};
    transform: translate(-50%, -50%);
    transition: .25s cubic-bezier(0.25, 0, 0, 1);
    &:hover {
        background-color: ${props => props.background.hoveredAltBackground};
        color: ${props => props.background.hoveredColor};
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
    colors: NeumorphColorsType,
    deleteTodoList: () => void,
    addTask: () => void,
    editList: () => void
};

const ContextButtons: React.FC<PropsType> = ({colors, deleteTodoList, addTask, editList}) => {

    return (
        <ButtonWrapper>
            <Button background={colors}
                    onClick={addTask}>
                <FontAwesomeIcon icon="plus"/>
            </Button>
            <Button background={colors}
                    onClick={deleteTodoList}>
                <FontAwesomeIcon icon="trash"/>
            </Button>
            <Button background={colors}
                    onClick={editList}>
                <FontAwesomeIcon icon="edit"/>
            </Button>
        </ButtonWrapper>
    );
}

export default React.memo(ContextButtons);

