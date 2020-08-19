import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {actions, initialization} from "../../../redux/functionalReducer";
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {AppStateType} from "../../../redux/store";
import {useSpring} from "react-spring";
import {useDrag, useWheel} from "react-use-gesture";
import {isMobile} from 'react-device-detect'
import ScrollBar from "./ScrollBar";
import ScrollableWrapper from "./ScrollWrapper";
import AllListsWrapper from "../DruggedElements/AllListsWrapper";

const Scroll_WRAPPER: React.FC = () => {

    const currentPalette = useSelector((store: AppStateType) => store.todoList.currentPaletteIndex, shallowEqual);
    const editable = useSelector((store: AppStateType) => store.todoList.editable, shallowEqual);
    const height = useSelector((store: AppStateType) => store.todoList.height, shallowEqual);
    const width = useSelector((store: AppStateType) => store.todoList.width, shallowEqual);
    const initialLoadingState = useSelector((store: AppStateType) => store.todoList.initialLoadingState, shallowEqual);
    const closeLook = useSelector((store: AppStateType) => store.todoList.closeLookState, shallowEqual);
    const interfaceHeight = useSelector((state: AppStateType) => state.todoList.interfaceHeight, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initialization());
        let isMounted = true;
        let timeoutId: number | undefined = undefined;
        const resizeListener = () => {
            if (isMounted) {
                clearTimeout(timeoutId);
                timeoutId = window.setTimeout(() => dispatch(actions.setWidth(measuredRef.current!.offsetWidth)), 150);
            }
        };
        window.addEventListener('resize', resizeListener);
        return () => {
            isMounted = false;
            window.removeEventListener('resize', resizeListener);
        }
    }, []);

    const [{border, scrollBarHeight}, setBorders] = useState({border: 0, scrollBarHeight: 0});
    const [drugged, setDrugged] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    useEffect(() => {
        if (height < window.innerHeight) setVisible(false)
        else setVisible(true);
        if (!closeLook) {
            const border = editable ? (height - window.innerHeight < 0 ? 0 : height - window.innerHeight + interfaceHeight)
                : (height - window.innerHeight < 0 ? 0.5 * height : height - window.innerHeight / 2);
            const scrollBarHeight = !height ? 0 : (window.innerHeight - (editable ? interfaceHeight : 0)) / height * 100;
            setBorders({border, scrollBarHeight})
        }
    }, [height, editable, width]);

    const measuredRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        dispatch(actions.setWidth(measuredRef.current!.offsetWidth))
    }, []);

    const [wrapperAnimation, setWrapperAnimation] = useSpring(() => ({
        x: '-100vw',
        rotateX: 45,
        rotateZ: 45,
        y: 275,
        config: {tension: 90, clamp: true},
    }));
    useEffect(() => {
        if (!initialLoadingState) setWrapperAnimation({
            x: window.innerWidth <= 1210 ? '-5vw' : '-15vw',
        })
    }, [initialLoadingState])

    useEffect(() => {
        if (!initialLoadingState) setWrapperAnimation({
            x: editable ? (window.innerWidth <= 1210 ? '5vw' : '15vw') : (window.innerWidth <= 1210 ? '-5vw' : '-15vw'),
            rotateX: editable ? 0 : 45,
            rotateZ: editable ? 0 : 45,
            y: editable ? 0 : 275,
        })
    }, [editable]);

    //scroll logic
    const scrolledY = useRef<number>(0);
    const scrolledPercent = useRef<number>(0);
    const isPrevWidthSmall = useRef<boolean>(window.innerWidth <= 1210);
    const memoizedData = useRef<Array<number>>([]);
    const [scrollingAnimation, setScroll] = useSpring(() => ({
        y: window.innerWidth <= 1210 ? - window.innerHeight/2 : 0,
        top: `0%`,
        height: 0,
        immediate: false
    }));

    useEffect(() => {
        scrolledY.current = window.innerWidth <= 1210 && !isPrevWidthSmall.current ? scrolledY.current - window.innerHeight/2 :
             window.innerWidth > 1210 && isPrevWidthSmall.current ? scrolledY.current + window.innerHeight/2 : scrolledY.current;
        isPrevWidthSmall.current = window.innerWidth <= 1210;
        setScroll({height,  y: -scrolledY.current});
        if (!initialLoadingState) setWrapperAnimation({
            x: editable || closeLook ? (window.innerWidth <= 1210 ? '5vw' : '15vw') : (window.innerWidth <= 1210 ? '-5vw' : '-15vw')
        })
    }, [height, width]);

    const visibilityOfScrollBar = useSpring({
        from: {opacity: 0, right: -50, display: 'none'},
        to: async animate => {
            await animate(visible ? {display: 'block'} : {opacity: 0, right: -50});
            await animate(visible ? {opacity: 1, right: 0} : {display: 'none'})
        }
    });

    useWheel(({delta: [, y]}) => {
        if (!visible) return;
        scrolledY.current = scrolledY.current + y < border && scrolledY.current + y > 0 ? scrolledY.current + y
            : scrolledY.current + y <= 0 ? 0 : border;
        scrolledPercent.current = scrolledY.current / border * (100 - scrollBarHeight);
        setScroll({
            y: -scrolledY.current,
            top: `${scrolledPercent.current}%`
        });
    }, {domTarget: window});
    useDrag(({offset: [, y], active, event}) => {
        if (!isMobile || !visible) return;
        event?.preventDefault();
        if (active) {
            const posY = -y;
            scrolledY.current = posY < border && posY > 0 ? posY : posY <= 0 ? 0 : border;
            scrolledPercent.current = scrolledY.current / border * (100 - scrollBarHeight);
            setScroll({
                y: -scrolledY.current,
                top: `${scrolledPercent.current}%`
            });
        }
    }, {domTarget: window, filterTaps: true, eventOptions: {passive: false}});

    //scroller
    const bindDraggedScrollBar = useDrag(({delta: [, y], event, first, down}) => {
        event?.stopPropagation();
        if (first) setDrugged(true);
        const absY = y / (editable ? window.innerHeight - interfaceHeight : window.innerHeight) * 100;
        scrolledPercent.current = scrolledPercent.current + absY > 0 && scrolledPercent.current + absY < 100 - scrollBarHeight ?
            scrolledPercent.current + absY : scrolledPercent.current + absY <= 0 ? 0 : 100 - scrollBarHeight;
        scrolledY.current = border * scrolledPercent.current / (100 - scrollBarHeight);
        setScroll({
            y: -scrolledY.current,
            top: `${scrolledPercent.current}%`,
            immediate: (prop) => prop === 'top'
        });
        if (!down) setDrugged(false)
    });

    const scrollByListDrugging = useCallback((direction: string) => {
        if (direction === 'bottom' && scrolledY.current < border) {
            scrolledY.current = scrolledY.current + 5 < border ? scrolledY.current + 5 : border;
            scrolledPercent.current = scrolledY.current / border * (100 - scrollBarHeight);
            setScroll({
                y: -scrolledY.current,
                top: `${scrolledPercent.current}%`
            });
        }
        if (direction === 'top' && scrolledY.current > 0) {
            scrolledY.current = scrolledY.current - 5 > 0 ? scrolledY.current - 5 : 0;
            scrolledPercent.current = scrolledY.current / border * (100 - scrollBarHeight);
            setScroll({
                y: -scrolledY.current,
                top: `${scrolledPercent.current}%`
            });
        }
    }, [border, scrollBarHeight])

    const setCloseLookState = useCallback((elementHeight: number) => {
        const newBorder = elementHeight > window.innerHeight - (isMobile ? 100 : 250) ?
            elementHeight - (window.innerHeight - (isMobile ? 100 : 250)) : 0;
        if (newBorder > 0) {
            memoizedData.current = [scrolledY.current, scrolledPercent.current, border, scrollBarHeight];
            const newScrollBarHeight = (window.innerHeight - (isMobile ? 100 : 250)) / elementHeight * 100
            setBorders({border: newBorder, scrollBarHeight: newScrollBarHeight})
            scrolledY.current = 0;
            scrolledPercent.current = 0;
            setScroll({
                y: 0,
                top: `${0}%`
            });
            setVisible(true);
        }
    }, [border, scrollBarHeight]);

    const returnFromCloseLookState = useCallback(() => {
        if (memoizedData.current.length !== 0) {
            scrolledY.current = memoizedData.current[0];
            scrolledPercent.current = memoizedData.current[1];
            setBorders({border: memoizedData.current[2], scrollBarHeight: memoizedData.current[3]})
            setScroll({
                y: -memoizedData.current[0],
                top: `${memoizedData.current[1]}%`
            });
        }
        setVisible(true);
    }, []);

    const switchScrollBar = useCallback((visibility: boolean) => setVisible(visibility), []);

    return (
        <>
            <ScrollableWrapper height={scrollingAnimation.height} visible={visible} closeLook={closeLook}
                           editable={editable}
                           y={scrollingAnimation.y} interfaceHeight={interfaceHeight} measuredRef={measuredRef}
                           wrapperAnimation={wrapperAnimation}>
                <AllListsWrapper setWrapperAnimation={setWrapperAnimation} scrollByListDrugging={scrollByListDrugging}
                             setCloseLookState={setCloseLookState} returnFromCloseLookState={returnFromCloseLookState}
                             switchScrollBar={switchScrollBar}/>
            </ScrollableWrapper>
            <ScrollBar palette={currentPalette} visible={visible} visibilityOfScrollBar={visibilityOfScrollBar}
                       editable={editable}
                       interfaceHeight={interfaceHeight} drugged={drugged} top={scrollingAnimation.top}
                       bindDraggedScrollBar={bindDraggedScrollBar} scrollBarHeight={scrollBarHeight}/>
        </>
    );
}

export default Scroll_WRAPPER;

