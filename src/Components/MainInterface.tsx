import React, {useEffect, useMemo} from "react";
import styled from "styled-components/macro";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../redux/store";
import {actions, submitAllChanges} from "../redux/functionalReducer";
import {animated, useSpring, useTransition} from "react-spring";
import {NeumorphColorsType} from "./neumorphColors";

const BlurWrapper = styled(animated.div)`
   position: absolute;
   backdrop-filter: blur(5px);
   width: 100%;
   height: 20vh;
   max-height: 300px;
   min-height: 100px;
`;

const Wrapper = styled(animated.div)`
  position: absolute;
  font-family: NunitoSans-ExtraLight, sans-serif;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  height: 20vh;
  max-height: 300px;
  min-height: 100px;
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

const EditButton = styled.div<{ $palette: NeumorphColorsType }>`
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
  box-shadow: ${props => props.$palette.shadows} ;
  background: ${props => props.$palette.background};
`;

const ProgressBackground = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: red;
  position: absolute;
`;

const Progress = styled(animated.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  background-color: black;
`;

const InnerBackground = styled.div<{ $palette: NeumorphColorsType, $altBackground: boolean }>`
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
  position: absolute;
  background: ${props => props.$palette.background};
  color: ${props => props.$palette.color};
  display: grid;
  place-items: center;
  border-radius: 50%;
  transition: 0.3s cubic-bezier(0.25, 0, 0, 1);
  ${props => !props.$altBackground &&
    `&:hover {
        background: ${props.$palette.background};
        color: ${props.$palette.color};
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

const SmallerButton = styled(animated.div)<{ $palette: NeumorphColorsType }>`
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
  box-shadow: ${props => props.$palette.littleShadows};
  background: ${props => props.$palette.background};
  color: ${props => props.$palette.color};
  transition: 0.3s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${props => props.$palette.background};
    color: ${props => props.$palette.color};
  }
`;

const MediumButton = styled(animated.div)<{ $palette: NeumorphColorsType }>`
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
  box-shadow: ${props => props.$palette.littleShadows};
  background: ${props => props.$palette.background};
  color: ${props => props.$palette.color};
  transition: 0.3s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${props => props.$palette.background};
    color: ${props => props.$palette.color};
  }
`;

const InnerSmallerButtonText = styled.div`
  text-align: center;
  font-size: calc(10px + (20 - 10) * ((100vw - 50px) / (1200 - 50)));
`;

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
        wrapperX: '0%',
        height: '100%',
        width: '100%',
        medX: '50%',
        medY: '50%',
        x: '50%',
        y: '50%',
    }));

    const [progressBarrAnimation, setProgressBar] = useSpring(() => ({
        clipPath1: `polygon( 50% 0%, 100% 0%, 100% 200%, 50% 200%)`,
        clipPath2: `polygon( 0% 0%, 50% 0%, 50% 200%, 0% 200%)`,
    }));

    const setProgress = (e:  React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const progress1 = 200 - (200 - +e.currentTarget.value*200);
            const progress2 = 200 - +e.currentTarget.value*200;
            setProgressBar({
                clipPath1: `polygon( 50% ${progress1}%, 100% ${progress1}%, 100% 200%, 50% 200%)`,
                clipPath2: `polygon( 0% 0%, 50% 0%, 50% ${progress2}%, 0% ${progress2}%)`
            })
        }
    }

    useEffect(() => {
        const progress = allTasks === 0 ? 0 : completedTasks / allTasks;
        const progress1 = 200 - (200 - progress*200);
        const progress2 = 200 - progress*200;
        setProgressBar({
            clipPath1: `polygon( 50% ${progress1}%, 100% ${progress1}%, 100% 200%, 50% 200%)`,
            clipPath2: `polygon( 0% 0%, 50% 0%, 50% ${progress2}%, 0% ${progress2}%)`
        })
    }, [allTasks, completedTasks])

    useEffect(() => {
        if (!initialLoading && !editable && !pendingState) {
            setSpring({
                height: '16%',
                width: '16%',
                wrapperX: '10%',
                config: {friction: 50}
            })
        } else if (editable) {
            setSpring({
                wrapperX: '50%',
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
        <>
        <Wrapper style={{x: spring.wrapperX, width: spring.width, height: spring.height}}>
            <ButtonsWrapper>
                <EditButton onClick={switchEditMode} $palette={currentPalette}>
                    <ProgressBackground>
                        <Progress style={{clipPath: progressBarrAnimation.clipPath1}}/>
                        <Progress style={{clipPath: progressBarrAnimation.clipPath2}}/>
                    </ProgressBackground>
                    <InnerBackground $palette={currentPalette}
                                     $altBackground={pendingState || initialLoading || swapState || fetching}>
                        {textTransition((style) =>
                            <InnerEditButtonText style={{...style, translateY: '-50%'}}>
                                {actionMessage}
                            </InnerEditButtonText>)}
                    </InnerBackground>
                </EditButton>
                <SmallerButton onClick={addTodoList} $palette={currentPalette}
                               style={{x: spring.x, y: spring.y, translateX: '-50%', translateY: '-50%'}}>
                    <InnerSmallerButtonText>
                        Add list
                    </InnerSmallerButtonText>
                </SmallerButton>
                <MediumButton onClick={rejectAllChanges} $palette={currentPalette}
                              style={{x: spring.medX, y: spring.medY, translateX: '-50%', translateY: '-50%'}}>
                    <InnerSmallerButtonText>
                        remove changes
                    </InnerSmallerButtonText>
                </MediumButton>
            </ButtonsWrapper>
            <input onKeyPress={(e) => setProgress(e)} style={{position: 'absolute', top: '100%'}}/>
        </Wrapper>

            </>
    )
};

export default MainInterface