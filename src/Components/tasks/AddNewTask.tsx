import React, {useEffect, useRef} from "react";
import styled from "styled-components/macro";
import {animated, useSpring} from "react-spring";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useHover} from "react-use-gesture";
import {useMeasure} from "../../hooks/useMesure";

const HeightWrapper = styled.div`
  overflow: hidden;
`;

const AddItemWrapper = styled(animated.div)`
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: fit-content;
  cursor: pointer;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.8);
`;

const PlusWrapper = styled.span`
  font-size: 30px;
  padding: 5px;
`;

const WidthWrapper = styled(animated.div)`
  overflow: hidden;
  position: relative;
`;

const AddItemText = styled.span`
  font-size: 15px;
  position: absolute;
  text-transform: none;
  white-space: nowrap;
`;

type PropsType = {
    addTask: () => void;
    itemType: string,
    editable: boolean
};

const AddNewTask: React.FC<PropsType> = ({addTask, itemType, editable}) => {

    const [bind, {height}] = useMeasure();

    const animatedTop = useSpring({
        y: editable ? 0 : -height,
        delay: editable ? 700 : 0
    });

    const [bindWidth, {width, height: textHeight}] = useMeasure();

    const [animatedHover, setAnimation] = useSpring(() => ({
        width: 0,
        height: textHeight,
        config: {friction: 10, clamp: true}
    }), [textHeight]);

    const hovering = useHover(({hovering}) => {
        if (hovering) setAnimation({
            width: width
        });
        if (!hovering) setAnimation({
            width: 0
        });
    });

    const message = itemType === 'todoList' ? 'Add new To Do List' : 'Add new task';

    return (
        <HeightWrapper {...bind}>
            <AddItemWrapper onClick={addTask} style={animatedTop} {...hovering()}>
                <PlusWrapper>
                    <FontAwesomeIcon icon="plus"/>
                </PlusWrapper>
                <WidthWrapper style={animatedHover}>
                    <AddItemText {...bindWidth}>
                        {message}
                    </AddItemText>
                </WidthWrapper>
            </AddItemWrapper>
        </HeightWrapper>
    );
}

export default AddNewTask;

