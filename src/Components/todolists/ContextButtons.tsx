import React, {useEffect, useState} from "react";
import '../../App.css';
import styled from "styled-components/macro";
import {animated, useSprings, useSpring, useTrail} from "react-spring";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ButtonWrapper = styled.div<{hoveredState: boolean}>`
    position: absolute;
    z-index: 2;
    border-radius:100%;
    width: 160px;
    height: 160px;
    transform: translate(${props => props.hoveredState ? '-50%, -50%' : '0%, 0%'});
    opacity: ${props => props.hoveredState ? 1 : 0};
`;

const Button = styled(animated.div)<{background: string}>`
    display: grid;
    place-items: center;
    position: absolute;
    width: 3rem;
    height: 3rem;
    border-radius: 100%;
    cursor: pointer;
    font-size: 20px;
    background-image: ${props => props.background};
`;

type PropsType = {
    hovered: boolean,
    color: string,
    deleteTodoList: () => void,
    addTask: () => void,
    editList: () => void
};

const ContextButtons: React.FC<PropsType> = ({hovered, color, deleteTodoList, addTask, editList}) => {

    const [animations, setAnimation] = useSprings(3, i => ({
        top: '60%',
        left: '60%',
        config: {clamp: true, friction: 15}
    }));

    const [hoveredState, setState] = useState<boolean>(false);
    useEffect(() => {
        hovered && setState(true);
        setAnimation(i => ({
            top: !hovered ? '60%' : i === 0 ? '50%' : i === 1 ? '10%' : '0%',
            left: !hovered ? '60%' : i === 0 ? '0%' : i === 1 ? '10%' : '50%',
            onRest: () => i === 2 && !hovered && setState(false)
        }))
    }, [hovered])

    return (
        <ButtonWrapper hoveredState={hoveredState}>
            {animations.map((springs, index) =>
                <Button style={springs} background={color} key={index}
                         onClick={index === 0 ? addTask : index === 1 ? deleteTodoList : editList}>
                    <FontAwesomeIcon icon={index === 0 ? "plus" : index === 1 ? "trash" : "edit"}/>
                </Button>
            )}
        </ButtonWrapper>
    );
}

export default React.memo(ContextButtons);

