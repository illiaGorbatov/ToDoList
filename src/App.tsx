import React, {useEffect, useMemo, useRef} from "react";
import TodoList from "./Components/TodoList";
import AddNewItemForm from "./Components/AddNewItemForm";
import TodoListTitle from "./Components/TodoListTitle";
import {addTodoListTC, loadTodoListsTC} from "./redux/reducer";
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from "./redux/store";
import styled, {createGlobalStyle} from "styled-components/macro";
import {useMedia} from "./hooks/useMedia";
import {useMeasure} from "./hooks/useMeasure";
import {useTransition, animated, useSprings} from "react-spring";
import {useDrag} from "react-use-gesture";
import clamp from 'lodash-es/clamp'
import {swap} from "./hooks/swap";

const GlobalStyles = createGlobalStyle`
  * {
      box-sizing: border-box;
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

type GridItemsType = { x: number, y: number, width: number, height: number, id: string };
type UseMemoType = {
    gridItems: Array<GridItemsType>,
    heights: Array<number>};


const App = () => {

    const todoLists = useSelector((store: AppStateType) => store.todoList.todoLists);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadTodoListsTC())
    }, [])

    const addTodoList = (title: string) => {
        dispatch(addTodoListTC(title))
    };


    const TodoLists = todoLists.map(
        (todoList) => <TodoList id={todoList.id} key={todoList.id}
                                title={todoList.title} tasks={todoList.tasks}/>
    );

//adaptive grid with transitions
    const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [5, 4, 3], 2);
    const [bind, {width}] = useMeasure();


    const {gridItems, heights}: UseMemoType = useMemo(() => {
        let gridItems: Array<GridItemsType> = [];
        let heights = new Array(columns).fill(0);
        todoLists.map(
            (item) => {
                const height = 175 + (item.tasks ? item.tasks.length * 20 : 0);
                const column = heights.indexOf(Math.min(...heights));
                const x = (width / columns) * column;
                const y = (heights[column] += height) - height
                gridItems.push({x, y, width: width / columns, height: height, id: item.id});
            });
        return {gridItems, heights}
    }, [todoLists]);


    const transitions = useTransition(gridItems, item => item.id,{
        from: ({x, y, width, height}) =>
            ({transform: `translate3d(${x}px,${y}px,0)`, width, height, opacity: 0}),
        enter: ({x, y, width, height}) =>
            ({transform: `translate3d(${x}px,${y}px,0)`, width, height, opacity: 1}),
        update: ({x, y, width, height}) =>
            ({transform: `translate3d(${x}px,${y}px,0)`, width, height}),
        leave: {height: 0, opacity: 0},
        config: {mass: 5, tension: 500, friction: 100},
        trail: 25
    });


    console.log(heights)

    return (
        <>
            <GlobalStyles/>
            <TodoListTitle title={'Add TodoList'}/>
            <AddNewItemForm onAddItemClick={addTodoList}/>
            <TodoListsContainer>
                <AllLists {...bind} style={{height: Math.max(...heights)}}>
                    {transitions.map(({item, props, key}, id) => (
                        <TodoListContainer key={item.id}
                                      style={props}>
                            {TodoLists[id]}
                        </TodoListContainer>
                    ))}
                </AllLists>
            </TodoListsContainer>
        </>
    );
}

export default App;

