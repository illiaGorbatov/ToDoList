import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {animated, useSprings, SpringStartFn, useSpring} from "react-spring";
import {swap} from "../../hooks/swap";
import {useDrag} from "react-use-gesture";
import {actions} from "../../redux/functionalReducer";
import styled from "styled-components/macro";
import TodoList from "./TodoList";
import {neumorphColors} from "../neumorphColors";
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
    setWrapperAnimation: SpringStartFn<{ x: string, rotateX: number, rotateZ: number, y: number, height: number }>,
    width: number
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

const MappedLists: React.FC<PropsType> = ({setWrapperAnimation, width}) => {
//resize logic

    const editable = useSelector((store: AppStateType) => store.todoList.editable, shallowEqual);
    const todoLists = useSelector((store: AppStateType) => store.todoList.todoLists, isEqual);
    const dispatch = useDispatch();

    const columns = useMemo(() => {
        return width >= 2000 ? 5 : width >= 1400 ? 4 : width >= 900 ? 3 : width >= 600 ? 2 : 1
    }, [width]);
    const currWidth = useMemo(() => width / columns, [width]);
    useEffect(() => {
        recalculateMeasures();
        setSprings(i => {
            const currentSettings = gridItems.current.find((list) => list.index === i)!;
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
        /*console.log(gridItems.current)*/
        if (newHeightsArray.length === todoLists.length) {
            /*console.log(gridItems.current, width, columns)*/
            recalculateMeasures();
            setSprings(i => {
                const currentSettings = gridItems.current.find((list) => list.index === i)!;
                return {x: currentSettings.x, y: currentSettings.y}
            })
        }
    }, [todoLists, width, columns, currWidth,/*, newListsId*/]);

    const deleteList = useCallback((id: string) => {
        temporaryValue.current = temporaryValue.current.filter(item => item.id !== id)
    }, []);

    const height = useRef<number>(0);
    const gridItems = useRef<Array<GridItemsType>>([]);

    const [springs, setSprings] = useSprings(todoLists.length, i => {
        if (gridItems.current.length === 0) return {x: 0, y: 0, zIndex: 3, opacity: 1, display: 'block'};
        const currentSettings = gridItems.current.find((list) => list.index === i);
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
            setWrapperAnimation({height: height.current})
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
            const currentSettings = gridItems.current.find((list) => list.index === i)!;
            return {x: currentSettings.x, y: currentSettings.y}
        })
        console.log(gridItems.current);

    }, [todoLists]);

    const recalculateMeasures = () => {
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
            setWrapperAnimation({height: height.current});
            dispatch(actions.setHeight(height.current));
        }
    }

    const reorder = (oldIndex: number, newIndex: number) => {
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
            setWrapperAnimation({height: height.current});
            dispatch(actions.setHeight(height.current));
        }
    }

    const calculatePositions = (x: number, y: number) => {
        const xPos = currItem.current.horizontalCenter + x;
        const yPos = currItem.current.verticalCenter + y;
        let i = gridItems.current.findIndex(item => {
            if (item.x < xPos && item.rightX > xPos && item.y < yPos && item.botY > yPos) return true
        });
        return i < todoLists.length && i >= 0 ? i : null;
    }

    const draggedList = useRef<number>(0);
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
    const bounds = useRef<{ left: number, right: number, top: number, bottom: number }>({
        left: 0, right: 0, top: 0, bottom: 0
    });

    const getBounds = () => {
        const left = gridItems.current.length !== 0 ? -gridItems.current[draggedList.current].x - 25 : 0;
        const right = gridItems.current.length !== 0 ? width - gridItems.current[draggedList.current].rightX + 25 : 0;
        const top = gridItems.current.length !== 0 ? -gridItems.current[draggedList.current].y - 25 : 0;
        const bottom = gridItems.current.length !== 0 ?
            height.current - gridItems.current[draggedList.current].botY + 25 : 0;
        console.log(left, right, top, bottom)
        return {left, right, top, bottom}
    }

    const gesture = useDrag(({
                                 args: [index], down, movement: [x, y],
                                 active, first, event
                             }) => {
        event?.stopPropagation();
        draggedList.current = gridItems.current.findIndex(item => item.index === index);
        if (first) {
            currItem.current = gridItems.current[draggedList.current];
        }
        if (active) {
            const newIndex = calculatePositions(x, y);
            if (newIndex !== null && newIndex !== draggedList.current) {
                reorder(draggedList.current, newIndex);
            }
            setSprings(i => {
                if (i === index) {
                    return {
                        x: currItem.current.x + x,
                        y: currItem.current.y + y,
                        zIndex: 4,
                        immediate: (n: string): boolean => n === 'zIndex'
                    }
                }
                const currentSettings = gridItems.current.find((list) => list.index === i)!;
                return {x: currentSettings.x, y: currentSettings.y}
            })
        }
        if (!down) {
            (async () => {
                await setSprings(i => {
                    const currentSettings = gridItems.current.find((list) => list.index === i)!;
                    return {x: currentSettings.x, y: currentSettings.y, zIndex: 3}
                });
                const newOrder = gridItems.current.map(item => item.id)
                dispatch(actions.swapTodoLists(newOrder))
            })();
        }
    }, {filterTaps: true});

    const [indexOfLookedList, setIndexOfLookedList] = useState<number | null>(null);
    const closeLook = async (index: number) => {
        if (editable) return;
        const currItem = gridItems.current.find(item => item.index === index)!;
        await setSprings(i => {
            if (i !== index) return {
                to: async animate => {
                    await animate({opacity: 0});
                    await animate({display: 'none'})
                }
            };
            return {to: false}
        });
        setWrapperAnimation({
            height: window.innerHeight,
            x: '15vw',
            rotateX: 0,
            rotateZ: 0,
            y: 0,
        });
        dispatch(actions.setCurrentPaletteIndex((todoLists.length - index) % neumorphColors.length))
        setIndexOfLookedList(index);
        await setSprings(i => {
            if (i !== index) return {to: false};
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
    };

    const returnFromCloseLook = async () => {
        setCloseButtonAnimation({
            to: async animate => {
                await animate({opacity: 0});
                await animate({display: 'none'})
            }
        });
        setSprings(i => {
            if (i !== indexOfLookedList) return {to: false};
            const currItem = gridItems.current.find(item => item.index === i)!
            return {x: currItem.x, y: currItem.y}
        });
        await setWrapperAnimation({
            x: '-15vw',
            rotateX: 45,
            rotateZ: 45,
            y: 275,
            height: height.current,
            immediate: (prop) => prop === 'height'
        });
        dispatch(actions.setCurrentPaletteIndex(null));
        setIndexOfLookedList(null);
        setSprings(i => {
            if (i !== indexOfLookedList) return {opacity: 1, display: 'block'};
            return {to: false}
        });
    };

    const [closeButtonAnimation, setCloseButtonAnimation] = useSpring(() => ({
        x: 0,
        y: 0,
        opacity: 0,
        display: 'none'
    }));

    return (
        <>
            <CloseButtonAnimatedWrapper onClick={returnFromCloseLook}
                style={closeButtonAnimation}>
                <ClosingButton/>
            </CloseButtonAnimatedWrapper>
            {todoLists.length !== 0 && todoLists.map((list, i) =>
                <TodoListContainer style={springs[i]} {...editable && {...gesture(i)}}
                                   onClick={() => closeLook(i)}
                                   $width={currWidth} key={list.id}>
                    <TodoList id={list.id} colorPalette={(todoLists.length - i) % neumorphColors.length}
                              deleteList={deleteList} setNewHeights={setNewHeights} closeLook={i === indexOfLookedList}
                              listTitle={list.title} listTasks={list.tasks}/>
                </TodoListContainer>)}
        </>
    )
}

export default React.memo(MappedLists, isEqual)