import React, {useEffect, useState} from "react";
import {TaskType} from "../../redux/entities";
import styled from "styled-components/macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {animated, useSpring, useSprings} from "react-spring";

const ButtonWrapper = styled.div<{hoveredState: boolean}>`
    position: absolute;
    transform: translate(${props => props.hoveredState ? '-50%, -50%' : '0%, -50%'});
    height: ${props => props.hoveredState ? '70px' : '0px'};
    left: -15px;
    top: 50%;
    width: 3rem
`;

const Button = styled(animated.div)`
    display: grid;
    place-items: center;
    position: absolute;
    width: 2rem;
    height: 2rem;
    border-radius: 100%;
    cursor: pointer;
    font-size: 15px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid #ca6a9a;
`;


type PropsType = {
    deleteTask: () => void;
    hovered: boolean,
    editTask: () => void
}

const TaskIcons: React.FC<PropsType> = ({ deleteTask, hovered, editTask}) => {


    const [animations, setAnimation] = useSprings(2, i => ({
        opacity: 0,
        top: '50%',
        left: '50%',
        config: {clamp: true, friction: 15}
    }));

    const [hoveredState, setState] = useState<boolean>(false);
    useEffect(() => {
        hovered && setState(true);
        setAnimation(i => ({
            opacity: hovered ? 1 : 0,
            top: !hovered ? '50%' : i === 0 ? '0%' : '50%',
            left: hovered ? '0%' : '50%',
            onRest: () => i == 1 && !hovered && setState(false)
        }))
    }, [hovered])

    return (
            <ButtonWrapper hoveredState={hoveredState}>
                {animations.map((style, index) =>
                    <Button onClick={index === 0 ? editTask : deleteTask} key={index} style={style}>
                        <FontAwesomeIcon icon={index === 0 ? "edit" : "trash"}/>
                    </Button>
                )}
            </ButtonWrapper>
    );
}

export default React.memo(TaskIcons);

