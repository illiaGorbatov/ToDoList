import React from "react";
import styled from "styled-components/macro";
import {animated, SpringValue} from "react-spring";

const WholeWrapper = styled(animated.div)`
  position: absolute;
  font-family: 'Made Evolve Sans Light', sans-serif;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  z-index: 999;
`;

const ButtonsWrapper = styled.div<{$height: number}>`
  position: absolute;
  width: ${props => props.$height * 0.8}px;
  height: ${props => props.$height * 0.8}px;
  border-radius:30px;
  display: grid;
  place-items: center;
`;

type PropsType = {
    width: SpringValue<number>,
    height: SpringValue<number>,
    interfaceHeight: number,
    x: SpringValue<string>
}

const InterfaceWrapper: React.FC<PropsType> = ({width, height, children,
                                               interfaceHeight, x}) => {

    return(
        <WholeWrapper style={{width, height, x}}>
            <ButtonsWrapper $height={interfaceHeight}>
                {children}
            </ButtonsWrapper>
        </WholeWrapper>
    )
}

export default InterfaceWrapper