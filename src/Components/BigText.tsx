import React from "react";
import styled from "styled-components/macro";
import {animated, useSpring} from "react-spring";
import {useMeasure} from "../hooks/useMesure";

const Wrapper = styled.div`
  position: relative;
  z-index: 2;
  overflow: hidden;
`;

const BigTextWrapper = styled(animated.div)`
  position: relative;
  display: flex;
`;

const TextLine = styled.div`
  font-size: 15vh;
  padding: 0 20vw;
  white-space: nowrap
`;

const LittleText = styled(animated.div)`
  position: absolute;
  font-size: 30px;
`;

const BigText: React.FC = () => {

    const [bind, {width}] = useMeasure();

    const animation = useSpring({
        from: {translateX: 0},
        to: {translateX: -width / 3},
        loop: true,
        config: {duration: 10000}
    });

    return (
        <Wrapper>
            <BigTextWrapper style={animation} {...bind}>
                <TextLine>
                    To Do List
                </TextLine>
                <TextLine>
                    To Do List
                </TextLine>
                <TextLine>
                    To Do List
                </TextLine>
            </BigTextWrapper>
        </Wrapper>
    );
}

export default BigText;

