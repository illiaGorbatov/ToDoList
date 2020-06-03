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

type GridItemsType = { x: number, y: number, width: number, height?: number, id: string };
type UseMemoType = {
    gridItems: Array<GridItemsType>,
    heights: Array<number>
};


const App = () => {

    const todoLists = useSelector((store: AppStateType) => store.todoList.todoLists);
    const dispatch = useDispatch();

    useEffect(() => {
        if (todoLists.length === 0) dispatch(loadTodoListsTC());
        if (todoLists.length !== 0) setGrid(newGrid)
    }, [todoLists]);

    const addTodoList = (title: string) => {
        dispatch(addTodoListTC(title));
    };


    const TodoLists = useMemo(() => {
        return todoLists.map(
            (todoList) => <TodoList id={todoList.id} key={todoList.id}
                                    listTitle={todoList.title} listTasks={todoList.tasks}/>
        )
    }, [todoLists]);

//adaptive grid with transitions
    const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [5, 4, 3], 2);
    const [bind, {width}] = useMeasure();

    const heights = useRef<Array<number>>([]);
    const [gridItems, setGrid] = useState<Array<GridItemsType>>([]);
    const newGrid = useMemo(() => {
        let newHeights = new Array(columns).fill(0);
        let grid =  todoLists.map(
            item => {
                const height = item.height || 0;
                const column = newHeights.indexOf(Math.min(...newHeights));
                const x = (width / columns) * column;
                const y = (newHeights[column] += height) - height;
                return ({x, y, width: width / columns, height: height, id: item.id})
            });
        heights.current = newHeights;
        return grid
    }, [todoLists]);

    /* const {gridItems, heights}: UseMemoType = useMemo(() => {
         let heights = new Array(columns).fill(0);
         let gridItems: Array<GridItemsType> = todoLists.map(
             (item) => {
                 const height = item.height || 0;
                 const column = heights.indexOf(Math.min(...heights));
                 const x = (width / columns) * column;
                 const y = (heights[column] += height) - height!;
                 return ({x, y, width: width / columns, height: height, id: item.id});
             });
         return {gridItems, heights}
     }, [todoLists]);*/

    const calculatePositions = (x: number, y: number) => {
        if (x > 0) {
            if (x > width) {

            }
        }
        if (x < 0) {
            if (Math.abs(x) > width) {

            }
        }
    }

    const transitions = useTransition(gridItems, {
        from: ({x, width}: GridItemsType) =>
            ({x, y: 0, width, opacity: 0}),
        enter: ({x, y, width}: GridItemsType) =>
            ({x, y, width, opacity: 1}),
        update: ({x, y, width}: GridItemsType) =>
            ({x, y, width}),
        leave: {height: 0, opacity: 0},
        config: {mass: 5, tension: 500, friction: 100},
        trail: 25,
        keys: (gridItems: GridItemsType) => gridItems.id,
    });

    const draggedList = useRef<number>(0);
    const [isListDragged, dragList] = useState<boolean>(false);
    const [spring, setSpring] = useSpring(() => ({
        x: 0,
        y: 0,
        width: 0,
        zIndex: 1
    }));
    const gesture = useDrag(({args: [originalIndex], down, movement: [x, y]}) => {
        if (!isListDragged) {
            draggedList.current = originalIndex;
            setSpring({
                x: gridItems[draggedList.current].x,
                y: gridItems[draggedList.current].y,
                width: gridItems[draggedList.current].width,
                zIndex: 3,
                immediate: true,
                onRest: () => dragList(true)
            });
            return
        }
        setSpring({
            x: gridItems[draggedList.current].x + x,
            y: gridItems[draggedList.current].y + y,
            immediate: false
        });

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
            {TodoLists[i]}
        </TodoListContainer>
    );
    console.log(heights)

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
                 onClick={() => console.log(heights)}/>
        </>
    );
}

export default App;

