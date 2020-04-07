import * as React from 'react';
import './App.css';
import TodoList from "./Components/TodoList";
import AddNewItemForm from "./Components/AddNewItemForm";
import TodoListTitle from "./Components/TodoListTitle";
import {addTodoListTC, loadTodoListsTC} from "./redux/reducer";
import {connect} from 'react-redux';
import {TodoListType} from "./redux/entities";
import {AppStateType} from "./redux/store";

type PropsType = MapStateToPropsType & MapDispatchToPropsType;

class App extends React.Component<PropsType> {

    componentDidMount() {
        this.restoreState()
    };

    restoreState = () => {
        this.props.getTodoLists()
    };

    addTodoList = (title: string) => {
        this.props.addTodoList(title)
    };

    render() {

        const TodoLists = this.props.todoLists.map(
            todoList => <TodoList id={todoList.id} key={todoList.id}
                                  title={todoList.title} tasks={todoList.tasks}/>);

        return (
            <>
                <TodoListTitle title={'Add TodoList'}/>
                <AddNewItemForm onAddItemClick={this.addTodoList}/>
                <div className={'App'}>
                    {TodoLists}
                </div>
            </>
        );
    }
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

