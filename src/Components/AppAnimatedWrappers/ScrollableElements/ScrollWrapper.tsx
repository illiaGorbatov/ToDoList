import React from "react";
import styled from "styled-components/macro";
import {animated, SpringValue} from "react-spring";
import {isMobile} from "react-device-detect";

const AllLists = styled(animated.div)<{ $editable: boolean, $closeLook: boolean, $interfaceHeight: number }>`
  position: relative;
  transform-style: preserve-3d;
  width: 70vw;
  top: ${props => props.$editable && !props.$closeLook ? props.$interfaceHeight : 0}px;
  height: calc(100vh - 280px);
  transform-origin: 50% 100%;
  @media screen and (max-width: 1210px) {
    transition: top 0.5s cubic-bezier(0.25, 0, 0, 1);
    top: ${props => props.$editable ? `${props.$interfaceHeight}px` : props.$closeLook ?
    '0px' : '-38vh'};
    width: 90vw
  }
`;

const ScrollWrapper = styled(animated.div)<{ $top: number }>`
  position: absolute;
  transform-style: preserve-3d;
  width: 100%;
  z-index: 1;
  left: 50%;
  top: ${props => props.$top}px;
  transition: top 0.5s cubic-bezier(0.25, 0, 0, 1);
  max-width: 2000px;
`;

type PropsType = {
    wrapperAnimation: { x: SpringValue<string>, rotateX: SpringValue<number>, rotateZ: SpringValue<number>, y: SpringValue<number> },
    editable: boolean,
    closeLook: boolean,
    interfaceHeight: number,
    y: SpringValue<number>,
    height: SpringValue<number>,
    measuredRef: React.RefObject<HTMLDivElement>,
    visible: boolean,
}

const ScrollableWrapper: React.FC<PropsType> = ({
                                                children, wrapperAnimation,
                                                editable, closeLook, height, interfaceHeight,
                                                y, visible, measuredRef
                                            }) => {

    return (
        <AllLists style={wrapperAnimation} $editable={editable} $closeLook={closeLook}
                  $interfaceHeight={interfaceHeight}>
            <ScrollWrapper style={{y, height, translateX: '-50%'}}
                               ref={measuredRef} //here
                               $top={closeLook && visible && isMobile ? 50 : closeLook && visible && !isMobile ? 125 : 25}>
                {children}
            </ScrollWrapper>
        </AllLists>
    )
}

export default ScrollableWrapper