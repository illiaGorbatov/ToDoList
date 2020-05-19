import React from "react";
import TodoListTasks from './TodoListTasks';
import TodoListFooter from './TodoListFooter';
import '../App.css'
import AddNewItemForm from "./AddNewItemForm";
import TodoListTitle from "./TodoListTitle";
import {connect} from 'react-redux';
import {
    addTaskTC,
    changeTaskTC,
    changeTodoListTitleTC,
    deleteTodoListTC,
    restoreTasksTC
} from "../redux/reducer";
import {TaskType} from "../redux/entities";
import {AppStateType} from "../redux/store";
import {useEffect, useState} from "react";
import styled from "styled-components/macro";

const TodoListContainer = styled.div` 
  position: absolute;
  will-change: transform, width, height, opacity;
  padding: 15px;
`;

const SingleList = styled.div`
  position: relative;
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-transform: uppercase;
  font-size: 10px;
  line-height: 10px;
  border-radius: 4px;
  box-shadow: 0px 10px 50px -10px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.span`
  height: 17px;
  width: 17px;
  border: 1px solid black;
  cursor: pointer;
  text-align: center;
`;

type OwnPropsType = {
    id: string;
    key: string;
    title: string;
    tasks?: TaskType[];
};
type PropsType = OwnPropsType & MapDispatchToPropsType;

const TodoList: React.FC<PropsType> = (props) => {

    const [isEditModeActivated, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.title);
    const [filterValue, setFilterValue] = useState<string>('All')

    useEffect(() => {
        restoreState()
    }, []);

    const restoreState = () => {
        props.restoreTasks(props.id)
    };

    const changeFilter = (newFilterValue: string) => {
        setFilterValue(newFilterValue)
    };

    const onAddTaskClick = (title: string) => {
        props.addTask(title, props.id)
    };

    const changeStatus = (task: TaskType, status: number) => {
        let newTask = {...task, status: status};
        props.changeTask(props.id, task.id, newTask)
    };

    const changeTitle = (task: TaskType, title: string) => {
        let newTask = {...task, title};
        props.changeTask(props.id, task.id, newTask)
    };

    const deleteTodoList = () => {
        props.deleteTodoList(props.id)
    };

    const changeTodoListTitle = () => {
        props.changeTodoListTitle(props.id, title)
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    };

    const enablingEditMode = () => {
        setEditMode(true)
    };

    const disablingEditMode = () => {
        setEditMode(false);
        changeTodoListTitle()
    };

    const onKeyPressHandler = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") disablingEditMode();
    };


    let {tasks = []} = props;

    return (
        <TodoListContainer>
            <SingleList>
                <div>
                    {isEditModeActivated ?
                        <input value={title} onBlur={disablingEditMode} autoFocus={true}
                               onKeyPress={onKeyPressHandler}
                               onChange={(e) => onChangeHandler(e)}/> :
                        <TodoListTitle title={props.title} onClickHandler={enablingEditMode}/>}
                    <AddNewItemForm onAddItemClick={onAddTaskClick} todoListName={props.title}/>
                    <CloseButton onClick={deleteTodoList}>
                        X
                    </CloseButton>
                </div>
                <TodoListTasks changeStatus={changeStatus}
                               changeTitle={changeTitle} todoListId={props.id}
                               tasks={tasks.filter(t => {
                                   if (filterValue === "All") {
                                       return true;
                                   }
                                   if (filterValue === "Active") {
                                       return t.status === 0;
                                   }
                                   if (filterValue === "Completed") {
                                       return t.status === 2;
                                   }
                               })}/>
                <TodoListFooter filterValue={filterValue} changeFilter={changeFilter}/>
            </SingleList>
        </TodoListContainer>
    );
}

type MapDispatchToPropsType = {
    addTask: (newTask: string, todoListId: string) => void;
    changeTask: (todoListId: string, taskId: string, newTask: TaskType) => void;
    deleteTodoList: (todoListId: string) => void;
    restoreTasks: (todoListId: string) => void;
    changeTodoListTitle: (todoListId: string, todoListTitle: string) => void;
};

const mapDispatchToProps = (dispatch: any): MapDispatchToPropsType => {
    return {
        addTask: (newTask, todoListId) => {
            dispatch(addTaskTC(newTask, todoListId))
        },
        changeTask: (todoListId, taskId, newTask) => {
            dispatch(changeTaskTC(todoListId, taskId, newTask))
        },
        deleteTodoList: (todoListId) => {
            dispatch(deleteTodoListTC(todoListId))
        },
        restoreTasks: (todoListId) => {
            dispatch(restoreTasksTC(todoListId))
        },
        changeTodoListTitle: (todoListId, todoListTitle) => {
            dispatch(changeTodoListTitleTC(todoListId, todoListTitle))
        }
    }
};

const ConnectedTodoList = connect<void, MapDispatchToPropsType, OwnPropsType, AppStateType>(null, mapDispatchToProps)(TodoList);

export default ConnectedTodoList;
