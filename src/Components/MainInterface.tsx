import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components/macro";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../redux/store";
import {actions, submitAllChanges} from "../redux/functionalReducer";
import {animated, useSpring, useTransition} from "react-spring";
import {neumorphColors} from "./neumorphColors";

const Wrapper = styled(animated.div)`
  position: absolute;
  font-family: NunitoSans-ExtraLight, sans-serif;
  backdrop-filter: blur(5px);
  box-sizing: border-box;
  display: grid;
  place-items: center;
  min-height: min-content;
  max-height: min-content;
  z-index: 999;
`;

const ButtonsWrapper = styled.div`
  position: absolute;
  width: 16vw;
  height: 16vw;
  max-width: 210px;
  min-width: 150px;
  max-height: 210px;
  min-height: 150px;
  border-radius: 50%;
  display: grid;
  place-items: center;
`;

const EditButton = styled.div<{ $currentPalette: number | null }>`
  cursor: pointer;
  position: relative;
  z-index: 3;
  width: 15vw;
  height: 15vw;
  max-width: 210px;
  min-width: 150px;
  max-height: 210px;
  min-height: 150px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: ${props => typeof props.$currentPalette === 'number' ? neumorphColors[props.$currentPalette].innerShadows :
    '11px 11px 23px rgba(0, 0, 0, .4), -11px -11px 23px rgba(255, 255, 255, .4)'} ;
  background: ${props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].background : 'white'};
`;

const ProgressBackground = styled(animated.div)`
  width: 110%;
  height: 110%;
  border-radius: 50%;
  top: -5%;
  left: -5%;
  background-color: red;
  display: grid;
  place-items: center;
  position: absolute;
  
`;

const InnerBackground = styled.div<{ $currentPalette: number | null, $altBackground: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  background: ${props => typeof props.$currentPalette === 'number' && !props.$altBackground ?
    neumorphColors[props.$currentPalette].background : typeof props.$currentPalette === 'number' && props.$altBackground ?
        neumorphColors[props.$currentPalette].hoveredAltBackground : props.$altBackground ? 'black' : 'white'};
  color: ${props => typeof props.$currentPalette === 'number' && !props.$altBackground ?
    neumorphColors[props.$currentPalette].color : typeof props.$currentPalette === 'number' && props.$altBackground ?
        neumorphColors[props.$currentPalette].hoveredColor : props.$altBackground ? 'white' : 'black'};
  display: grid;
  place-items: center;
  border-radius: 50%;
  transition: 0.3s cubic-bezier(0.25, 0, 0, 1);
  ${props => !props.$altBackground && 
    `&:hover {
        background: ${typeof props.$currentPalette === 'number' ?
        neumorphColors[props.$currentPalette].hoveredAltBackground : 'black'};
        color: ${typeof props.$currentPalette === 'number' ?
        neumorphColors[props.$currentPalette].hoveredColor : 'white'};
  }`}
`;

//calc([minimum size] + ([maximum size] - [minimum size]) * ((100vw - [minimum viewport width]) / ([maximum viewport width] - [minimum viewport width])));
const InnerEditButtonText = styled(animated.div)`
  z-index: 12;
  text-align: center;
  position: absolute;
  overflow: hidden;
  top: 50%;
  font-size: calc(15px + (50 - 15) * ((100vw - 100px) / (1200 - 100)));
`;

const SmallerButton = styled(animated.div)<{ $currentPalette: number | null }>`
  cursor: pointer;
  position: absolute;
  z-index: 2;
  width: 7vw;
  height: 7vw;
  max-width: 105px;
  min-width: 70px;
  max-height: 105px;
  min-height: 70px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: ${props => typeof props.$currentPalette === 'number' ? neumorphColors[props.$currentPalette].innerShadows :
    '11px 11px 23px rgba(0, 0, 0, .4), -11px -11px 23px rgba(255, 255, 255, .4)'} ;
  background: ${props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].background : 'white'};
  color: ${props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].color : 'black'};
  transition: 0.3s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].hoveredAltBackground : 'black'};
    color: ${props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].hoveredColor : 'white'};
  }
`;

const MediumButton = styled(animated.div)<{ $currentPalette: number | null }>`
  cursor: pointer;
  position: absolute;
  z-index: 1;
  width: 10vw;
  height: 10vw;
  max-width: 160px;
  min-width: 100px;
  max-height: 160px;
  min-height: 100px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: ${props => typeof props.$currentPalette === 'number' ? neumorphColors[props.$currentPalette].innerShadows :
    '11px 11px 23px rgba(0, 0, 0, .4), -11px -11px 23px rgba(255, 255, 255, .4)'} ;
  background: ${props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].background : 'white'};
  color: ${props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].color : 'black'};
  transition: 0.3s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].hoveredAltBackground : 'black'};
    color: ${props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].hoveredColor : 'white'};
  }
`;

const InnerSmallerButtonText = styled.div`
  text-align: center;
  font-size: calc(10px + (20 - 10) * ((100vw - 50px) / (1200 - 50)));
`;

const calculateClipPath = (progress: number) => {
    const deg = 360 * progress;
    const degToCoords = 50 / 45;
    let addedValues = ''
    const point45 = `${100}% ${0}%`;
    const point135 = `${100}% ${100}%`;
    const point225 = `${0}% ${100}%`;
    const point315 = `${0}% ${0}%`;
    if (deg <= 45 && deg >= 0) {
        const coords = `${50 + deg * degToCoords}% ${0}%`
        addedValues = `${coords}, ${coords}, ${coords}, ${coords}, ${coords}`;
    }
    if (deg > 45 && deg <= 135) {
        const coords = `${100}% ${(deg - 45) * degToCoords}%`;
        addedValues = `${point45}, ${coords}, ${coords}, ${coords}, ${coords}`;
    }
    if (deg > 135 && deg <= 225) {
        const coords = `${100 - (deg - 135) * degToCoords}% ${100}%`;
        addedValues = `${point45}, ${point135}, ${coords}, ${coords}, ${coords}`;
    }
    if (deg > 225 && deg <= 315) {
        const coords = `${0}% ${100 - (deg - 225) * degToCoords}%`;
        addedValues = `${point45}, ${point135}, ${point225}, ${coords}, ${coords}`;
    }
    if (deg > 315 && deg <= 360) {
        const coords = `${(deg - 315) * degToCoords}% ${0}%`;
        addedValues = `${point45}, ${point135}, ${point225}, ${point315}, ${coords}`;
    }
    return `polygon( 50% 50%, 50% 0%, ${addedValues} )`
}

const MainInterface = () => {

    const dispatch = useDispatch();
    const editable = useSelector((state: AppStateType) => state.todoList.editable, shallowEqual);
    const currentPalette = useSelector((state: AppStateType) => state.todoList.currentPaletteIndex, shallowEqual);
    const pendingState = useSelector((state: AppStateType) => state.todoList.pendingState, shallowEqual);
    const initialLoading = useSelector((state: AppStateType) => state.todoList.initialLoadingState, shallowEqual);
    const swapState = useSelector((state: AppStateType) => state.todoList.swapState, shallowEqual);
    const allTasks = useSelector((state: AppStateType) => state.todoList.allTasks, shallowEqual);
    const completedTasks = useSelector((state: AppStateType) => state.todoList.completedTasks, shallowEqual);
    const fetching = useSelector((state: AppStateType) => state.todoList.fetchingState, shallowEqual);

    const switchEditMode = () => {
        if (!editable) dispatch(actions.enableEditMode());
        if (editable) dispatch(submitAllChanges());
    };

    const addTodoList = () => {
        const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, (c, r) => ('x' == c ? (r = Math.random() * 16 | 0) : (r & 0x3 | 0x8)).toString(16));
        const newList = {
            id,
            title: '',
            tasks: []
        }
        dispatch(actions.addTodoList(newList));
    };

    const rejectAllChanges = () => {
        dispatch(actions.rejectAllChanges())
    };

    //animation logic
    const [spring, setSpring] = useSpring(() => ({
        wrapperX: '0vw',
        height: '100%',
        width: '100%',
        medX: '50%',
        medY: '50%',
        x: '50%',
        y: '50%',
    }));

    const [progressBarrAnimation, setProgressBar] = useSpring(() => ({
        clipPath: calculateClipPath(0)
    }));

    const setProgress = ( e:  React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log(e.currentTarget.value)
            const pro = +e.currentTarget.value;
            setProgressBar({clipPath: calculateClipPath(pro)})
        }
    }

    useEffect(() => {
        const progress = allTasks === 0 ? 0 : completedTasks / allTasks;
        setProgressBar({clipPath: calculateClipPath(progress)})
    }, [allTasks, completedTasks])

    useEffect(() => {
        if (!initialLoading && !editable && !pendingState) {
            setSpring({
                height: '16%',
                width: '16%',
                wrapperX: '10vw',
                config: {friction: 50}
            })
        } else if (editable) {
            setSpring({
                wrapperX: '50vw',
                medX: '125%',
                medY: '125%',
                x: '-50%',
                y: '150%',
            })
        } else if (pendingState) {

        } else if (swapState) {

        }
    }, [editable, pendingState, initialLoading, swapState, fetching]);

    const actionMessage = useMemo(() =>
            initialLoading ? 'Loading' : editable ? 'Submit' : pendingState ? 'Sending data'
                : 'Edit'
        , [editable, pendingState, initialLoading, swapState, fetching]);

    const textTransition = useTransition(actionMessage, {
        from: {opacity: 1, y: '-100%'},
        enter: {opacity: 1, y: '0%'},
        leave: {opacity: 0, y: '100%'},

    })

    /*console.log('interface render')*/

    return (
        <Wrapper style={{x: spring.wrapperX, width: spring.width, height: spring.height}}>
            <ButtonsWrapper>
                <EditButton onClick={switchEditMode} $currentPalette={currentPalette}>
                    <ProgressBackground style={progressBarrAnimation}/>
                    <InnerBackground $currentPalette={currentPalette}
                                     $altBackground={pendingState || initialLoading || swapState || fetching}>
                        {textTransition((style) =>
                            <InnerEditButtonText style={{...style, translateY: '-50%'}}>
                                {actionMessage}
                            </InnerEditButtonText>)}
                    </InnerBackground>
                </EditButton>
                <SmallerButton onClick={addTodoList} $currentPalette={currentPalette}
                               style={{x: spring.x, y: spring.y, translateX: '-50%', translateY: '-50%'}}>
                    <InnerSmallerButtonText>
                        Add list
                    </InnerSmallerButtonText>
                </SmallerButton>
                <MediumButton onClick={rejectAllChanges} $currentPalette={currentPalette}
                              style={{x: spring.medX, y: spring.medY, translateX: '-50%', translateY: '-50%'}}>
                    <InnerSmallerButtonText>
                        remove changes
                    </InnerSmallerButtonText>
                </MediumButton>
            </ButtonsWrapper>
            <input onKeyPress={(e) => setProgress(e)} style={{position: 'absolute', top: '100%'}}/>
        </Wrapper>
    )
};

export default MainInterface