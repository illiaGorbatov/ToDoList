import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {animated} from "react-spring";
import {shallowEqual, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {neumorphColors} from "../neumorphColors";

const ScrollBarWrapper = styled.div<{$palette: number | null, $visible: boolean}>`
  position: absolute;
  width: 30px;
  height: 100vh;
  top: 0;
  right: 0;
  background-image: ${props => typeof props.$palette === 'number' ?
    neumorphColors[props.$palette].backgroundOuter : 'white'};
  box-shadow: ${props => typeof props.$palette === 'number' ?
    neumorphColors[props.$palette].shadowsFocused : 'inset 11px 11px 23px rgba(0, 0, 0, .4), inset -11px -11px 23px rgba(255, 255, 255, .4)'};
`;

const ScrollBarThing = styled(animated.div)<{$palette: number | null, $height: number}>`
  position: absolute;
  width: 20px;
  left: 50%;
  transform: translateX(-50%);
  height: ${props => props.$height}%;
  background-image: ${props => typeof props.$palette === 'number' ?
    neumorphColors[props.$palette].backgroundOuter : 'black'};
`;

type PropsType = {
    scrolledY:  React.MutableRefObject<number>,
    onScrollHandler: (scrolledPercentage: number) => void,
}

const ScrollBar: React.FC<PropsType> = ({scrolledY, onScrollHandler}) => {

    const currentPalette = useSelector((store: AppStateType) => store.todoList.currentPaletteIndex, shallowEqual);
    const height = useSelector((store: AppStateType) => store.todoList.height, shallowEqual);

    const [visible, setVisible] = useState<boolean>(true);
    useEffect(() => {
        if (height < window.innerHeight) setVisible(false)
    }, [height])

    return(
        <ScrollBarWrapper $palette={currentPalette} $visible={visible}>
            <ScrollBarThing $palette={currentPalette} $height={!height ? 0 : window.innerHeight / height * 100}/>
        </ScrollBarWrapper>
    )
}

export default ScrollBar