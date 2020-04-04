import React, {useEffect, useState} from "react";
import TodoListTasks from './TodoListTasks';
import TodoListFooter from './TodoListFooter';
import '../App.css'
import AddNewItemForm from "./AddNewItemForm";
import TodoListTitle from "./TodoListTitle";
import {useDispatch} from 'react-redux';
import {addTaskTC, changeTaskTC, changeTodoListTitleTC, deleteTodoListTC, restoreTasksTC} from "../redux/reducer";
import {TaskType} from "../redux/entities";
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

type PropsType = {
    id: string;
    key: string;
    title: string;
    tasks?: TaskType[];
};

const TodoList: React.FC<PropsType> = (props) => {

    const dispatch = useDispatch();

    const [isEditModeActivated, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.title);
    const [filterValue, setFilterValue] = useState<string>('All');

    //work with forms
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

    useEffect(() => {
        dispatch(restoreTasksTC(props.id))
    }, []);

    const changeFilter = (newFilterValue: string) => {
        setFilterValue(newFilterValue)
    };

    const onAddTaskClick = (title: string) => {
        dispatch(addTaskTC(title, props.id))
    };

    const changeStatus = (task: TaskType, status: number) => {
        let newTask = {...task, status: status};
        dispatch(changeTaskTC(props.id, task.id, newTask))
    };

    const changeTitle = (task: TaskType, title: string) => {
        let newTask = {...task, title};
        dispatch(changeTaskTC(props.id, task.id, newTask))
    };

    const deleteTodoList = () => {
        dispatch(deleteTodoListTC(props.id))
    };

    const changeTodoListTitle = () => {
        dispatch(changeTodoListTitleTC(props.id, title))
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

export default TodoList;
