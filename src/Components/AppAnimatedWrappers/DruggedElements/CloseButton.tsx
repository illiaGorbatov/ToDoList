import React from "react";
import styled from "styled-components/macro";
import {animated, SpringValue} from "react-spring";
import {shallowEqual, useSelector} from "react-redux";
import {AppStateType} from "../../../redux/store";
import {NeumorphColorsType} from "../../neumorphColors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import isEqual from "react-fast-compare";

const CloseButtonAnimatedWrapper = styled(animated.div)`
  position: absolute;
  border-radius: 100%;
`;

const CloseButton = styled(animated.div)<{ $palette: NeumorphColorsType }>`
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    cursor: pointer;
    font-size: 20px;
    background: ${props => props.$palette.background};
    color: ${props => props.$palette.color};
    box-shadow: ${props => props.$palette.littleShadows};;
    transition: .25s cubic-bezier(0.25, 0, 0, 1);
    &:hover {
        background: ${props => props.$palette.background};
        color: ${props => props.$palette.background};
    }
`;

type PropsType ={
    closeButtonAnimation: {x: SpringValue<number>, y: SpringValue<number>, opacity: SpringValue<number>, display: SpringValue<string>},
    returnFromCloseLook: () => Promise<void>
}

const ClosingButton: React.FC<PropsType> = ({closeButtonAnimation, returnFromCloseLook}) => {

    const currentPalette = useSelector((state: AppStateType) => state.todoList.currentPaletteIndex, shallowEqual);

    return (
        <CloseButtonAnimatedWrapper onClick={returnFromCloseLook} style={closeButtonAnimation}>
            <CloseButton $palette={currentPalette}>
                <FontAwesomeIcon icon="times"/>
            </CloseButton>
        </CloseButtonAnimatedWrapper>
    )
};

export default React.memo(ClosingButton, isEqual)