import React from "react";
import styled from "styled-components/macro";
import {animated, SpringValue} from "react-spring";
import {interfacePalette, NeumorphColorsType} from "../../neumorphColors";
import {isMobile} from "react-device-detect";
import {ReactEventHandlers} from "react-use-gesture/dist/types";
import isEqual from "react-fast-compare";

const ScrollBarWrapper = styled(animated.div)<{ $palette: NeumorphColorsType, $visible: boolean, $editable: boolean, $interfaceHeight: number }>`
  position: absolute;
  width: 30px;
  border-radius: 10px;
  height: ${props => props.$editable ? window.innerHeight - props.$interfaceHeight : window.innerHeight}px;
  top: ${props => props.$editable ? props.$interfaceHeight : 0}px;
  right: 0;
  overflow: hidden;
  transition: .6s cubic-bezier(0.25, 0, 0, 1);
  background: ${props => props.$palette.progressBarColor};
  cursor: pointer;
`;

const ScrollBarThing = styled(animated.div)<{ $palette: NeumorphColorsType, $height: number, $drugged: boolean }>`
  position: absolute;
  width: 20px;
  left: 50%;
  transform: translateX(-50%);
  height: ${props => props.$height}%;
  border-radius: 10px;
  transition: background-image 0.3s cubic-bezier(0.25, 0, 0, 1);
  background: ${props => props.$drugged ? interfacePalette.background : props.$palette.background};
  &:before {
      transition: opacity 0.3s cubic-bezier(0.25, 0, 0, 1);
      position: absolute;
      width: 100%;
      height: 100%;
      content: '';
      border-radius: 10px;
      background-color: ${props => props.$palette.default ? interfacePalette.background : 'rgba(0, 0, 0, 0.3)'};
      opacity: 0;
  }
  &:hover:before {
      opacity: 1;
   }
`;

type PropsType = {
    palette: NeumorphColorsType,
    visible: boolean,
    visibilityOfScrollBar: { opacity: SpringValue<number>, right: SpringValue<number>, display: SpringValue<string> },
    editable: boolean,
    interfaceHeight: number,
    drugged: boolean,
    top: SpringValue<string>,
    bindDraggedScrollBar: (...args: any[]) => ReactEventHandlers,
    scrollBarHeight: number
}

const ScrollBar: React.FC<PropsType> = ({
                                            palette, interfaceHeight, editable, bindDraggedScrollBar, scrollBarHeight,
                                            visible, drugged, top, visibilityOfScrollBar
                                        }) => {

    return (
        <ScrollBarWrapper $palette={palette} $visible={visible} style={visibilityOfScrollBar}
                          $editable={editable} $interfaceHeight={interfaceHeight}>
            <ScrollBarThing $palette={palette} $drugged={drugged}
                            style={{top}} {...!isMobile && {...bindDraggedScrollBar()}}
                            $height={scrollBarHeight}/>
        </ScrollBarWrapper>
    )
}

export default React.memo(ScrollBar, isEqual)