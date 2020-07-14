import React from "react";
import styled from "styled-components/macro";
import {animated} from "react-spring";
import {shallowEqual, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {NeumorphColorsType} from "../neumorphColors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const CloseButton = styled(animated.div)<{ $palette: NeumorphColorsType}>`
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    cursor: pointer;
    font-size: 20px;
    background: ${props => props.$palette.background};
    color: ${props => props.$palette.background};
    box-shadow: ${props => props.$palette.littleShadows};;
    transition: .25s cubic-bezier(0.25, 0, 0, 1);
    &:hover {
        background: ${props => props.$palette.background};
        color: ${props => props.$palette.background};
    }
`;

const ClosingButton: React.FC = () => {

    const currentPalette = useSelector((state: AppStateType) => state.todoList.currentPaletteIndex, shallowEqual);

    return(
        <CloseButton $palette={currentPalette}>
            <FontAwesomeIcon icon="times"/>
        </CloseButton>
    )
};

export default ClosingButton