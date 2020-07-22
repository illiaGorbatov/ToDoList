import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {actions} from "../../redux/functionalReducer";
import {TaskType} from "../../redux/entities";
import {AppStateType} from "../../redux/store";
import styled from "styled-components/macro";
import TaskButtons, {TaskButtonWrapper} from "./TaskButtons";
import {validate} from "../../hooks/validate";
import {animated, useSpring} from "react-spring";
import TaskCheckbox from "./TaskCheckbox";
import { NeumorphColorsType } from "../neumorphColors";

const TaskWrapper = styled(animated.div)<{ $editable: boolean}>`
    position: relative;
    padding: 10px 0;
    text-align: left;
    ${props => props.$editable &&
    `&:hover ${TaskButtonWrapper},  ${TaskButtonWrapper}:focus-within {
           width: 4rem;
           height: 4rem;
     }`
}
`;

const TaskBackground = styled.div<{$palette: NeumorphColorsType, $editable: boolean, $editorState: boolean}>`
    padding: 15px 0;
    background: ${props => props.$palette.background};
    color: ${props => props.$palette.color};
    display: flex;
    position: relative;
    border-radius: 10px;
    cursor: ${props => props.$editable ? "grab" : "inherit"};
    z-index: 2;
    transform: scale(${props => props.$editorState ? 1.3 : 1});
    transition: transform .5s cubic-bezier(0.25, 0, 0, 1);
    &:before {
      border-radius: 10px;
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: -1;
      box-shadow: ${props => props.$palette.littleShadows};
      border: 3px solid transparent;
      transition: border .3s linear;
    };
    ${props => props.$editable &&
    `&:hover:before {
         border: 3px solid ${props.$palette.background}
    }`
    }
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
    task: TaskType,
    todoListId: string,
    palette: NeumorphColorsType
};

const TodoListTask: React.FC<PropsType> = React.memo(({task, todoListId, palette}) => {
    const dispatch = useDispatch();
    const editable = useSelector((state: AppStateType) => state.todoList.editable, shallowEqual);
    const focusedStatus = useSelector((state: AppStateType) => state.todoList.focusedStatus, shallowEqual);

    const [editorState, setEditorState] = useState<boolean>(false);
    const editTask = () => {
        setEditorState(true);
        dispatch(actions.setFocusedStatus(true))
    };

    const textRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (editorState) textRef.current!.focus()
    }, [editorState]);

    const deleteTask = () => {
        dispatch(actions.deleteTask(todoListId, task.id))
    };

    useLayoutEffect(() => {
        textRef.current!.textContent = task.title;
        if (task.title === '') editTask()
    }, [task.title]);

    const changeDoneStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newTask = {...task, status: e.currentTarget.checked ? 2 : 0};
        dispatch(actions.changeTask(newTask))
    };

    const onBlurHandler = () => {
        const taskTitle = textRef.current!.textContent;
        if (validate(taskTitle)) {
            let newTask = {...task, title: taskTitle!, editStatus: false};
            dispatch(actions.changeTask(newTask));
            setEditorState(false);
            dispatch(actions.setFocusedStatus(false));
        } else if (!validate(taskTitle) && task.title !== '') {
            textRef.current!.textContent = task.title;
            setEditorState(false);
            dispatch(actions.setFocusedStatus(false));
        } else {
            dispatch(actions.setFocusedStatus(false));
            deleteTask()
        }
    };

    const onKeyPressHandler = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            textRef.current!.blur()
        }
    };

    const priority = task.priority === 0 ? 'Low' : 1 ? 'Middle' : 2 ?
        'High' : 3 ? 'Urgently' : 'Later';

    return (
        <TaskWrapper $editable={editable && !focusedStatus}>
            <TaskButtons editTask={editTask} deleteTask={deleteTask}/>
            <TaskBackground $editable={editable} $palette={palette} $editorState={editorState}>
                <TaskCheckbox task={task} changeDoneStatus={changeDoneStatus} editable={editable} palette={palette}/>
                <TaskText contentEditable={editorState} onKeyPress={e => onKeyPressHandler(e)}
                          ref={textRef} onBlur={onBlurHandler}/>
            </TaskBackground>
        </TaskWrapper>

    );
})

export default TodoListTask;

