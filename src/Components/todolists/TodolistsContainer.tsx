import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import TodoList from "./TodoList";
import {actions, getStateFromServer} from "../../redux/reducer";
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {AppStateType} from "../../redux/store";
import styled from "styled-components/macro";
import {useMedia} from "../../hooks/useMedia";
import {animated, useSpring, useSprings} from "react-spring";
import {useDrag, useHover} from "react-use-gesture";
import {swap} from "../../hooks/swap";
import isEqual from "react-fast-compare";
import ReactResizeDetector from 'react-resize-detector';
import {config} from "@fortawesome/fontawesome-svg-core";

const neumorphColors = [
    {
        background: '#1a0b3b',
        backgroundOuter: 'linear-gradient(145deg, #170a35, #1c0c3f)',
        shadows: '27px 27px 54px #0a0418, -27px -27px 54px #2a125e',
        shadowsHovered: 'inset 27px 27px 54px #0a0418, inset -27px -27px 54px #2a125e',
        innerShadows: '11px 11px 23px #0a0418, -11px -11px 23px #2a125e',
        color: 'rgb(108, 98, 131)',
        hoveredAltBackground: '#ff9605',
        hoveredColor: 'rgb(30, 13, 55)',
        backgroundAltInner: 'linear-gradient(145deg, #ffa105, #e68705)',
        shadowsAlt: '22px 22px 49px #a86303, -22px -22px 49px #ffc907',
        shadowsHoveredAlt: 'inset 22px 22px 49px #a86303, inset -22px -22px 49px #ffc907',
    },
    {
        background: '#f6f7fa',
        backgroundOuter: 'linear-gradient(145deg, #dddee1, #ffffff)',
        shadows: '22px 22px 49px #a2a3a5, -22px -22px 49px #ffffff',
        shadowsHovered: 'inset 22px 22px 49px #a2a3a5, inset -22px -22px 49px #ffffff',
        innerShadows: '11px 11px 23px #a2a3a5, -11px -11px 23px #ffffff',
        color: '#ff9605',
        hoveredAltBackground: '#ff9605',
        hoveredColor: '#f6f7fa',
        backgroundAltInner: 'linear-gradient(145deg, #ffa105, #e68705)',
        shadowsAlt: '22px 22px 49px #a86303, -22px -22px 49px #ffc907',
        shadowsHoveredAlt: 'inset 22px 22px 49px #a86303, inset -22px -22px 49px #ffc907',
    },
    {
        background: '#ff9605',
        backgroundOuter: 'linear-gradient(145deg, #ffa105, #e68705)',
        shadows: '22px 22px 49px #a86303, -22px -22px 49px #ffc907',
        shadowsHovered: 'inset 22px 22px 49px #a86303, inset -22px -22px 49px #ffc907',
        innerShadows: '11px 11px 23px #a86303, -11px -11px 23px #ffc907',
        color: '#f6f7fa',
        hoveredAltBackground: '#f6f7fa',
        hoveredColor: '#ff9605',
        backgroundAltInner: 'linear-gradient(145deg, #dddee1, #ffffff)',
        shadowsAlt: '22px 22px 49px #a2a3a5, -22px -22px 49px #ffffff',
        shadowsHoveredAlt: 'inset 22px 22px 49px #a2a3a5, inset -22px -22px 49px #ffffff',
    }
];

const AllLists = styled(animated.div)<{ height: number }>`
  position: relative;
  transform-style: preserve-3d;
  width: 70vw;
  height: ${props => props.height}px;
`;

const TodoListContainer = styled(animated.div)<{ width: number }>` 
  transform-style: preserve-3d;
  position: absolute;
  width: ${props => props.width}px;
`;

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

const TodoListsContainer: React.FC = () => {

    const editable = useSelector((store: AppStateType) => store.todoList.editable, shallowEqual);
    const todoLists = useSelector((store: AppStateType) => store.todoList.todoLists, isEqual);
    const newListsId = useSelector((store: AppStateType) => store.todoList.newListsId, isEqual);
    const newTasksId = useSelector((store: AppStateType) => store.todoList.newTasksId, isEqual);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getStateFromServer());
    }, []);
    useEffect(() => {
        console.log('mounted');
        return () => console.log('unmounting...');
    }, [])

    const addTodoList = (title: string) => {
        const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, (c, r) => ('x' == c ? (r = Math.random() * 16 | 0) : (r & 0x3 | 0x8)).toString(16));
        const newList = {
            id,
            title,
            tasks: []
        }
        dispatch(actions.addTodoList(newList));
    };

    const wrapperAnimation = useSpring({
        x: editable ? '30vw' : '0vw',
        y: editable ? 0 : 275,
        rotateX: editable ? 0 : 45,
        rotateZ: editable ? 0 : 45,
        config: {tension: 100, friction: 60, clamp: true},
    });

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
            console.log(gridItems.current)
            setSprings(i => {
                const currentSettings = gridItems.current.find((list) => list.index === i)!;
                return {x: currentSettings.x, y: currentSettings.y}
            })
        }
    }, [todoLists, newListsId]);

    const deleteList = useCallback((id: string) => {
        temporaryValue.current = temporaryValue.current.filter(item => item.id !== id)
    }, []);

    const heights = useRef<Array<number>>([]);
    const gridItems = useRef<Array<GridItemsType>>([]);

    const [springs, setSprings] = useSprings(todoLists.length, i => {
        if (gridItems.current.length === 0) return {x: 0, y: 0, zIndex: 3};
        const currentSettings = gridItems.current.find((list) => list.index === i);
        return {x: currentSettings ? currentSettings.x : 0, y: currentSettings ? currentSettings.y : 0}
    })

    //resize logic
    const [width, setWidth] = useState<number>(0);
    const onResize = (width: number) => setWidth(width);
    const columns = useMemo(() => {
        return width >= 2000 ? 5 : width >= 1400 ? 4 : width >= 900 ? 3 : width >= 600 ? 2 : 1
    }, [width]);
    const currWidth = useMemo(() => width / columns, [width]);
    const measuredRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        recalculateMeasures();
        setSprings(i => {
            const currentSettings = gridItems.current.find((list) => list.index === i)!;
            return {x: currentSettings.x, y: currentSettings.y}
        })
    }, [width, columns]);
    console.log(width, columns)

    //changing id of added lists
    useEffect(() => {
        if (newListsId.length !== 0) {
            temporaryValue.current = temporaryValue.current.map(item => {
                const newList = newListsId.find(newList => newList.oldId === item.id);
                if (newList) return {...item, id: newList.newId}
                return item
            });
            gridItems.current = gridItems.current.map(item => {
                const newList = newListsId.find(newList => newList.oldId === item.id);
                if (newList) return {...item, id: newList.newId}
                return item
            });
        }
    }, [newListsId]);

    //changing id of added tasks
    const collectedNewTasksId = useMemo(() => {
        const collectedNewListsId: Array<string> = [];
        newTasksId.map(task => {
            const listId = collectedNewListsId.find(item => item === task.todoListId)
            if (!listId) collectedNewListsId.push()
        })
        return collectedNewListsId.map(item => {
            const tasks = newTasksId.filter(task => task.todoListId === item);
            return {todoListId: item, tasks}
        })
    }, [newTasksId]);

    //swap animation logic
    useEffect(() => {
        if (gridItems.current.length === 0) {
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
            heights.current = newHeights;
        }
        if (gridItems.current.length < todoLists.length) {
            gridItems.current = [{
                x: 0, y: 0, height: 0, id: todoLists[0].id, botY: 0,
                rightX: 0, horizontalCenter: 0, verticalCenter: 0, index: 0
            }, ...gridItems.current].map((item, i) => {
                if (i === 0) return item;
                return {...item, index: item.index + 1}
            })
            recalculateMeasures()
        }
        if (gridItems.current.length > todoLists.length) {
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
        heights.current = newHeights;
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
        heights.current = newHeights;
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
            Math.max(...heights.current) - gridItems.current[draggedList.current].botY + 25 : 0;
        console.log(left, right, top, bottom)
        return {left, right, top, bottom}
    }

    const gesture = useDrag(({
                                 args: [index], down, movement: [x, y],
                                 active, first
                             }) => {
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
    console.log('wrapRender')

    const findListIndex = (id: string) => {
        const item = gridItems.current.find(item => item.id === id)
        return item ? item.index : 0;
    }

    //hover animation logic

    /*const hoverBind = useHover(({args: [index],hovering, first}) => {
        if (first) {
            const
            dispatch(actions.setBackground(neumorphColors[index].background));

        }

    })*/

    return (
        // @ts-ignore
        <ReactResizeDetector handleWidth onResize={onResize} refreshMode="debounce" targetRef={measuredRef}>
            {() => <AllLists height={(Math.max(...heights.current) || 0)} style={wrapperAnimation} ref={measuredRef}>
                {todoLists.length !== 0 && todoLists.map((list, i) =>
                    <TodoListContainer style={springs[i]} /*{...hoverBind((todoLists.length-i)%3)}*/
                                       {...editable && {...gesture(i)}}
                                       width={currWidth} key={list.id}>
                        <TodoList id={list.id} index={todoLists.length-i}
                                  deleteList={deleteList} setNewHeights={setNewHeights}
                                  listTitle={list.title} listTasks={list.tasks}
                                  newTasksId={collectedNewTasksId.find(item => item.todoListId === list.id)}/>
                    </TodoListContainer>)}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 20,
                    backgroundColor: 'black',
                    width: 10,
                    height: 10
                }}
                     onClick={() => addTodoList('www')}/>
            </AllLists>}
        </ReactResizeDetector>
    );
}

export default TodoListsContainer;

