import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {actions} from "../../redux/reducer";
import {TaskType} from "../../redux/entities";
import {AppStateType} from "../../redux/store";
import styled from "styled-components/macro";
import TaskIcons from "./TaskIcons";
import {validate} from "../../hooks/validate";

const TaskWrapper = styled.div`
    display: flex;
    position: relative;
    overflow: hidden;
`;

const TaskText = styled.div`
    padding: 10px;
    outline: none;
`;

type PropsType = {
    task: TaskType;
    todoListId: string;
}

const TodoListTask: React.FC<PropsType> = ({task, todoListId}) => {

    const dispatch = useDispatch();
    const editable = useSelector((state: AppStateType) => state.todoList.editable);

    const ref = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>(0);
    useEffect(() => {
        if (ref.current) {
            let newHeight = ref.current.offsetHeight;
            if (height !== newHeight) {
                setHeight(newHeight)
                dispatch(actions.setTaskHeight(newHeight, task.id, todoListId))
            }
        }
    });

    useEffect(() => {
        if (task.editStatus) textRef.current!.focus()
    }, [task])

    const deleteTask = () => {
        dispatch(actions.deleteTask(todoListId, task.id))
    };

    const [title, setTitle] = useState<string>(task.title);
    useEffect(() => {
        textRef.current!.textContent = task.title;
    }, [task.title])

    const changeDoneStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newTask = {...task, status: e.currentTarget.checked ? 2 : 0};
        dispatch(actions.changeTask(newTask))
    };

    const onChangeHandler = (e: React.FormEvent<HTMLDivElement>) => {
        let title = e.currentTarget.textContent || '';
        setTitle(title)
    }

    const setNewName = () => {
        const isValid = validate(title, 'Task');
        if (isValid) {
            let newTask = {...task, title, editStatus: false};
            dispatch(actions.changeTask(newTask))
        } else {

        }
    };

    const onKeyPressHandler = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") setNewName()
    };

    const priority = task.priority === 0 ? 'Low' : 1 ? 'Middle' : 2 ?
        'High' : 3 ? 'Urgently' : 'Later';

    return (
        <TaskWrapper ref={ref}>
            <TaskIcons task={task} deleteTask={deleteTask}
                       changeDoneStatus={changeDoneStatus} editable={editable}/>
            <TaskText contentEditable={editable} onKeyPress={e => onKeyPressHandler(e)} ref={textRef}
                 onBlur={setNewName} onInput={e => onChangeHandler(e)}/>
        </TaskWrapper>
    );
}

export default React.memo(TodoListTask);

