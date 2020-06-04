import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import TodoList from "./Components/TodoList";
import AddNewItemForm from "./Components/AddNewItemForm";
import TodoListTitle from "./Components/TodoListTitle";
import {addTodoListTC, loadTodoListsTC} from "./redux/reducer";
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from "./redux/store";
import styled, {createGlobalStyle} from "styled-components/macro";
import {useMedia} from "./hooks/useMedia";
import {useMeasure} from "./hooks/useMeasure";
import {animated, useTransition, useSprings, useSpring} from "react-spring";
import {useDrag} from "react-use-gesture";
import {swap} from "./hooks/swap";
import {TodoListType} from "./redux/entities";

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
  };
`;

const TodoListsContainer = styled.div`
  display: flex;
  justify-content: center;
  background: #f0f0f0;
  padding: 15px;
`;

const AllLists = styled.div`
  position: relative;
  width: 100%;
`;

const TodoListContainer = styled(animated.div)` 
  position: absolute;
  will-change: transform, width, height, opacity;
  padding: 15px;
`;

const App = () => {

    const todoLists = useSelector((store: AppStateType) => store.todoList.todoLists);
    const dispatch = useDispatch();

    useEffect(() => {
        if (todoLists.length === 0) dispatch(loadTodoListsTC());
    }, []);

    const addTodoList = (title: string) => {
        dispatch(addTodoListTC(title));
    };

    const [swappableTodoLists, setNewList] = useState<Array<TodoListType>>([]);
    useEffect(() => {
        setNewList(todoLists)
    }, [todoLists]);

    const TodoLists = useMemo(() => {
        return swappableTodoLists.map(
            (todoList) => <TodoList id={todoList.id} key={todoList.id}
                                    listTitle={todoList.title} listTasks={todoList.tasks}/>
        )
    }, [swappableTodoLists]);

//adaptive grid with transitions
    const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [5, 4, 3], 2);
    const [bind, {width}] = useMeasure();

    const heights = useRef<Array<number>>([]);
    const {gridItems, diapason} = useMemo(() => {
        let newHeights = new Array(columns).fill(0);
        let gridItems =  swappableTodoLists.map(
            (item, i) => {
                const height = item.height || 0;
                const column = i % columns;
                const x = (width / columns) * column;
                const y = (newHeights[column] += height) - height;
                return {x, y, width: width / columns, height, id: item.id, itemIndex: i}
            });
        let diapason = gridItems.map(
            (item) => {
                const leftX = item.x;
                const rightX = leftX + width / columns;
                const topY = item.y;
                const botY = topY + item.height;
                const horizontalCenter = item.x + width/2;
                const verticalCenter = item.y + item.height/2;
                return {leftX, rightX, topY, botY, horizontalCenter, verticalCenter}
            }
        )
        heights.current = newHeights;
        return {gridItems, diapason};
    }, [swappableTodoLists]);

    const calculatePositions = (x: number, y: number, vx: number, vy: number) => {
        let verticalBorder = 0;
        let horizontalBorder = 0;
        if (vx === 0) {
            horizontalBorder = currX.current + x + width/2
        }
        if (vy === 0) {
            verticalBorder = currY.current + y + currHeight.current/2;
        }
        if (vx > 0) {
            horizontalBorder = currX.current + x + width;
        }
        if (vx < 0) {
            horizontalBorder = currX.current + x;
        }
        if (vy > 0) {
            verticalBorder = currY.current + y + currHeight.current;
        }
        if (vy < 0) {
            verticalBorder = currY.current + y;
        }
        let i = diapason.findIndex(item => {
            let horBord = false;
            let verBord = false;
            if (vx === 0 && horizontalBorder > item.leftX && horizontalBorder < item.rightX) {
                horBord = true
            }
            if (vy === 0 && verticalBorder > item.topY && verticalBorder < item.botY) {
                verBord = true;
            }
            if (vx > 0 && horizontalBorder > item.leftX && horizontalBorder < item.horizontalCenter) {
                horBord = true;
            }
            if (vx < 0 && horizontalBorder < item.rightX && horizontalBorder > item.horizontalCenter) {
                horBord = true;
            }
            if (vy > 0 && verticalBorder > item.topY && verticalBorder < item.horizontalCenter) {
                verBord = true;
            }
            if (vy < 0 && verticalBorder < item.botY && verticalBorder > item.horizontalCenter) {
                verBord = true;
            }
            if (horBord && verBord) return true
        })
        return i < swappableTodoLists.length-1 && i > 0 ? i : null;
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
    const [isListDragged, dragList] = useState<boolean>(false);
    const [spring, setSpring] = useSpring(() => ({
        x: 0,
        y: 0,
        width: 0,
        zIndex: 1
    }));
    const gesture = useDrag(({args: [originalIndex], down, movement: [x, y],
                                vxvy: [vx, vy], delta:[dx, dy]}) => {
        if (!isListDragged) {
            draggedList.current = originalIndex;
            currX.current = gridItems[draggedList.current].x;
            currY.current = gridItems[draggedList.current].y;
            currHeight.current = gridItems[draggedList.current].height;
            setSpring({
                x: currX.current,
                y: currY.current,
                width: gridItems[draggedList.current].width,
                zIndex: 3,
                immediate: true,
                onRest: () => dragList(true)
            });
            return
        }
        setSpring({
            x: currX.current + x,
            y: currY.current + y,
            immediate: false
        });
        const newIndex = calculatePositions(x, y, vx, vy);
        console.log(currY.current + y + currHeight.current )
        /*if (new Index && newIndex !== draggedList.current) {
            let newList = swap(swappableTodoLists, draggedList.current, newIndex);
            console.log(newList)
            setNewList(newList);
            draggedList.current = newIndex
        }*/
        if (!down) {
            setSpring({
                x: gridItems[draggedList.current].x,
                y: gridItems[draggedList.current].y,
                width: gridItems[draggedList.current].width,
                zIndex: 1,
                onRest: () => dragList(false),
                immediate: false
            });
        }
    }, {filterTaps: true});

    const fragment = transitions((style, item, t, i) =>
        <TodoListContainer style={isListDragged && draggedList.current === i ? spring : style} {...gesture(i)}>
            {TodoLists[item.itemIndex]}
        </TodoListContainer>
    );

    return (
        <>
            <GlobalStyles/>
            <TodoListTitle title={'Add TodoList'}/>
            <AddNewItemForm onAddItemClick={addTodoList}/>
            <TodoListsContainer>
                <AllLists {...bind} style={{height: (Math.max(...heights.current) || 0)}}>
                    {fragment}
                </AllLists>
            </TodoListsContainer>
            <div style={{width: 20, height: 20, backgroundColor: 'black', position: "absolute", left: 200, top: 0}}
                 onClick={() => console.log()}/>
        </>
    );
}

export default App;

