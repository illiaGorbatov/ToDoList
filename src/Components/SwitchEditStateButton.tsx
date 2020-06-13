import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components/macro";
import {animated, useSpring, useSprings} from "react-spring";
import {actions, submitAllChanges} from "../redux/reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../redux/store";


const CentralCircle = styled.div`
    left: 20px;
    position:absolute;
    width: 20vw;
    height: 20vw;
    min-width: 200px;
    min-height: 200px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    color: white;
    &:hover {
        div:nth-child(2) {
            transform: translate(0px, 75px);
        }
        div:nth-child(3) {
            transform: translate(0px, -75px);
        }
        div:nth-child(4) {
            transform: translate(75px, 0px);
        }
        div:nth-child(5) {
            transform: translate(-75px, 0px);
        }
    }
`;

const Text = styled.div`
    font-size: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 2;
    white-space: nowrap
`;

const OneForAllStyle = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 50%;
`;

const FirstCircle = styled(OneForAllStyle)`
    background-color: #f5576c;
    opacity: 0.5;
    font-size: 40px;
    font-family: "Oswald", sans-serif;
    letter-spacing: 1.5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    transition: 1s;
`;

const SecondCircle = styled(OneForAllStyle)`
    background-color: #a8edea;
    transition: 1s;
    opacity: 0.5;
`;

const ThirdCircle = styled(OneForAllStyle)`
    background-color: #b490ca;
    transition: 1s;
    opacity: 0.5;
`;

const FourthCircle = styled(OneForAllStyle)`
    background-color: #fda085;
    transition: 1s;
    opacity: 0.5;
`;

const FifthCircle = styled(OneForAllStyle)`
    background-color: #96fbc4;
    transition: 1s;
    opacity: 0.5;
`;

const EditButton: React.FC = () => {

    const dispatch = useDispatch();
    const editable = useSelector((state: AppStateType) => state.todoList.editable);

    const switchEditMode = () => {
        if (!editable) dispatch(actions.enableEditMode());
        if (editable) dispatch(submitAllChanges());
    };

    return (
        <CentralCircle onClick={switchEditMode}>
            <Text>
                {editable ? 'Submit changes': 'Edit'}
            </Text>
            <FifthCircle/>
            <FourthCircle/>
            <ThirdCircle/>
            <SecondCircle/>
            <FirstCircle/>
        </CentralCircle>
    );
}

export default EditButton;

