import React, {useState} from "react";
import '../App.css';
import {useDispatch} from 'react-redux';
import {deleteTaskTC} from "../redux/reducer";
import {TaskType} from "../redux/entities";

type PropsType = {
    task: TaskType;
    changeStatus: (task: TaskType, status: number) => void;
    key: string;
    changeTitle: (task: TaskType, title: string) => void;
    todoListId: string;
}

const TodoListTask: React.FC<PropsType> = (props) => {

    const dispatch = useDispatch();
    const onDeleteTask = () => {
        dispatch(deleteTaskTC(props.todoListId, props.task.id))
    };

    const [isEditModeActivated, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.task.title)

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    };

    const onIsDoneChanged = (e:  React.ChangeEvent<HTMLInputElement>) => {
        props.changeStatus(props.task, e.currentTarget.checked ? 2 : 0)
    };

    const enablingEditMode = () => {
        setEditMode(true);
    };

    const disablingEditMode = () => {
        setEditMode(false);
        props.changeTitle(props.task, title)
    };

    const onKeyPressHandler = (e:  React.KeyboardEvent) => {
        if (e.key === "Enter") disablingEditMode();
    };

    const priority = props.task.priority === 0 ? 'Low' : 1 ? 'Middle' : 2 ?
        'High' : 3 ? 'Urgently' : 'Later';

    return (
        <div className={props.task.status === 2 ? 'todoList-task done' : 'todoList-task'}>
            <input type="checkbox" checked={props.task.status === 2}
                   onChange={(e) => onIsDoneChanged(e)}/>
            <span>
                {isEditModeActivated ?
                    <input value={title} onBlur={disablingEditMode} autoFocus={true}
                           onKeyPress={onKeyPressHandler}
                           onChange={(e) => onChangeHandler(e)}/> :
                    <span onClick={enablingEditMode}>
                        {props.task.title}
                    </span>}
                , priority: {priority}</span>
            <span className={'close'} onClick={onDeleteTask}>
                X
            </span>
        </div>
    );
}

export default TodoListTask;

