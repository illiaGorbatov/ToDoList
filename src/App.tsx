import React from 'react';
import './App.css';
import TodoList from "./Components/TodoList";
import AddNewItemForm from "./Components/AddNewItemForm";
import TodoListTitle from "./Components/TodoListTitle";
import connect from "react-redux/lib/connect/connect";
import {addTodoListTC, loadTodoListsTC} from "./redux/reducer";

class App extends React.Component {

    componentDidMount() {
        this.restoreState()
    };

    restoreState = () => {
        this.props.getTodoLists()
    };

    addTodoList = (title) => {
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

const mapStateToProps = (state) => {
    return {
        todoLists: state.todoList.todoLists
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addTodoList: (newTodoList) => {
            dispatch(addTodoListTC(newTodoList))
        },
        getTodoLists: () => {
            dispatch(loadTodoListsTC())
        }

    }
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default ConnectedApp;

