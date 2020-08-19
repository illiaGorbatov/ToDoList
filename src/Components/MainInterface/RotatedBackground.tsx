import React from "react";
import styled from "styled-components/macro";
import {animated, SpringValue} from "react-spring";
import {interfacePalette, NeumorphColorsType} from "../neumorphColors";
import isEqual from "react-fast-compare";

const Background = styled(animated.div)<{ $palette: NeumorphColorsType }>`
   position: absolute;
   z-index: 998;
   background-color: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
   width: 300%;
   transform-origin: 50% 0;
   left: -150%;
   transition: background-color 0.3s cubic-bezier(0.25, 0, 0, 1);
   &:before {
      position: absolute;
      width: 100%;
      height: 100%;
      content: '';
      background-color: ${props => props.$palette.default ? interfacePalette.background : 'rgba(0, 0, 0, 0.3)'};
   }
`;

type PropsType = {
    palette: NeumorphColorsType,
    height:  SpringValue<number>,
    rotateZ:  SpringValue<number>
}

const RotatedBackground: React.FC<PropsType> = ({palette, height, rotateZ}) => {

    return(
        <Background $palette={palette} style={{height,rotateZ /*translateX: '-50%'*/}}/>
    )
}

export default React.memo(RotatedBackground, isEqual)