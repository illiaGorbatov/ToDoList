import React, {useEffect, useLayoutEffect, useMemo} from "react";
import styled from "styled-components/macro";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../redux/store";
import {actions, submitAllChanges} from "../redux/functionalReducer";
import {animated, useSpring, useTransition} from "react-spring";
import {interfacePalette, NeumorphColorsType} from "./neumorphColors";

const RotatedBackground = styled(animated.div)<{ $palette: NeumorphColorsType }>`
   position: absolute;
   z-index: 998;
   background-color: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
   width: 300%;
   transform-origin: 50% 0;
   left: -150%;
   transition: background-color 0.3s cubic-bezier(0.25, 0, 0, 1);
   &:before {
      position: absolute;
      width: 100%;
      height: 100%;
      content: '';
      background-color: ${props => props.$palette.default ? interfacePalette.background : 'rgba(0, 0, 0, 0.3)'};
   }
`;

const Wrapper = styled(animated.div)`
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

const EditButton = styled.div<{ $palette: NeumorphColorsType }>`
  cursor: pointer;
  position: relative;
  z-index: 3;
  width: 15vw;
  height: 15vw;
  max-width: 210px;
  min-width: 130px;
  max-height: 210px;
  min-height: 130px;
  border-radius: 50%;
  box-shadow: ${props => props.$palette.default ? interfacePalette.shadows : props.$palette.shadows} ;
  background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
`;

const ProgressBackground = styled(animated.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  overflow: hidden;
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
  background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
  color: ${props => props.$palette.default ? interfacePalette.color : props.$palette.color};
  display: grid;
  place-items: center;
  border-radius: 50%;
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
  font-size: calc(15px + (50 - 15) * ((100vw - 300px) / (2000 - 300)));
`;

const SmallerButton = styled.div<{ $palette: NeumorphColorsType, $editable: boolean }>`
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
  box-shadow: ${props => props.$palette.default ? interfacePalette.littleShadows : props.$palette.littleShadows};
  background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
  color: ${props => props.$palette.color};
  transform: translate(-50%, -50%);
  top: 50%;
  left: ${props => props.$editable ? '-20%' : '50%'};
  transition: left 0.4s cubic-bezier(0.25, 0, 0, 1) 0.3s, background, color 0.4s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
    color: ${props => props.$palette.default ? interfacePalette.color : props.$palette.color};
  }
`;

const MediumButton = styled(animated.div)<{ $palette: NeumorphColorsType, $editable: boolean }>`
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
  box-shadow: ${props => props.$palette.default ? interfacePalette.littleShadows : props.$palette.littleShadows};
  background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
  color: ${props => props.$palette.color};
  transform: translate(-50%, -50%);
  top: 50%;
  left: ${props => props.$editable ? '130%' : '50%'};
  transition: left 0.4s cubic-bezier(0.25, 0, 0, 1) 0.3s, background, color 0.4s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
    color: ${props => props.$palette.default ? interfacePalette.color : props.$palette.color};
  }
`;

const InnerSmallerButtonText = styled.div`
  text-align: center;
  font-size: calc(10px + (20 - 10) * ((100vw - 300px) / (2000 - 300)));
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
    const closeLook = useSelector((state: AppStateType) => state.todoList.closeLookState, shallowEqual);
    const interfaceHeight = useSelector((state: AppStateType) => state.todoList.interfaceHeight, shallowEqual);

    const switchEditMode = () => {
        if (!editable) dispatch(actions.enableEditMode());
        if (editable) dispatch(submitAllChanges());
    };

    useEffect(() => {
        let isMounted = true;
        let timeoutId: number | undefined = undefined;
        const resizeListener = () => {
            if (isMounted) {
                clearTimeout(timeoutId);
                timeoutId = window.setTimeout(() => {
                    const newHeight = editable ? (window.innerWidth * 0.17 > 230 ? window.innerWidth * 0.17 :
                        window.innerWidth * 0.17 < 150 ? 150 : window.innerWidth * 0.17) :
                        (Math.sqrt((window.innerHeight*0.23) ** 2 + (window.innerWidth*0.23) ** 2) > 300 ? 300 :
                            Math.sqrt((window.innerHeight*0.23) ** 2 + (window.innerWidth*0.23) ** 2))
                    dispatch(actions.setInterfaceHeight(newHeight))
                }, 150);
            }
        };
        window.addEventListener('resize', resizeListener);
        return () => {
            isMounted = false;
            window.removeEventListener('resize', resizeListener);
        }
    }, []);
    console.log(Math.sqrt((window.innerHeight*0.25) ** 2 + (window.innerWidth*0.25) ** 2), (window.innerWidth * 0.17 > 230 ? window.innerWidth * 0.17 :
        window.innerWidth * 0.17 < 150 ? 150 : window.innerWidth * 0.17))

    useLayoutEffect(() => {
        const newHeight = editable ? (window.innerWidth * 0.17 > 230 ? window.innerWidth * 0.17 :
            window.innerWidth * 0.17 < 150 ? 150 : window.innerWidth * 0.17) :
            Math.sqrt((window.innerHeight*0.23) ** 2 + (window.innerWidth*0.23) ** 2)
        dispatch(actions.setInterfaceHeight(newHeight))
    }, [editable])

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
        height: '100%',
        width: '100%',
        backgroundHeight: Math.sqrt(window.innerHeight ** 2 + window.innerWidth ** 2),
        rotateZ: -35
    }));

    const [progressBarrAnimation, setProgressBar] = useSpring(() => ({
        clipPath1: `polygon( 50% 0%, 100% 0%, 100% 200%, 50% 200%)`,
        clipPath2: `polygon( 0% 0%, 50% 0%, 50% 200%, 0% 200%)`,
        opacity: 1
    }));

    useEffect(() => {
        const progress = allTasks === 0 ? 0 : completedTasks / allTasks;
        const progress1 = 200 - (200 - progress * 200);
        const progress2 = 200 - progress * 200;
        setProgressBar(() => {
            if (progress === 1) return {
                to: async animate => {
                    await animate({
                        clipPath1: `polygon( 50% ${progress1}%, 100% ${progress1}%, 100% 200%, 50% 200%)`,
                        clipPath2: `polygon( 0% 0%, 50% 0%, 50% ${progress2}%, 0% ${progress2}%)`
                    });
                    await animate({opacity: 0})
                }
            }
            return {
                clipPath1: `polygon( 50% ${progress1}%, 100% ${progress1}%, 100% 200%, 50% 200%)`,
                clipPath2: `polygon( 0% 0%, 50% 0%, 50% ${progress2}%, 0% ${progress2}%)`,
                opacity: 1,
                immediate: (props) => props === 'opacity'
            }
        })
    }, [allTasks, completedTasks]);

    useEffect(() => {
        if (!initialLoading && !editable) {
            setSpring({
                height: '20%',
                width: '20%',
                backgroundHeight: interfaceHeight,
                rotateZ: -35,
                config: {friction: 50}
            })
        } else if (editable) {
            setSpring({
                backgroundHeight: interfaceHeight,
                height: '20%',
                width: '100%',
                rotateZ: 0,
            })
        } else if (closeLook) {
            setSpring({
                height: '20%',
                width: '20%',
                rotateZ: 0,
            })
        }
    }, [editable, pendingState, initialLoading, swapState, fetching, closeLook, interfaceHeight]);

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
            <RotatedBackground $palette={currentPalette} style={{
                height: spring.backgroundHeight,
                rotateZ: spring.rotateZ /*translateX: '-50%'*/
            }}/>
            <Wrapper style={{width: spring.width, height: spring.height}}>
                <ButtonsWrapper>
                    <EditButton onClick={switchEditMode} $palette={currentPalette}>
                        <ProgressBackground style={{opacity: progressBarrAnimation.opacity}}>
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
                    <SmallerButton onClick={addTodoList} $palette={currentPalette} $editable={editable}>
                        <InnerSmallerButtonText>
                            Add list
                        </InnerSmallerButtonText>
                    </SmallerButton>
                    <MediumButton onClick={rejectAllChanges} $palette={currentPalette} $editable={editable}>
                        <InnerSmallerButtonText>
                            remove changes
                        </InnerSmallerButtonText>
                    </MediumButton>
                </ButtonsWrapper>
            </Wrapper>
        </>
    )
};

export default MainInterface