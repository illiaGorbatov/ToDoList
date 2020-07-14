import React from "react";
import '../../App.css';
import styled from "styled-components/macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { NeumorphColorsType } from "../neumorphColors";

export const ButtonWrapper = styled.div`
    z-index: 0;
    position: absolute;
    top: 15px;
    left: 15px;
    border-radius: 100%;
    width: 0;
    height: 0;
    opacity: 0;
    transform: translate(-50%, -50%);
    transition: opacity .6s cubic-bezier(0.25, 0, 0, 1), width 0s linear .6s, height 0s linear .6s;
`;

export const Button = styled.div<{ styles: NeumorphColorsType }>`
    display: grid;
    place-items: center;
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    cursor: pointer;
    font-size: 20px;
    background: ${props => props.styles.background};
    color: ${props => props.styles.color};
    box-shadow: ${props => props.styles.littleShadows};;
    transform: translate(-50%, -50%);
    transition: .25s cubic-bezier(0.25, 0, 0, 1);
    &:hover {
        background-color: ${props => props.styles.background};
        color: ${props => props.styles.color};
    }
    &:first-child:nth-last-child(3),
        &:first-child:nth-last-child(3) ~ * {
            &:nth-child(1) {
                left: 50px;
                top: 0;
            }
            &:nth-child(2) {
                left: 0;
                top: 0;
            }
            &:nth-child(3) {
                left: 0;
                top: 50px;
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
            <Button styles={colors}
                    onClick={addTask}>
                <FontAwesomeIcon icon="plus"/>
            </Button>
            <Button styles={colors}
                    onClick={deleteTodoList}>
                <FontAwesomeIcon icon="trash"/>
            </Button>
            <Button styles={colors}
                    onClick={editList}>
                <FontAwesomeIcon icon="edit"/>
            </Button>
        </ButtonWrapper>
    );
}

export default React.memo(ContextButtons);

