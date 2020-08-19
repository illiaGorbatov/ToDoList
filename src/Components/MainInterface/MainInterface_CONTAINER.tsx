import React, {useCallback, useEffect, useLayoutEffect, useMemo} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {actions, submitAllChanges} from "../../redux/functionalReducer";
import {useSpring} from "react-spring";
import RotatedBackground from "./RotatedBackground";
import InterfaceWrapper from "./ButtonsWrapper";
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

    const switchEditMode = useCallback(() => {
        if (!editable) dispatch(actions.enableEditMode());
        if (editable) dispatch(submitAllChanges());
    }, [editable]);

    useEffect(() => {
        let isMounted = true;
        let timeoutId: number | undefined = undefined;
        const resizeListener = () => {
            if (isMounted) {
                clearTimeout(timeoutId);
                timeoutId = window.setTimeout(() => {
                    const newHeight = editable ? (window.innerWidth * 0.17 > 230 ? window.innerWidth * 0.17 :
                        window.innerWidth * 0.17 < 150 ? 150 : window.innerWidth * 0.17) :
                        (Math.sqrt((window.innerHeight * 0.23) ** 2 + (window.innerWidth * 0.23) ** 2) > 300 ? 300 :
                            Math.sqrt((window.innerHeight * 0.23) ** 2 + (window.innerWidth * 0.23) ** 2))
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

    useLayoutEffect(() => {
        const newHeight = editable ? (window.innerWidth * 0.17 > 230 ? window.innerWidth * 0.17 :
            window.innerWidth * 0.17 < 150 ? 150 : window.innerWidth * 0.17) :
            Math.sqrt((window.innerHeight * 0.23) ** 2 + (window.innerWidth * 0.23) ** 2)
        dispatch(actions.setInterfaceHeight(newHeight))
    }, [editable])

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
        height: '100%',
        width: '100%',
        backgroundHeight: Math.sqrt(window.innerHeight ** 2 + window.innerWidth ** 2),
        rotateZ: -35
    }));

    const [progressBarAnimation, setProgressBar] = useSpring(() => ({
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


    /*console.log('interface render')*/

    return (
        <>
            <RotatedBackground palette={currentPalette} height={spring.backgroundHeight} rotateZ={spring.rotateZ}/>
            <InterfaceWrapper height={spring.height} width={spring.width}>
                <EditButton actionMessage={actionMessage}
                            altBackground={pendingState || initialLoading || swapState || fetching}
                            switchEditMode={switchEditMode} palette={currentPalette}
                            progressBarAnimation={progressBarAnimation}/>
                <OtherButtons palette={currentPalette} editable={editable} addTodoList={addTodoList}
                              rejectAllChanges={rejectAllChanges}/>
            </InterfaceWrapper>
        </>
    )
};

export default MainInterface_CONTAINER