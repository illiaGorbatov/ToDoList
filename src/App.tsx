import React, {useEffect, useMemo, useRef, useState} from "react";
import TodoList from "./Components/todolists/TodoList";
import {actions, loadTodoListsTC, submitAllChanges} from "./redux/reducer";
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from "./redux/store";
import styled, {createGlobalStyle} from "styled-components/macro";
import {useMedia} from "./hooks/useMedia";
import {animated, useSpring, useTransition} from "react-spring";
import {useDrag} from "react-use-gesture";
import {TodoListType} from "./redux/entities";
import {swap} from "./hooks/swap";
import {library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/free-regular-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";
import BigText from "./Components/BigText";
import EditButton from "./Components/SwitchEditStateButton";
import { useMeasure } from "./hooks/useMesure";

library.add(far, fas);

const GlobalStyles = createGlobalStyle`
  * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    };
  body {
    background-color: white;
    margin: 0;
    padding: 0;
    user-select: none;
    outline: none;
    &::-webkit-scrollbar { 
    display: none;
    };
  };
  html {
    -ms-overflow-style: none; 
  }
`;

const TodoListsContainer = styled(animated.div)` 
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const AllLists = styled(animated.div)`
  background-color: rgba(255, 255, 255, 0.5) ;
  position: relative;
  transform-style: preserve-3d;
  width: 70vw;
  z-index: 2;
`;

const TodoListContainer = styled(animated.div)` 
  transform-style: preserve-3d;
  position: absolute;
`;

const Addddd = styled(animated.div)`
  position: absolute;
  width: 10px;
  height: 10px;
  z-index: 20;
`;


const App = () => {

    const {todoLists, editable, errorsNumber, backgroundImage} = useSelector((store: AppStateType) => store.todoList);
    const dispatch = useDispatch();

    useEffect(() => {
        if (todoLists.length === 0) dispatch(loadTodoListsTC());
    }, []);

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

    const [swappableTodoLists, setNewList] = useState<Array<TodoListType>>([]);
    useEffect(() => {
        setNewList(todoLists)
    }, [todoLists]);

    const wrapperAnimation = useSpring({
        x: editable ? '30vw' : '0vw',
        y: editable ? 0 : 275,
        rotateX: editable ? 0 : 45,
        rotateZ: editable ? 0 : 45,
        config: {tension: 100, friction: 60, clamp: true},
    });

    //background
    const [animateBackground, setBackground] = useSpring(() => ({
        backgroundImage: `${backgroundImage}`
    }));
    useEffect(() => {
        setBackground({backgroundImage: `${backgroundImage}`})
    }, [backgroundImage])

//adaptive grid with transitions
    const columns = useMedia(['(min-width: 2000px)', '(min-width: 1400px)', '(min-width: 800px)'], [4, 3, 2], 1);
    const [bind, {width}] = useMeasure();

    const heights = useRef<Array<number>>([]);
    const {gridItems, diapason} = useMemo(() => {
        const newHeights = new Array(columns).fill(0);
        const gridItems = swappableTodoLists.map(
            (item, i) => {
                const height = item.height || 0;
                const column = i % columns;
                const x = (width / columns) * column;
                const y = (newHeights[column] += height) - height
                const todoList = <TodoList id={item.id} key={item.id} index={i}
                                           listTitle={item.title} listTasks={item.tasks}/>
                return {x, y, width: width / columns, height, id: item.id, todoList}
            });
        const diapason = gridItems.map(
            (item) => {
                const leftX = item.x;
                const rightX = leftX + width / columns;
                const botY = item.y;
                const topY = botY + item.height;
                const horizontalCenter = item.x + width / columns / 2;
                const verticalCenter = item.y + item.height / 2;
                return {leftX, rightX, topY, botY, horizontalCenter, verticalCenter}
            }
        )
        heights.current = newHeights;
        return {gridItems, diapason};
    }, [swappableTodoLists, width]);

    const [debugAn, setAn] = useSpring(() => ({x: 0, y: 0, immediate: true}));

    const verticalBorder = useRef<number>(0);
    const horizontalBorder = useRef<number>(0);
    const prevVelocity = useRef<Array<number>>([0, 0]);
    const calculatePositions = (x: number, y: number, vx: number, vy: number) => {
        if (vx === 0 && vy) {
            horizontalBorder.current = currX.current + x + width / columns / 2
        }
        if (vy === 0 && vx) {
            verticalBorder.current = currY.current + y + currHeight.current / 2;
        }
        if (vx > 0) {
            horizontalBorder.current = currX.current + x + width / columns;
        }
        if (vx < 0) {
            horizontalBorder.current = currX.current + x;
        }
        if (vy > 0) {
            verticalBorder.current = currY.current + y + currHeight.current;
        }
        if (vy < 0) {
            verticalBorder.current = currY.current + y;
        }
        setAn({x: horizontalBorder.current, y: verticalBorder.current, immediate: true})
        let i = diapason.findIndex(item => {
            let horBord = false;
            let verBord = false;
            if (vx === 0 && horizontalBorder.current > item.leftX && horizontalBorder.current < item.rightX
                && prevVelocity.current[0] && vy !== 0) {
                horBord = true
            }
            if (vy === 0 && verticalBorder.current > item.botY && verticalBorder.current < item.topY
                && prevVelocity.current[1] && vx !== 0) {
                verBord = true;
            }
            if (vx > 0 && horizontalBorder.current > item.horizontalCenter && horizontalBorder.current < item.rightX) {
                horBord = true;
            }
            if (vx < 0 && horizontalBorder.current > item.leftX && horizontalBorder.current < item.horizontalCenter) {
                horBord = true;
            }
            if (vy > 0 && verticalBorder.current < item.topY && verticalBorder.current > item.horizontalCenter) {
                verBord = true;
            }
            if (vy < 0 && verticalBorder.current > item.botY && verticalBorder.current < item.horizontalCenter) {
                verBord = true;
            }
            if (horBord && verBord) return true
        });
        prevVelocity.current = [vx, vy];
        return i < swappableTodoLists.length && i >= 0 ? i : null;
    }

    const transitions = useTransition(gridItems, {
        from: ({x, width}) =>
            ({x, y: 0, width, opacity: 0}),
        enter: ({x, y, width}) =>
            ({x, y, width, opacity: 1}),
        update: ({x, y, width}) =>
            ({x, y, width}),
        leave: {height: 0, opacity: 0},
        config: {mass: 5, tension: 500, friction: 100},
        trail: 25,
        key: item => item.id,
    });

    const draggedList = useRef<number>(0);
    const currX = useRef<number>(0);
    const currY = useRef<number>(0);
    const currHeight = useRef<number>(0);
    const [draggedListId, dragList] = useState<null | string>(null);
    const [spring, setSpring] = useSpring(() => ({
        x: 0,
        y: 0,
        width: 0,
        zIndex: 1
    }));
    const gesture = useDrag(({
                                 args: [id], down, movement: [x, y], event,
                                 vxvy: [vx, vy]
                             }) => {
        if (!editable) return;
        draggedList.current = gridItems.findIndex(item => item.id === id);
        if (!draggedListId) {
            currX.current = gridItems[draggedList.current].x;
            currY.current = gridItems[draggedList.current].y;
            currHeight.current = gridItems[draggedList.current].height;
            setSpring({
                x: currX.current,
                y: currY.current,
                width: gridItems[draggedList.current].width,
                zIndex: 3,
                immediate: true,
                onRest: () => dragList(id)
            });
            return
        }
        setSpring({
            x: currX.current + x,
            y: currY.current + y,
            immediate: false
        });
        const newIndex = calculatePositions(x, y, vx, vy);
        if (newIndex !== null && newIndex !== draggedList.current) {
            let newList = swap(swappableTodoLists, draggedList.current, newIndex);
            setNewList(newList);
        }
        if (!down) {
            setSpring({
                x: gridItems[draggedList.current].x,
                y: gridItems[draggedList.current].y,
                width: gridItems[draggedList.current].width,
                zIndex: 1,
                onRest: () => dragList(null),
                immediate: false
            });
        }
    }, {filterTaps: true});

    const fragment = transitions((style, item, t, i) =>
        <TodoListContainer style={draggedListId && draggedListId === item.id ? spring : style} {...gesture(item.id)}>
            {item.todoList}
        </TodoListContainer>
    );
console.log('render')
    return (
        <>
            <GlobalStyles/>
            {/*<AddNewTask onAddItemClick={addTodoList} itemType={'todoList'}/>*/}
            <TodoListsContainer style={animateBackground}>
                <BigText/>
                <EditButton/>
                <AllLists {...bind} style={{height: (Math.max(...heights.current) || 0), ...wrapperAnimation}}>
                    <Addddd style={debugAn}/>
                    {fragment}
                </AllLists>
            </TodoListsContainer>
           {/* <div style={{width: 30, height: 30, backgroundColor: 'white', position: "absolute", left: 300, top: 700, zIndex: 10}}>
                {errorsNumber}
            </div>*/}
        </>
    );
}

export default App;

