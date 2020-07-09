import React from "react";
import styled from "styled-components/macro";
import {animated} from "react-spring";
import {shallowEqual, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {neumorphColors} from "../neumorphColors";

const ScrollBarWrapper = styled.div<{$palette: number | null}>`
  position: absolute;
  width: 30px;
  height: 100vh;
  top: 0;
  right: 0;
  background-image: ${props => typeof props.$palette === 'number' ?
    neumorphColors[props.$palette].backgroundOuter : 'white'};
  box-shadow: ${props => typeof props.$palette === 'number' ?
    neumorphColors[props.$palette].innerShadows : '11px 11px 23px rgba(0, 0, 0, .4), -11px -11px 23px rgba(255, 255, 255, .4)'};
`;

const ScrollBarThing = styled(animated.div)<{$palette: number | null}>`
  position: absolute;
  height: 0;
  width: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-image: ${props => typeof props.$palette === 'number' ?
    neumorphColors[props.$palette].backgroundOuter : 'white'};
`;

type PropsType = {
    scrolledY:  React.MutableRefObject<number>,
    onScrollHandler: (scrolledPercentage: number) => void
}

const ScrollBar: React.FC<PropsType> = ({scrolledY, onScrollHandler}) => {

    const currentPalette = useSelector((store: AppStateType) => store.todoList.currentPaletteIndex, shallowEqual);

    return(
        <ScrollBarWrapper $palette={currentPalette}>
            <ScrollBarThing $palette={currentPalette}/>
        </ScrollBarWrapper>
    )
}

export default ScrollBar