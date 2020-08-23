import React from "react";
import styled from "styled-components/macro";
import {animated, SpringValue} from "react-spring";
import {defaultPalette, NeumorphColorsType} from "../neumorphColors";
import isEqual from "react-fast-compare";

const Background = styled(animated.div)<{ $palette: NeumorphColorsType }>`
   position: absolute;
   z-index: 998;
   background-color: ${props => props.$palette.default ? defaultPalette.background : props.$palette.background};
   width: 300%;
   transform-origin: 50% 0;
   left: -150%;
   transition: background-color 0.3s cubic-bezier(0.25, 0, 0, 1);
   box-shadow: ${props => props.$palette.default ? defaultPalette.shadows : props.$palette.shadows};
`;

const InnerShadow = styled.div<{ $palette: NeumorphColorsType }>`
  position: absolute;
  bottom: 10px;
  width: 100%;
  height: calc(100% - 10px);
  box-shadow: ${props => props.$palette.default ? defaultPalette.innerShadows : props.$palette.innerShadows};
`;

type PropsType = {
    palette: NeumorphColorsType,
    height:  SpringValue<number>,
    rotateZ:  SpringValue<number>,
    x: SpringValue<string>
}

const RotatedBackground: React.FC<PropsType> = ({palette, height, rotateZ, x}) => {

    return(
        <Background $palette={palette} style={{height, rotateZ, x}}>
            <InnerShadow $palette={palette}/>
        </Background>
    )
}

export default React.memo(RotatedBackground, isEqual)