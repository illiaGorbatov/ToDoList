import React, {useEffect, useRef, useState} from "react";
import {initialization} from "../../redux/functionalReducer";
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {AppStateType} from "../../redux/store";
import styled from "styled-components/macro";
import {animated, useSpring} from "react-spring";
import {useDrag, useWheel} from "react-use-gesture";
import ReactResizeDetector from 'react-resize-detector';
import MappedLists from "./MappedLists";
import {neumorphColors, NeumorphColorsType} from "../neumorphColors";
import {isMobile} from 'react-device-detect'


const AllLists = styled(animated.div)`
  position: relative;
  transform-style: preserve-3d;
  width: 70vw;
  @media screen and (max-width: 800px) {
    top: -50vh
  }
`;

const ScrollableWrapper = styled(animated.div)`
  position: absolute;
  transform-style: preserve-3d;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ScrollBarWrapper = styled(animated.div)<{$palette: NeumorphColorsType, $visible: boolean}>`
  position: absolute;
  width: 30px;
  height: 100vh;
  top: 0;
  right: 0;
  overflow: hidden;
  transition: background-color, opacity 0.3s cubic-bezier(0.25, 0, 0, 1);
  background: ${props => props.$palette.progressBarColor};
`;

const ScrollBarThing = styled(animated.div)<{$palette: NeumorphColorsType, $height: number}>`
  position: absolute;
  width: 20px;
  left: 50%;
  transform: translateX(-50%);
  height: ${props => props.$height}%;
  border-radius: 10px;
  transition: background-image 0.3s cubic-bezier(0.25, 0, 0, 1);
  background: ${props => props.$palette.background};
`;


const ScrollWrapper: React.FC = () => {

    const currentPalette = useSelector((store: AppStateType) => store.todoList.currentPaletteIndex, shallowEqual);
    const editable = useSelector((store: AppStateType) => store.todoList.editable, shallowEqual);
    const height = useSelector((store: AppStateType) => store.todoList.height, shallowEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initialization());
    }, []);
    useEffect(() => {
        console.log('mounted');
        return () => console.log('unmounting...');
    }, []);

    const [visible, setVisible] = useState<boolean>(false);
    useEffect(() => {
        if (height < window.innerHeight) setVisible(false)
        else setVisible(true)
    }, [height])

    const [width, setWidth] = useState<number>(0);
    const onResize = (width: number) => setWidth(width);

    const [wrapperAnimation, setWrapperAnimation] = useSpring(() => ({
        x: '-15vw',
        rotateX: 45,
        rotateZ: 45,
        y: 275,
        height: 0,
        config: {tension: 100, friction: 60, clamp: true},
    }));

    useEffect(() => {
        setWrapperAnimation({
            x: editable ? '15vw' : '-15vw',
            rotateX: editable ? 0 : 45,
            rotateZ: editable ? 0 : 45,
            y: editable ? 0 : 275,
        })
    }, [editable]);

    const measuredRef = useRef<HTMLDivElement>(null);

    //scroll logic
    const scrolledY = useRef<number>(0);
    const scrolledPercent = useRef<number>(0);
    const [scrollingAnimation, setScroll] = useSpring(() => ({
        y: 0,
        top: `0%`,
        immediate: false
    }));

    const visibilityOfScrollBar = useSpring({
        from: {opacity: 0, right: 0, display: 'none'},
        to: async animate => {
            await animate(visible ? {display: 'block'} : {opacity: 0, right: -50});
            await animate(visible ? {opacity: 1, right: 0} : {display: 'none'})
        }
    });

    const border = height - window.innerHeight < 0 ? 0.5 * height : height - window.innerHeight / 2;
    const scrollBarHeight = !height ? 0 : (window.innerHeight - 275) / height * 100;

    useWheel(({delta: [, y]}) => {
        scrolledY.current = scrolledY.current + y < border && scrolledY.current + y > 0 ? scrolledY.current + y
            : scrolledY.current + y <= 0 ? 0 : border;
        scrolledPercent.current = scrolledY.current/border * (100 - scrollBarHeight);
        setScroll({
            y: -scrolledY.current,
            top: `${scrolledPercent.current}%`
        });
    }, {domTarget: window, eventOptions: {capture: true}});
    useDrag(({offset: [, y], active}) => {
        if (active) {
            const posY = -y;
            scrolledY.current = posY < border && posY > 0 ? posY : posY <= 0 ? 0 : border;
            scrolledPercent.current = scrolledY.current / border * (100 - scrollBarHeight);
            setScroll({
                y: -scrolledY.current,
                top: `${scrolledPercent.current}%`
            });
        }
    }, {domTarget: window, filterTaps: true});

    //scroller
    const bindDraggedScrollBar = useDrag(({delta: [, y], event}) => {
        event?.stopPropagation();
        const absY = y/window.innerHeight * 100;
        scrolledPercent.current = scrolledPercent.current + absY > 0 && scrolledPercent.current + absY < 100 - scrollBarHeight ?
            scrolledPercent.current + absY : scrolledPercent.current + absY <= 0 ? 0 : 100 - scrollBarHeight;
        scrolledY.current = border * scrolledPercent.current / (100 - scrollBarHeight);
        setScroll({
            y: -scrolledY.current,
            top: `${scrolledPercent.current}%`,
            immediate: (prop) => prop === 'top'
        });
    });

    const scrollByListDrugging = (direction: string) => {
        if (direction === 'bottom' && scrolledY.current < border) {
            scrolledY.current = scrolledY.current + 5 < border ? scrolledY.current + 5 : border;
            scrolledPercent.current = scrolledY.current/border * (100 - scrollBarHeight);
            setScroll({
                y: -scrolledY.current,
                top: `${scrolledPercent.current}%`
            });
        }
        if (direction === 'top' && scrolledY.current > 0) {
            scrolledY.current = scrolledY.current - 5 > 0 ? scrolledY.current - 5 : 0;
            scrolledPercent.current = scrolledY.current/border * (100 - scrollBarHeight);
            setScroll({
                y: -scrolledY.current,
                top: `${scrolledPercent.current}%`
            });
        }
    }

    return (
        <>
            {/* @ts-ignore*/}
                <ReactResizeDetector handleWidth onResize={onResize} refreshMode="debounce" targetRef={measuredRef}>
                {() =>
                    <AllLists style={wrapperAnimation} ref={measuredRef}>
                        <ScrollableWrapper style={{y: scrollingAnimation.y}}>
                            <MappedLists setWrapperAnimation={setWrapperAnimation} width={width}
                                         scrollByListDrugging={scrollByListDrugging}/>
                        </ScrollableWrapper>
                    </AllLists>
                }
            </ReactResizeDetector>
            <ScrollBarWrapper $palette={currentPalette} $visible={visible} style={visibilityOfScrollBar}>
                <ScrollBarThing $palette={currentPalette} style={{top: scrollingAnimation.top}} {...!isMobile && {...bindDraggedScrollBar()}}
                                $height={scrollBarHeight}/>
            </ScrollBarWrapper>
            <div style={{position: 'absolute', width: 100, height: 5, background: 'black', top: 790}}/>
        </>
    );
}

export default ScrollWrapper;

