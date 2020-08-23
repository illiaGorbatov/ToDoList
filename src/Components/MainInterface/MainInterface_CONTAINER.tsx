import React, {useCallback, useEffect, useMemo, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {actions, submitAllChanges} from "../../redux/functionalReducer";
import {useSpring} from "react-spring";
import RotatedBackground from "./RotatedBackground";
import InterfaceWrapper from "./InterfaceWrapper";
import EditButton from "./EditButton";
import OtherButtons from "./OtherButtons";


const MainInterface_CONTAINER = () => {

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
    const width = useSelector((state: AppStateType) => state.todoList.width, shallowEqual);

    const [buttonsWrapperHeight, setButtonsHeight] = useState<number>(0);

    const switchEditMode = useCallback(() => {
        if (!editable) dispatch(actions.enableEditMode());
        if (editable) dispatch(submitAllChanges());
    }, [editable]);

    useEffect(() => {
        let isMounted = true;
        let timeoutId: number | undefined = undefined;
        const getHeight = (getButtonHeight: boolean) => {
            if (!getButtonHeight) return editable ? (window.innerHeight * 0.17 > 230 ? 230 :
                window.innerHeight * 0.17 < 150 ? 150 : window.innerHeight * 0.17) :
                (Math.sqrt((window.innerHeight * 0.23) ** 2 + (window.innerWidth * 0.23) ** 2) > 300 ? 300 :
                    Math.sqrt((window.innerHeight * 0.23) ** 2 + (window.innerWidth * 0.23) ** 2));
            return window.innerHeight * 0.17 > 230 ? 230 :
                window.innerHeight * 0.17 < 150 ? 150 : window.innerHeight * 0.17
        }
        if (isMounted) {
            const height = getHeight(false);
            dispatch(actions.setInterfaceHeight(height));
            const buttonHeight = getHeight(true);
            setButtonsHeight(buttonHeight);
        }
        const resizeListener = () => {
            if (isMounted) {
                clearTimeout(timeoutId);
                timeoutId = window.setTimeout(() => {
                    const newHeight = getHeight(false);
                    dispatch(actions.setInterfaceHeight(newHeight));
                    const newButtonHeight = getHeight(true);
                    setButtonsHeight(newButtonHeight);
                }, 150);
            }
        };
        window.addEventListener('resize', resizeListener);
        return () => {
            isMounted = false;
            window.removeEventListener('resize', resizeListener);
        }
    }, [editable]);

    const addTodoList = useCallback(() => {
        const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, (c, r) => ('x' == c ? (r = Math.random() * 16 | 0) : (r & 0x3 | 0x8)).toString(16));
        const newList = {
            id,
            title: '',
            tasks: []
        }
        dispatch(actions.addTodoList(newList));
    }, []);

    const rejectAllChanges = useCallback(() => {
        dispatch(actions.rejectAllChanges())
    }, []);

    //animation logic
    const [spring, setSpring] = useSpring(() => ({
        height: window.innerHeight,
        width: window.innerWidth,
        backgroundHeight: Math.sqrt(window.innerHeight ** 2 + window.innerWidth ** 2),
        rotateZ: -35,
        x: '0vw',
    }));

    const [progressBarAnimation, setProgressBar] = useSpring(() => ({
        value: 0,
        height: '0%',
        opacity: 1
    }));

    useEffect(() => {
        if (editable) setSpring({width: window.innerWidth})
    }, [width]);

    useEffect(() => {
        setProgressBar(() => {
            if (completedTasks / allTasks !== 1) return {
                value: isNaN(completedTasks / allTasks * 100) ? 0 : completedTasks / allTasks * 100,
                height: `${completedTasks / allTasks * 100}%`,
            };
            else return {
                to: async animate => {
                    await animate({
                        value: isNaN(completedTasks / allTasks * 100) ? 0 : completedTasks / allTasks * 100,
                        height: `${completedTasks / allTasks * 100}%`});
                    await animate({opacity: 0})
                }
            }
        })
    }, [allTasks, completedTasks]);

    useEffect(() => {
        if (!initialLoading && !editable && !closeLook) {
            setSpring({
                height: interfaceHeight,
                width: buttonsWrapperHeight,
                backgroundHeight: interfaceHeight,
                rotateZ: -35,
                x: '0vw',
                config: {friction: 50}
            })
        } else if (editable) {
            setSpring({
                backgroundHeight: interfaceHeight,
                height: interfaceHeight,
                width: window.innerWidth,
                rotateZ: 0,
            })
        } else if (closeLook) {
            setSpring({
                x: '-100vw'
            })
        }
    }, [editable, pendingState, initialLoading, swapState, fetching, closeLook, interfaceHeight]);

    const actionMessage = useMemo(() =>
            initialLoading ? 'Loading' : editable ? 'Submit' : pendingState ? 'Sending data'
                : 'Edit'
        , [editable, pendingState, initialLoading, swapState, fetching]);

    return (
        <>
            <RotatedBackground palette={currentPalette} height={spring.backgroundHeight} rotateZ={spring.rotateZ} x={spring.x}/>
            <InterfaceWrapper height={spring.height} width={spring.width} interfaceHeight={buttonsWrapperHeight} x={spring.x}>
                <EditButton actionMessage={actionMessage} interfaceHeight={buttonsWrapperHeight}
                            cantBeHovered={pendingState || initialLoading || swapState || fetching}
                            switchEditMode={switchEditMode} palette={currentPalette}
                            progressBarAnimation={progressBarAnimation}/>
                <OtherButtons palette={currentPalette} editable={editable} addTodoList={addTodoList}
                              rejectAllChanges={rejectAllChanges} interfaceHeight={buttonsWrapperHeight}/>
            </InterfaceWrapper>
        </>
    )
};

export default MainInterface_CONTAINER