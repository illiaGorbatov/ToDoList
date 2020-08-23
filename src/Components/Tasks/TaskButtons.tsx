import React from "react";
import styled from "styled-components/macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NeumorphColorsType} from "../neumorphColors";
import {useDrag} from "react-use-gesture";

export const TaskButtonWrapper = styled.div`
    z-index: 0;
    position: absolute;
    width: 0;
    height: 0;
    transform: translateX(-70%);
    transition: .25s cubic-bezier(0.25, 0, 0, 1);
    overflow: hidden;
`;

const Button = styled.div<{$palette: NeumorphColorsType}>`
    display: grid;
    place-items: center;
    position: absolute;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    left: 10px;
    font-size: 15px;
    border-radius: 100%;
    background-color: ${props => props.$palette.background};
    box-shadow: ${props => props.$palette.littleShadows};
    color: ${props => props.$palette.color};
    transition: .25s cubic-bezier(0.25, 0, 0, 1);
    &:hover {
        background-color: ${props => props.$palette.color};
        color: ${props => props.$palette.background};
    }
    &:first-child:nth-last-child(2),
        &:first-child:nth-last-child(2) ~ * { 
            &:nth-child(1) {
                top: 5px;
            }
            &:nth-child(2) {
                bottom: 5px;
            }
        }
`;


type PropsType = {
    deleteTask: () => void;
    editTask: () => void;
    palette: NeumorphColorsType
}

const TaskButtons: React.FC<PropsType> = ({deleteTask, editTask, palette}) => {

    const onEditClickHandler = useDrag(({tap, event}) => {
        event?.stopPropagation()
        if (tap) editTask()
    });

    const onDeleteClickHandler = useDrag(({tap, event}) => {
        event?.stopPropagation()
        if (tap) deleteTask()
    })

    return (
        <TaskButtonWrapper>
            <Button {...onEditClickHandler()} $palette={palette}>
                <FontAwesomeIcon icon="edit"/>
            </Button>
            <Button {...onDeleteClickHandler()} $palette={palette}>
                <FontAwesomeIcon icon="trash"/>
            </Button>
        </TaskButtonWrapper>
    );
}

export default React.memo(TaskButtons);

