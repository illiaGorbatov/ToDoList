import * as React from 'react';
import './App.css';
import TodoList from "./Components/TodoList";
import AddNewItemForm from "./Components/AddNewItemForm";
import TodoListTitle from "./Components/TodoListTitle";
import {addTodoListTC, loadTodoListsTC} from "./redux/reducer";
import {connect} from 'react-redux';
import {TodoListType} from "./redux/entities";
import {AppStateType} from "./redux/store";
import {useEffect} from "react";

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


    const TodoLists = props.todoLists.map(
        todoList => <TodoList id={todoList.id} key={todoList.id}
                              title={todoList.title} tasks={todoList.tasks}/>);

    return (
        <>
            <TodoListTitle title={'Add TodoList'}/>
            <AddNewItemForm onAddItemClick={addTodoList}/>
            <div className={'App'}>
                {TodoLists}
            </div>
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

