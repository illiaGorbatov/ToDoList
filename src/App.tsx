import React, {useEffect, useMemo} from "react";
import TodoList from "./Components/TodoList";
import AddNewItemForm from "./Components/AddNewItemForm";
import TodoListTitle from "./Components/TodoListTitle";
import {addTodoListTC, loadTodoListsTC} from "./redux/reducer";
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from "./redux/store";
import styled, {createGlobalStyle} from "styled-components/macro";
import {useMedia} from "./hooks/useMedia";
import {useMeasure} from "./hooks/useMeasure";
import {animated, useTransition} from "react-spring";

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
        if (todoLists.length === 0 ) dispatch(loadTodoListsTC())
    }, [todoLists])

    const addTodoList = (title: string) => {
        dispatch(addTodoListTC(title))
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


    const {gridItems, heights}: UseMemoType = useMemo(() => {
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
    }, [todoLists]);

    const transitions = useTransition(gridItems, {
        from: ({x, y, width}: GridItemsType) =>
            ({transform: `translate3d(${x}px,${y}px,0)`, width, opacity: 0}),
        enter: ({x, y, width}: GridItemsType) =>
            ({transform: `translate3d(${x}px,${y}px,0)`, width, opacity: 1}),
        update: ({x, y, width}: GridItemsType) =>
            ({transform: `translate3d(${x}px,${y}px,0)`, width}),
        leave: {height: 0, opacity: 0},
        config: {mass: 5, tension: 500, friction: 100},
        trail: 25,
        keys: (gridItems: GridItemsType) => gridItems.id
    });
    const fragment = transitions((style, item, t, i) =>
        <TodoListContainer style={style}>
            {TodoLists[i]}
        </TodoListContainer>
    );

    //drag and drop

    return (
        <>
            <GlobalStyles/>
            <TodoListTitle title={'Add TodoList'}/>
            <AddNewItemForm onAddItemClick={addTodoList}/>
            <TodoListsContainer>
                <AllLists {...bind} style={{height: (Math.max(...heights) || 0)}}>
                    {fragment}
                </AllLists>
            </TodoListsContainer>
        </>
    );
}

export default App;

