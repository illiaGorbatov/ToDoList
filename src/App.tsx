import React from "react";
import TodoList from "./Components/TodoList";
import AddNewItemForm from "./Components/AddNewItemForm";
import TodoListTitle from "./Components/TodoListTitle";
import {addTodoListTC, loadTodoListsTC} from "./redux/reducer";
import {connect} from 'react-redux';
import {TodoListType} from "./redux/entities";
import {AppStateType} from "./redux/store";
import {useEffect} from "react";
import styled, { createGlobalStyle } from "styled-components/macro";
import {useMedia} from "./hooks/useMeasure";
import {useMeasure} from "./hooks/useMedia";

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
  overflow: auto;
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


type PropsType = MapStateToPropsType & MapDispatchToPropsType;

const App: React.FC<PropsType> = (props) => {

    useEffect(() => {
        restoreState()
    }, [])

    const restoreState = () => {
        props.getTodoLists()
    };

    const addTodoList = (title: string) => {
        props.addTodoList(title)
    };

    const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [5, 4, 3], 2)
    // Hook2: Measure the width of the container element
    const [bind, { width }] = useMeasure()


    const TodoLists = props.todoLists.map(
        todoList => <TodoList id={todoList.id} key={todoList.id}
                              title={todoList.title} tasks={todoList.tasks}/>);

    return (
        <>
            <GlobalStyles/>
            <TodoListTitle title={'Add TodoList'}/>
            <AddNewItemForm onAddItemClick={addTodoList}/>
            <TodoListsContainer>
                <AllLists>
                    {TodoLists}
                </AllLists>
            </TodoListsContainer>
        </>
    );
}

type MapStateToPropsType = {
    todoLists: TodoListType[];
};
type MapDispatchToPropsType = {
    addTodoList: (newTodoList: string) => void;
    getTodoLists: () => void;
};


const mapStateToProps = (state: AppStateType): MapStateToPropsType => {
    return {
        todoLists: state.todoList.todoLists
    }
};

const mapDispatchToProps = (dispatch: any): MapDispatchToPropsType => {
    return {
        addTodoList: (newTodoList) => {
            dispatch(addTodoListTC(newTodoList))
        },
        getTodoLists: () => {
            dispatch(loadTodoListsTC())
        }

    }
};

const ConnectedApp = connect<MapStateToPropsType, MapDispatchToPropsType, null, AppStateType>(mapStateToProps, mapDispatchToProps)(App);

export default ConnectedApp;

