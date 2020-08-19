import React from "react";
import styled from "styled-components/macro";
import {animated, SpringValue} from "react-spring";
import isEqual from "react-fast-compare";

const WholeWrapper = styled(animated.div)`
  position: absolute;
  font-family: NunitoSans-ExtraLight, sans-serif;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  z-index: 999;
  min-width: 150px;
  min-height: 150px;
`;

const ButtonsWrapper = styled.div`
  position: absolute;
  width: 16vw;
  height: 16vw;
  max-width: 210px;
  min-width: 130px;
  max-height: 210px;
  min-height: 130px;
  border-radius: 50%;
  display: grid;
  place-items: center;
`;

type PropsType = {
    width: SpringValue<string>,
    height: SpringValue<string>
}

const InterfaceWrapper: React.FC<PropsType> = ({width, height, children}) => {

    return(
        <WholeWrapper style={{width, height}}>
            <ButtonsWrapper>
                {children}
            </ButtonsWrapper>
        </WholeWrapper>
    )
}

export default InterfaceWrapper