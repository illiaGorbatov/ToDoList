import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {actions} from "../../redux/reducer";
import {TaskType} from "../../redux/entities";
import {AppStateType} from "../../redux/store";
import styled from "styled-components/macro";
import TaskIcons from "./TaskIcons";
import {validate} from "../../hooks/validate";
import { useSpring, animated } from "react-spring";
import {useMeasure} from "../../hooks/useMesure";
import {useHover} from "react-use-gesture";
import TaskCheckbox from "./TaskCheckbox";

const TaskWrapper = styled(animated.div)`
    position: relative;
    text-align: left;
`;

const TaskBackground = styled(animated.div)`
    padding: 10px 0;
    background-clip: content-box;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
`;

const TaskText = styled.div`
    padding: 10px;
    outline: none;
    display: inline-block;
    min-width: 100px;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
    width: 100%;
`;

type PropsType = {
    task: TaskType;
    todoListId: string;
}

const TodoListTask: React.FC<PropsType> = ({task, todoListId}) => {

    const dispatch = useDispatch();
    const {editable, focusedStatus} = useSelector((state: AppStateType) => state.todoList);

    const [hovered, setHoverStatus] = useState<boolean>(false);
    const hoverBind = useHover(({hovering}) => {
        if (!editable) return
        if (!focusedStatus) {
            setHoverStatus(hovering);
            return
        }

    })

    const [bind, {height}] = useMeasure();
    useEffect(() => {
            dispatch(actions.setTaskHeight(height, task.id, todoListId))
    }, [height]);

    const [isTaskEditable, setEditableState] = useState<boolean>(false);
    const editTask = () => {
        setEditableState(true);
        dispatch(actions.setFocusedStatus(true))
    };
    const textRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (task.editStatus || isTaskEditable) textRef.current!.focus()
    }, [task, isTaskEditable])

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
    };

    const setNewTask = () => {
        setEditableState(false);
        dispatch(actions.setFocusedStatus(false));
        const isValid = validate(title, 'Task');
        if (isValid) {
            let newTask = {...task, title, editStatus: false};
            dispatch(actions.changeTask(newTask))
        } else {

        }
    };

    const onKeyPressHandler = (e: React.KeyboardEvent) => {
        if (e.key === ("Esc" || "Enter")) {
            setNewTask()
        }
    };

    //animation
    const {hoverScale, ...editModeAnimation} = useSpring({
        scale: isTaskEditable ? 1.3 : 1.0,
        backgroundColor: isTaskEditable ? 'rgba(202, 106, 154, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        color : isTaskEditable ? '#ffffff' : '#ca6a9a',
        hoverScale: hovered ? 1.15 : 1.0
    });

    const priority = task.priority === 0 ? 'Low' : 1 ? 'Middle' : 2 ?
        'High' : 3 ? 'Urgently' : 'Later';

    return (
        <TaskWrapper {...bind} style={{scale: hoverScale}} {...hoverBind()}>
            <TaskIcons editTask={editTask} deleteTask={deleteTask} hovered={hovered}/>
            <TaskBackground style={editModeAnimation}>
                <TaskCheckbox task={task} changeDoneStatus={changeDoneStatus} editable={editable}/>
                <TaskText contentEditable={isTaskEditable} onKeyPress={e => onKeyPressHandler(e)} ref={textRef}
                          onBlur={setNewTask} onInput={e => onChangeHandler(e)}/>
            </TaskBackground>
        </TaskWrapper>
    );
}

export default React.memo(TodoListTask);

