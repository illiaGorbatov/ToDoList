import React, {useEffect} from "react";
import TodoList from "./Components/TodoList";
import AddNewItemForm from "./Components/AddNewItemForm";
import TodoListTitle from "./Components/TodoListTitle";
import {addTodoListTC, loadTodoListsTC} from "./redux/reducer";
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from "./redux/store";
import styled, {createGlobalStyle} from "styled-components/macro";
import {useMedia} from "./hooks/useMedia";
import {useMeasure} from "./hooks/useMeasure";
import {useTransition, animated} from "react-spring";

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
  height: 100%;
`;


const App: React.FC = () => {

    const todoLists = useSelector((store: AppStateType) => store.todoList.todoLists);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadTodoListsTC())
    }, [])

    const addTodoList = (title: string) => {
        dispatch(addTodoListTC(title))
    };
//adaptive grid
    const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [5, 4, 3], 2);
    const [bind, {width}] = useMeasure();
    let heights = new Array(columns).fill(0);

    type GridItemsType = { xy: Array<number>, width: number, height: number }
    const gridItems: Array<GridItemsType> = [];
    todoLists.map(
        () => {
            const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
            const xy = [(width / columns) * column, (heights[column] += (Math.random() * 100 + 300) / 2) - (Math.random() * 100 + 300) / 2]; // X = container width / number of columns * column index, Y = it's just the height of the current column
            gridItems.push({xy, width: width / columns, height: (Math.random() * 100 + 300) / 2});
        });

    const TodoLists = todoLists.map(
        (todoList) => <TodoList id={todoList.id} key={todoList.id}
                                title={todoList.title} tasks={todoList.tasks}/>
    );
    console.log('render')
    const transitions = useTransition(gridItems, null,{
        from: ({xy, width, height}) =>
            ({transform: `translate3d(${xy[0]}px,${xy[1]}px,0)`, width, height, opacity: 0}),
        enter: ({xy, width, height}) =>
            ({transform: `translate3d(${xy[0]}px,${xy[1]}px,0)`, width, height, opacity: 1}),
        update: ({xy, width, height}) =>
            ({transform: `translate3d(${xy[0]}px,${xy[1]}px,0)`, width, height}),
        leave: {height: 0, opacity: 0},
        config: {mass: 5, tension: 500, friction: 100},
        trail: 25
    })

    return (
        <>
            <GlobalStyles/>
            <TodoListTitle title={'Add TodoList'}/>
            <AddNewItemForm onAddItemClick={addTodoList}/>
            <TodoListsContainer>
                <AllLists {...bind} style={{height: Math.max(...heights)}}>
                    {transitions.map(({item, props, key}, id) => (
                        <animated.div key={id}
                                      style={props}>
                            {TodoLists[id]}
                        </animated.div>
                    ))}
                </AllLists>
            </TodoListsContainer>
        </>
    );
}

export default App;

