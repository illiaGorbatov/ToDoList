import React, {useEffect, useState} from "react";
import {TaskType} from "../../redux/entities";
import styled from "styled-components/macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {animated, useSpring, useSprings} from "react-spring";
import {NeumorphColorsType} from "../neumorphColors";

const CheckboxWrapper = styled(animated.div)`
    width: 31px;
    height:31px;
    position: relative;
    padding-top: 10px;
    padding-left: 10px;
    --background: #fff;
    --border: #D1D6EE;
    --border-hover: #BBC1E1;
    --border-active: #1E2235;
    --tick: #fff;
`;

const Checkbox = styled.input`
    z-index: 9;
    width: 21px;
    height: 21px;
    display: block;
    -webkit-appearance: none;
    -moz-appearance: none;
    position: relative;
    outline: none;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    border-radius: 4px;
    transition: box-shadow .3s;
    box-shadow: inset 0 0 0 var(--s, 1px) var(--b, var(--border));
    &:hover {
        --s: 2px;
        --b: var(--border-hover);
    }
    &:checked {
        --b: var(--border-active);
        --s: 2px;
        transition-delay: .4s;
        & + svg {
            --a: 16.1 86.12;
            --o: 102.22;
        }
    }
`;

const Svg = styled.svg`
    z-index: 10;
    width: 21px;
    height: 21px;
    display: block;
    pointer-events: none;
    fill: none;
    stroke-width: 2px;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: var(--stroke, var(--border-active));
    position: absolute;
    top: 10px;
    left: 10px;
    transform: scale(var(--scale, 1)) translateZ(0);
    stroke-dasharray: var(--a, 86.12);
    stroke-dashoffset: var(--o, 86.12);
    transition: stroke-dasharray .6s, stroke-dashoffset .6s;
`;

type PropsType = {
    task: TaskType;
    changeDoneStatus: (e: React.ChangeEvent<HTMLInputElement>) => void,
    editable: boolean,
    palette: NeumorphColorsType
}

const TaskCheckbox: React.FC<PropsType> = ({task, changeDoneStatus, editable, palette}) => {

    const animation = useSpring({
        left: editable ? -32 : 0,
    });

    return (
        <CheckboxWrapper style={animation}>
            <Checkbox type="checkbox" checked={task.status === 2} disabled={editable}
                      onChange={(e) => changeDoneStatus(e)}/>
            <Svg>
                <path
                    d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"/>
            </Svg>
        </CheckboxWrapper>
    );
}

export default React.memo(TaskCheckbox);

