import React from "react";
import styled from "styled-components/macro";
import {animated, useSpring} from "react-spring";

const Modal = styled.div<{zIndex: number}>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: ${props => props.zIndex};
  background-color: gray;
`;

type PropsType = {
    zIndex: number
}

const ModalWrapper: React.FC<PropsType> = ({zIndex}) => {
    return (
        <Modal zIndex={zIndex}/>
    );
}

export default ModalWrapper;

