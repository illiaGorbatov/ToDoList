import React, {useEffect} from "react";
import styled from "styled-components/macro";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../redux/store";
import {actions, submitAllChanges} from "../redux/functionalReducer";
import {animated, useSpring} from "react-spring";
import {neumorphColors} from "./neumorphColors";

const Wrapper = styled(animated.div)`
  position: absolute;
  font-family: NunitoSans-ExtraLight, sans-serif;
  backdrop-filter: blur(5px);
  box-sizing: border-box;
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
  border-radius: 100%;
  display: grid;
  place-items: center;
  box-shadow: ${ props => typeof props.$currentPalette === 'number' ? neumorphColors[props.$currentPalette].innerShadows : 
    '11px 11px 23px rgba(0, 0, 0, .4), -11px -11px 23px rgba(255, 255, 255, .4)'} ;
  background: ${ props => typeof props.$currentPalette === 'number' ? 
    neumorphColors[props.$currentPalette].background : 'white'};
  color: ${ props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].color : 'black'};
  transition: 0.3s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${ props => typeof props.$currentPalette === 'number' ?
        neumorphColors[props.$currentPalette].hoveredAltBackground : 'black'};
    color: ${ props => typeof props.$currentPalette === 'number' ?
        neumorphColors[props.$currentPalette].hoveredColor : 'white'};
  }
`;
 //calc([minimum size] + ([maximum size] - [minimum size]) * ((100vw - [minimum viewport width]) / ([maximum viewport width] - [minimum viewport width])));
const InnerEditButtonText = styled.div`
  text-align: center;
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
  border-radius: 100%;
  display: grid;
  place-items: center;
  box-shadow: ${ props => typeof props.$currentPalette === 'number' ? neumorphColors[props.$currentPalette].innerShadows :
    '11px 11px 23px rgba(0, 0, 0, .4), -11px -11px 23px rgba(255, 255, 255, .4)'} ;
  background: ${ props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].background : 'white'};
  color: ${ props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].color : 'black'};
  transition: 0.3s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${ props => typeof props.$currentPalette === 'number' ?
        neumorphColors[props.$currentPalette].hoveredAltBackground : 'black'};
    color: ${ props => typeof props.$currentPalette === 'number' ?
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
  border-radius: 100%;
  display: grid;
  place-items: center;
  box-shadow: ${ props => typeof props.$currentPalette === 'number'  ? neumorphColors[props.$currentPalette].innerShadows :
    '11px 11px 23px rgba(0, 0, 0, .4), -11px -11px 23px rgba(255, 255, 255, .4)'} ;
  background: ${ props => typeof props.$currentPalette === 'number' ?
    neumorphColors[props.$currentPalette].background : 'white'};
  color: ${ props => typeof props.$currentPalette === 'number' ? 
    neumorphColors[props.$currentPalette].color : 'black'};
  transition: 0.3s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${ props => typeof props.$currentPalette === 'number' ?
        neumorphColors[props.$currentPalette].hoveredAltBackground : 'black'};
    color: ${ props => typeof props.$currentPalette === 'number' ?
        neumorphColors[props.$currentPalette].hoveredColor : 'white'};
  }
`;

const InnerSmallerButtonText = styled.div`
  text-align: center;
  font-size: calc(10px + (20 - 10) * ((100vw - 50px) / (1200 - 50)));
`;

const MainInterface = () => {

    const dispatch = useDispatch();
    const editable = useSelector((state: AppStateType) => state.todoList.editable);
    const currentPalette = useSelector((state: AppStateType) => state.todoList.currentPaletteIndex, shallowEqual);
    const pendingState = useSelector((state: AppStateType) => state.todoList.pendingState);
    const initialLoading = useSelector((state: AppStateType) => state.todoList.initialLoadingState);

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
        wrapperX: '10%',
        medX: '50%',
        medY: '50%',
        x: '50%',
        y: '50%',
    }));

    useEffect(() => {
        if (editable) {
            setSpring({
                wrapperX: '50%',
                medX: '125%',
                medY: '125%',
                x: '-50%',
                y: '150%',
            })
        }

    }, [editable])

    console.log('interface render')

    return(
        <Wrapper style={{x: spring.wrapperX}}>
            <EditButton onClick={switchEditMode} $currentPalette={currentPalette}>
                <InnerEditButtonText>
                    Edit
                </InnerEditButtonText>
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
        </Wrapper>
    )
};

export default MainInterface