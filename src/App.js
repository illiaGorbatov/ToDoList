import React from 'react';
import './App.css';
import TodoList from "./Components/TodoList";
import AddNewItemForm from "./Components/AddNewItemForm";
import TodoListTitle from "./Components/TodoListTitle";
import connect from "react-redux/lib/connect/connect";
import {addTodoListAC, setTodoListAC} from "./redux/reducer";
import axios from "axios";

class App extends React.Component {

    componentDidMount() {
        this.restoreState()
    };

    saveState = () => {
        let stateAsString = JSON.stringify(this.state);
        localStorage.setItem('app-state', stateAsString);
    };

    restoreState = () => {
        axios.get("https://social-network.samuraijs.com/api/1.1/todo-lists",
            {
                withCredentials: true,
                headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
            })
            .then(res => {
                let todoLists = res.data;
                this.props.setTodoLists(todoLists)
            });
    };

    _restoreState = () => {
        let state = {
            todoLists: [],
        };
        let stateAsString = localStorage.getItem('app-state');
        if (stateAsString != null) state = JSON.parse(stateAsString);
        this.setState(state);
        this.state.todoLists.forEach(todoList =>{
            if (todoList.id >= this.nextTodoListId) this.nextTodoListId = todoList.id+1;
        })
    };

    addTodoList = (title) => {
        axios.post("https://social-network.samuraijs.com/api/1.1/todo-lists",
            {title: title},
            {
                withCredentials: true,
                headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
            }
        )
            .then(res => {
                let todoList = res.data.data.item;
                this.props.addTodoList(todoList)
            })
    };

    nextTodoListId = 0;

    _addTodoList = (value) => {
        let newTodoList = {
            title: value,
            id: this.nextTodoListId,
            tasks: []
        };
        this.nextTodoListId++;
        this.props.setTodoLists(newTodoList)
    };

    state = {
        todoLists: [],
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
        setTodoLists : (todoLists) => {
            const action = setTodoListAC(todoLists);
            dispatch(action)

        }
    }
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default ConnectedApp;

