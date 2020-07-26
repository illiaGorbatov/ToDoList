import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {animated, useSprings, SpringStartFn, useSpring} from "react-spring";
import {swap} from "../../hooks/swap";
import {useDrag} from "react-use-gesture";
import {actions} from "../../redux/functionalReducer";
import styled from "styled-components/macro";
import TodoList from "./TodoList";
import {defaultPalette, neumorphColors} from "../neumorphColors";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import isEqual from "react-fast-compare";
import ClosingButton from "./CloseButton";


const TodoListContainer = styled(animated.div)<{ $width: number }>` 
  transform-style: preserve-3d;
  position: absolute;
  width: ${props => props.$width}px;
`;

const CloseButtonAnimatedWrapper = styled(animated.div)`
  position: absolute;
  border-radius: 100%;
`;

type PropsType = {
    setWrapperAnimation: SpringStartFn<{ x: string, rotateX: number, rotateZ: number, y: number}>,
    width: number,
    scrollByListDrugging: (direction: string) => void,
    setCloseLookState: (height: number) => void,
    returnFromCloseLookState: () => void,
    switchScrollBar: (visibility: boolean) => void
}

type GridItemsType = {
    x: number,
    y: number,
    height: number,
    id: string,
    rightX: number,
    botY: number,
    horizontalCenter: number,
    verticalCenter: number,
    index: number,
}

const MappedLists: React.FC<PropsType> = ({setWrapperAnimation, width, scrollByListDrugging,
                                              setCloseLookState, returnFromCloseLookState, switchScrollBar}) => {
//resize logic

    const editable = useSelector((store: AppStateType) => store.todoList.editable, shallowEqual);
    const todoLists = useSelector((store: AppStateType) => store.todoList.todoLists, isEqual);
    const dispatch = useDispatch();

    const columns = useMemo(() => {
        return width >= 1700 ? 4 : width >= 1100 ? 3 : width >= 700 ? 2 : 1
    }, [width]);
    const currWidth = useMemo(() => width / columns, [width]);
    useEffect(() => {
        recalculateMeasures();
        setSprings(i => {
            const currentSettings = gridItems.current.find((list) => list.index === todoLists.length-1-i)!;
            return {x: currentSettings.x, y: currentSettings.y}
        });
    }, [width, columns, currWidth]);


// child height calculation logic
    const temporaryValue = useRef<Array<{ height: number, id: string }>>([]);
    const setNewHeights = useCallback((height: number, id: string) => {
        const findHeight = temporaryValue.current.findIndex(item => item.id === id);
        const newHeightsArray = findHeight === -1 ? [...temporaryValue.current, {height, id}]
            : temporaryValue.current.map((item, i) => {
                if (i === findHeight) return {height, id};
                return item
            });
        temporaryValue.current = newHeightsArray
        if (newHeightsArray.length === todoLists.length) {
            recalculateMeasures();
            setSprings(i => {
                const currentSettings = gridItems.current.find((list) => list.index === todoLists.length-1-i)!;
                return {x: currentSettings.x, y: currentSettings.y}
            })
        }
    }, [todoLists, width, columns, currWidth])

    const deleteList = useCallback((id: string) => {
        temporaryValue.current = temporaryValue.current.filter(item => item.id !== id)
    }, []);

    const height = useRef<number>(0);
    const gridItems = useRef<Array<GridItemsType>>([]);

    const [springs, setSprings] = useSprings(todoLists.length, i => {
        if (gridItems.current.length === 0) return {x: 0, y: 0, zIndex: 3, opacity: 1, display: 'block'};
        const currentSettings = gridItems.current.find((list) => list.index === todoLists.length-1-i);
        return {
            x: currentSettings ? currentSettings.x : 0,
            y: currentSettings ? currentSettings.y : 0,
            opacity: 1,
            zIndex: 3,
            display: 'block'
        }
    }, [todoLists])


//swap animation logic
    useEffect(() => {
        if (!editable && gridItems.current.length === 0) {
            const newHeights = new Array(columns).fill(0);
            gridItems.current = todoLists.map(
                (item, i) => {
                    const heightInMeasuredArray = temporaryValue.current.find(list => item.id === list.id);
                    const height = heightInMeasuredArray ? heightInMeasuredArray.height : 0;
                    const column = i % columns;
                    const x = currWidth * column;
                    const y = (newHeights[column] += height) - height
                    const rightX = x + currWidth;
                    const botY = y + height;
                    const horizontalCenter = x + currWidth / 2;
                    const verticalCenter = y + height / 2;
                    const index = i;
                    return {x, y, height, id: item.id, botY, rightX, horizontalCenter, verticalCenter, index}
                });
            height.current = Math.max(...newHeights);
            dispatch(actions.setHeight(height.current));
        }
        if (editable && gridItems.current.length < todoLists.length) {
            gridItems.current = [{
                x: 0, y: 0, height: 0, id: todoLists[0].id, botY: 0,
                rightX: 0, horizontalCenter: 0, verticalCenter: 0, index: 0
            }, ...gridItems.current].map((item, i) => {
                if (i === 0) return item;
                return {...item, index: item.index + 1}
            })
            recalculateMeasures()
        }
        if (editable && gridItems.current.length > todoLists.length) {
            const deletedListIndex = gridItems.current.findIndex(item =>
                todoLists.findIndex(list => list.id === item.id) === -1);
            const deletedList = gridItems.current[deletedListIndex];
            gridItems.current = gridItems.current.map((item) => {
                const index = item.index > deletedList.index ? item.index - 1 : item.index;
                return {...item, index}
            }).filter((item, i) => i !== deletedListIndex);
            recalculateMeasures()
        }
        if (gridItems.current.length === todoLists.length) recalculateMeasures();
        setSprings(i => {
            const currentSettings = gridItems.current.find((list) => list.index === todoLists.length-1-i)!;
            return {x: currentSettings.x, y: currentSettings.y}
        })
    }, [todoLists]);

    const recalculateMeasures = useCallback(() => {
        const newHeights = new Array(columns).fill(0);
        gridItems.current = gridItems.current.map((item, i) => {
            const heightInMeasuredArray = temporaryValue.current.find(list => item.id === list.id);
            const height = heightInMeasuredArray ? heightInMeasuredArray.height : 0;
            const column = i % columns;
            const x = currWidth * column;
            const y = (newHeights[column] += height) - height;
            const rightX = x + currWidth;
            const botY = y + height;
            const horizontalCenter = x + currWidth / 2;
            const verticalCenter = y + height / 2;
            return {...item, x, y, rightX, botY, horizontalCenter, verticalCenter, height}
        });
        if (Math.max(...newHeights) !== height.current) {
            height.current = Math.max(...newHeights);
            dispatch(actions.setHeight(height.current));
        }
    }, [currWidth, columns]);

    const reorder = useCallback((oldIndex: number, newIndex: number) => {
        const newHeights = new Array(columns).fill(0);
        gridItems.current = swap(gridItems.current, oldIndex, newIndex).map((item, i) => {
            const column = i % columns;
            const x = currWidth * column;
            const y = (newHeights[column] += item.height) - item.height;
            const rightX = x + currWidth;
            const botY = y + item.height;
            const horizontalCenter = x + currWidth / 2;
            const verticalCenter = y + item.height / 2;
            return {...item, x, y, rightX, botY, horizontalCenter, verticalCenter}
        });
        if (Math.max(...newHeights) !== height.current) {
            height.current = Math.max(...newHeights);
            dispatch(actions.setHeight(height.current));
        }
    }, [currWidth, columns]);

    const calculatePositions = useCallback((x: number, y: number) => {
        const xPos = currItem.current.horizontalCenter + x;
        const yPos = currItem.current.verticalCenter + y;
        let i = gridItems.current.findIndex(item => {
            if (item.x < xPos && item.rightX > xPos && item.y < yPos && item.botY > yPos) return true
        });
        return i < todoLists.length && i >= 0 ? i : null;
    }, [todoLists]);

    const setActualSprings = useCallback((x: number, y: number, springsIndex: number) => {
        setSprings(i => {
            if (i === springsIndex) {
                return {
                    x: currItem.current.x + x,
                    y: currItem.current.y + y,
                    zIndex: 4,
                    immediate: (n: string): boolean => n === 'zIndex'
                }
            }
            const currentSettings = gridItems.current.find((list) => list.index === todoLists.length - 1 - i)!;
            return {x: currentSettings.x, y: currentSettings.y}
        })
    }, [todoLists]);

    const currItem = useRef<GridItemsType>({
        botY: 0,
        height: 0,
        horizontalCenter: 0,
        id: "",
        index: 0,
        rightX: 0,
        verticalCenter: 0,
        x: 0,
        y: 0
    });
    const bounds = useRef<{ left: number, right: number, top: number, bottom: number, pageTop: number, pageBottom: number }>({
        left: 0, right: 0, top: 0, bottom: 0, pageTop: 0, pageBottom: 0
    });
    const eventCoords = useRef<{ offsetX: number, offsetY: number, clientX: number, clientY: number } | null>(null);
    const virtualY = useRef<number>(0);
    const addedY = useRef<number>(0);
    const timeoutId = useRef<number | null>(null);

    const getBounds = useCallback(() => {
        const interfaceHeight = window.innerHeight*0.22 > 200 ? window.innerHeight*0.22 : 200;
        const left = -currItem.current.x - 35 + eventCoords.current!.offsetX;
        const right = width - currItem.current.rightX + 35 + (width / columns - eventCoords.current!.offsetX);
        const top = -currItem.current.y - 35 - eventCoords.current!.offsetY - 35;
        const bottom = height.current - currItem.current.y - 35 - (eventCoords.current!.offsetY + 35);
        const pageTop = -eventCoords.current!.clientY + interfaceHeight + 35;
        const pageBottom = window.innerHeight - window.innerHeight*0.1 + pageTop - interfaceHeight;
        bounds.current = {left, right, top, bottom, pageTop, pageBottom}
    }, [width, columns]);

    const gesture = useDrag(({
                                 args: [index, springsIndex], down, movement: [x, y],
                                 active, first, event
                             }) => {
        event?.stopPropagation();
        const draggedList = gridItems.current.findIndex(item => item.index === index);
        if (first) {
            dispatch(actions.setFocusedStatus(true))
            currItem.current = gridItems.current[draggedList];
            //@ts-ignore
            eventCoords.current = {offsetX: event.offsetX, offsetY: event.offsetY, clientX: event.clientX, clientY: event.clientY};
            getBounds();
            virtualY.current = y;
            addedY.current = 0;
            console.log(bounds.current)
        }
        if (timeoutId.current !== null) {
            clearTimeout(timeoutId.current);
            timeoutId.current = null
        }
        console.log(virtualY.current)
        if (active) {
            if (y > bounds.current.pageBottom && virtualY.current < bounds.current.bottom) {
                const awaitScroll = async () => {
                    const promise = new Promise((resolve) => {
                        timeoutId.current = window.setTimeout(() => {
                                scrollByListDrugging('bottom');
                                virtualY.current = virtualY.current + 5;
                                addedY.current = addedY.current + 5;
                                const newIndex = calculatePositions(x, virtualY.current);
                                if (newIndex !== null && newIndex !== draggedList) reorder(draggedList, newIndex);
                                setActualSprings(x, virtualY.current, springsIndex)
                                resolve()
                            }
                            , 10)
                    });
                    console.log(virtualY.current)
                    await promise.then(res => {
                        if (virtualY.current < bounds.current.bottom) awaitScroll()
                    })
                }
                (async () => await awaitScroll())()
            } else if (y < bounds.current.pageTop && virtualY.current > bounds.current.top) {
                const awaitScroll = async () => {
                    const promise = new Promise((resolve) => {
                        timeoutId.current = window.setTimeout(() => {
                                scrollByListDrugging('top');
                                virtualY.current = virtualY.current - 5;
                                addedY.current = addedY.current - 5;
                                const newIndex = calculatePositions(x, virtualY.current);
                                if (newIndex !== null && newIndex !== draggedList) reorder(draggedList, newIndex);
                                setActualSprings(x, virtualY.current, springsIndex)
                                resolve()
                            }
                            , 10)
                    });
                    console.log(virtualY.current)
                    await promise.then(res => {
                        if (virtualY.current > bounds.current.top) awaitScroll()
                    })
                }
                (async () => await awaitScroll())()
            } else {
                virtualY.current = y + addedY.current;
                const newIndex = calculatePositions(x, virtualY.current);
                if (newIndex !== null && newIndex !== draggedList) reorder(draggedList, newIndex);
                setActualSprings(x, virtualY.current, springsIndex)
            }
        }
        if (!down) {
            eventCoords.current = null;
            setSprings(i => {
                const currentSettings = gridItems.current.find((list) => list.index === todoLists.length - 1 - i)!;
                return {x: currentSettings.x, y: currentSettings.y, zIndex: 3}
            });
            const newOrder = gridItems.current.map(item => item.id)
            dispatch(actions.swapTodoLists(newOrder));
            dispatch(actions.setFocusedStatus(false))
        }
    }, {filterTaps: true});

    const [indexOfLookedList, setIndexOfLookedList] = useState<number | null>(null);
    const closeLook = useCallback(async (index: number) => {
        if (editable || indexOfLookedList !== null) return;
        console.log('here')
        const currItem = gridItems.current.find(item => item.index === index)!;
        switchScrollBar(false);
        dispatch(actions.setCloseLookState(true));
        await setSprings(i => {
            if (i !== todoLists.length-1-index) return {
                to: async animate => {
                    await animate({opacity: 0});
                    await animate({display: 'none'})
                }
            };
            return {to: false}
        });
        dispatch(actions.setHeight(currItem.height));
        setWrapperAnimation({
            x: window.innerWidth <= 800 ? '5vw' : '15vw',
            rotateX: 0,
            rotateZ: 0,
            y: 0,
        });
        setCloseLookState(currItem.height);
        dispatch(actions.setPalette(neumorphColors[(todoLists.length-1-index) % neumorphColors.length]));
        setIndexOfLookedList(index);
        await setSprings(i => {
            if (i !== todoLists.length-1-index) return {to: false};
            return {
                y: window.innerHeight / 2 - currItem.height / 2,
                x: width / 2 - (width / columns) / 2
            }
        });
        setCloseButtonAnimation({
            to: async animate => {
                await animate({
                    y: window.innerHeight / 2 - currItem.height / 2 - 60,
                    x: width / 2 + (width / columns) / 2 + 20,
                    display: 'block',
                    immediate: true
                });
                await animate({opacity: 1, immediate: false})
            }
        })
    }, [todoLists, setCloseLookState, indexOfLookedList]);

    const returnFromCloseLook = useCallback(async () => {
        switchScrollBar(false)
        setCloseButtonAnimation({
            to: async animate => {
                await animate({opacity: 0});
                await animate({display: 'none'})
            }
        });
        await setSprings(i => {
            if (i !== todoLists.length-1-indexOfLookedList!) return {to: false};
            const currItem = gridItems.current.find(item => item.index === indexOfLookedList)!
            return {x: currItem.x, y: currItem.y}
        });
        dispatch(actions.setCloseLookState(false));
        returnFromCloseLookState();
        dispatch(actions.setHeight(height.current));
        await setWrapperAnimation({
            x: window.innerWidth <= 800 ? '-5vw' : '-15vw',
            rotateX: 45,
            rotateZ: 45,
            y: 275,
        });
        dispatch(actions.setPalette(defaultPalette));
        setIndexOfLookedList(null);
        setSprings(i => {
            if (i !== todoLists.length-1-indexOfLookedList!) return {opacity: 1, display: 'block'};
            return {to: false}
        });
    }, [todoLists, returnFromCloseLookState, indexOfLookedList]);

    const [closeButtonAnimation, setCloseButtonAnimation] = useSpring(() => ({
        x: 0,
        y: 0,
        opacity: 0,
        display: 'none'
    }));

    return (
        <>
            <CloseButtonAnimatedWrapper onClick={returnFromCloseLook} style={closeButtonAnimation}>
                <ClosingButton/>
            </CloseButtonAnimatedWrapper>
            {todoLists.length !== 0 && todoLists.map((list, i) =>
                <TodoListContainer
                    style={springs[todoLists.length - i - 1]} {...editable && {...gesture(i, todoLists.length-i-1)}}
                    onClick={() => closeLook(i)}
                    $width={currWidth} key={list.id}>
                    <TodoList id={list.id} paletteIndex={(todoLists.length-1-i) % neumorphColors.length}
                              deleteList={deleteList} setNewHeights={setNewHeights} closeLook={i === indexOfLookedList}
                              listTitle={list.title} listTasks={list.tasks}/>
                </TodoListContainer>)}
        </>
    )
}

export default React.memo(MappedLists, isEqual)