import React from "react";
import styled from "styled-components/macro";
import {animated} from "react-spring";
import {shallowEqual, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {neumorphColors} from "../neumorphColors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const CloseButton = styled(animated.div)<{ $currentPalette: number | null}>`
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    cursor: pointer;
    font-size: 20px;
    background: ${props => typeof props.$currentPalette === 'number' ? neumorphColors[props.$currentPalette].background :
        'white'};
    color: ${props => typeof props.$currentPalette === 'number' ? neumorphColors[props.$currentPalette].color : 'white'};
    box-shadow: ${props =>  typeof props.$currentPalette === 'number' ? neumorphColors[props.$currentPalette].innerShadows : 'none'};;
    transition: .25s cubic-bezier(0.25, 0, 0, 1);
    &:hover {
        background-color: ${props =>  typeof props.$currentPalette === 'number' ? 
            neumorphColors[props.$currentPalette].hoveredAltBackground : 'white'};
        color: ${props =>  typeof props.$currentPalette === 'number' ? 
            neumorphColors[props.$currentPalette].hoveredColor : 'white'};
    }
`;

const ClosingButton: React.FC = () => {

    const currentPalette = useSelector((state: AppStateType) => state.todoList.currentPaletteIndex, shallowEqual);

    return(
        <CloseButton $currentPalette={currentPalette}>
            <FontAwesomeIcon icon="times"/>
        </CloseButton>
    )
};

export default ClosingButton