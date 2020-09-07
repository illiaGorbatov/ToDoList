import React from "react";
import styled from "styled-components/macro";
import {animated, SpringValue} from "react-spring";
import {defaultPalette, NeumorphColorsType} from "../../neumorphColors";
import {isMobile} from "react-device-detect";
import {ReactEventHandlers} from "react-use-gesture/dist/types";
import isEqual from "react-fast-compare";

const ScrollBarWrapper = styled(animated.div)<{ $palette: NeumorphColorsType, $visible: boolean, $editable: boolean, $interfaceHeight: number }>`
  position: absolute;
  width: 30px;
  border-radius: 10px;
  height: ${props => props.$editable ? window.innerHeight - props.$interfaceHeight : window.innerHeight}px;
  top: ${props => props.$editable ? props.$interfaceHeight : 0}px;
  right: ${props => props.$visible ? 0 : -50}px;
  overflow: hidden;
  transition: .6s cubic-bezier(0.25, 0, 0, 1);
  background: ${props => props.$palette.progressBarColor};
`;

const ScrollBarThing = styled(animated.div)<{ $palette: NeumorphColorsType, $height: number, $drugged: boolean }>`
  position: absolute;
  width: 20px;
  left: 50%;
  transform: translateX(-50%);
  height: ${props => props.$height}%;
  border-radius: 10px;
  transition: background 0.3s cubic-bezier(0.25, 0, 0, 1);
  background: ${props => props.$drugged ? defaultPalette.background : props.$palette.background};
  cursor: grab;
  &:active {
      cursor: grabbing;
      background-color: ${props => props.$palette.progressBarHoverColor}
  }
  &:hover {
      background-color: ${props => props.$palette.progressBarHoverColor}
  }
`;

type PropsType = {
    palette: NeumorphColorsType,
    visible: boolean,
    editable: boolean,
    interfaceHeight: number,
    drugged: boolean,
    top: SpringValue<string>,
    bindDraggedScrollBar: (...args: any[]) => ReactEventHandlers,
    scrollBarHeight: number
}

const ScrollBar: React.FC<PropsType> = ({
                                            palette, interfaceHeight, editable, bindDraggedScrollBar, scrollBarHeight,
                                            visible, drugged, top
                                        }) => {

    return (
        <ScrollBarWrapper $palette={palette} $visible={visible}
                          $editable={editable} $interfaceHeight={interfaceHeight}>
            <ScrollBarThing $palette={palette} $drugged={drugged}
                            style={{top}} {...!isMobile && {...bindDraggedScrollBar()}}
                            $height={scrollBarHeight}/>
        </ScrollBarWrapper>
    )
}

export default React.memo(ScrollBar, isEqual)