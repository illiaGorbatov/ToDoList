import React from 'react';
import './App.css';
import TodoList from "./Components/TodoList";
import AddNewItemForm from "./Components/AddNewItemForm";
import TodoListTitle from "./Components/TodoListTitle";
import connect from "react-redux/lib/connect/connect";
import {addTodoListAC, setTodoListAC} from "./redux/reducer";
import {api} from "./Components/api";

class App extends React.Component {

    componentDidMount() {
        this.restoreState()
    };

    saveState = () => {
        let stateAsString = JSON.stringify(this.state);
        localStorage.setItem('app-state', stateAsString);
    };

    restoreState = () => {
        api.restoreState().then(res => {
            let todoLists = res.data;
            this.props.setTodoLists(todoLists)
        });
    };

    addTodoList = (title) => {
        api.addTodoList(title).then(res => {
            let todoList = res.data.data.item;
            this.props.addTodoList(todoList)
        })
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
        todoLists: state.todoLists
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addTodoList: (newTodoList) => {
            const action = addTodoListAC(newTodoList);
            dispatch(action)
        },
        setTodoLists: (todoLists) => {
            const action = setTodoListAC(todoLists);
            dispatch(action)

        }
    }
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default ConnectedApp;

