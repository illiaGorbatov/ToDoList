import React, {useEffect, useRef, useState} from "react";
import TodoListTasks from './TodoListTasks';
import TodoListFooter from './TodoListFooter';
import '../App.css'
import AddNewItemForm from "./AddNewItemForm";
import TodoListTitle from "./TodoListTitle";
import {useDispatch} from 'react-redux';
import {
    actions,
    addTaskTC,
    changeTaskTC,
    changeTodoListTitleTC,
    deleteTodoListTC,
    restoreTasksTC
} from "../redux/reducer";
import {TaskType} from "../redux/entities";
import styled from "styled-components/macro";

const colors = [
    `linear-gradient(to top, #a8edea 0%, #fed6e3 100%)`,
    `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`,
    `linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)`,
    `linear-gradient(120deg, #f093fb 0%, #f5576c 100%)`,
    `linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)`,
    `linear-gradient(to top, #5ee7df 0%, #b490ca 100%)`,
    `linear-gradient(to top, #d299c2 0%, #fef9d7 100%)`,
    `linear-gradient(to top, #ebc0fd 0%, #d9ded8 100%)`,
    `linear-gradient(120deg, #f6d365 0%, #fda085 100%)`,
    `linear-gradient(to top, #96fbc4 0%, #f9f586 100%)`,
    `linear-gradient(-225deg, #FFFEFF 0%, #D7FFFE 100%)`,
    `linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)`,
    `linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)`,
    `linear-gradient(-20deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)`
];

const SingleList = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-transform: uppercase;
  font-size: 10px;
  border-radius: 4px;
  box-shadow: 0 10px 50px -10px rgba(0, 0, 0, 0.2);
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

    const [backgroundColor] = useState<string>(colors[Math.ceil(Math.random() * colors.length)]);

    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);
    useEffect(() => {
        if (ref.current) {
            let newHeight = ref.current.offsetHeight;
            if (height !== newHeight) {
                setHeight(newHeight)
                dispatch(actions.setListHeight(newHeight, props.id))
            }
        }
    })

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

    const tasks = props.tasks ? props.tasks.filter(t => {
        if (filterValue === "All") {
            return true;
        }
        if (filterValue === "Active") {
            return t.status === 0;
        }
        if (filterValue === "Completed") {
            return t.status === 2;
        }
    }) : [];

    return (
        <SingleList style={{backgroundImage: backgroundColor}} ref={ref}>
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
                           tasks={tasks}/>
            <TodoListFooter filterValue={filterValue} changeFilter={changeFilter}/>
        </SingleList>
    );
}

export default React.memo(TodoList);
