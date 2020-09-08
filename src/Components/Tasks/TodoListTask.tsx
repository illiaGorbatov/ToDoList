import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {TaskType} from "../../redux/entities";
import {AppStateType} from "../../redux/store";
import styled from "styled-components/macro";
import TaskButtons, {TaskButtonWrapper} from "./TaskButtons";
import {validate} from "../../hooks/validate";
import TaskCheckbox from "./TaskCheckbox";
import {NeumorphColorsType} from "../neumorphColors";
import isEqual from "react-fast-compare";
import {interfaceActions} from "../../redux/interfaceReducer";
import {stateActions} from "../../redux/stateReducer";
import {useDrag} from "react-use-gesture";

const TaskWrapper = styled.div<{ $editable: boolean, $editorState: boolean}>`
    position: relative;
    text-align: left;
    z-index: ${props => props.$editorState ? 2 : 1};
    cursor: ${props => props.$editable ? "grab" : "inherit"};
    ${props => props.$editable &&
    `&:hover ${TaskButtonWrapper},  ${TaskButtonWrapper}:focus-within {
       width: 4rem;
       height: calc(100% + 10px);
       left: -10px;
       top: -5px
     }`}
`;

const TaskBackground = styled.div<{$palette: NeumorphColorsType, $editable: boolean, $editorState: boolean}>`
    padding: 15px 0;
    background: ${props => props.$palette.background};
    color: ${props => props.$palette.color};
    display: flex;
    position: relative;
    border-radius: 10px;
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
    };
    &:after {
      border-radius: 7px;
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      z-index: 1;
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      box-shadow: ${props => props.$palette.innerLittleShadows};
      opacity: 0;
      transition: opacity .3s linear;
    };
    ${props => props.$editable && `
        &:hover:after {opacity: 1};
        &:hover ${TaskButtonWrapper},  ${TaskButtonWrapper}:focus-within {
           width: 4rem;
           height: 5rem;
           left: -10px
        }
        &:active {
           cursor: grabbing;
           &:before {box-shadow: 10px 10px 20px rgba(0, 0, 0, .4)};
           &:after {opacity: 1}
        }`}
    ${props => props.$editorState && `
    &:after {opacity: 1}
    &:before {box-shadow: 10px 10px 20px rgba(0, 0, 0, .4)}`}
`;

const TaskText = styled.div<{ contentEditable: boolean}>`
  position: relative;
    padding: 10px;
    outline: none;
    display: inline-block;
    min-width: 100px;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
    width: 100%;
    font-size: 20px;
    z-index: 3;
    cursor: ${props => props.contentEditable ? 'text' : 'inherit'}
`;


type PropsType = {
    task: TaskType,
    todoListId: string,
    palette: NeumorphColorsType,
};

const TodoListTask: React.FC<PropsType> = ({task, todoListId, palette}) => {

    const editable = useSelector((state: AppStateType) => state.todoList.editable, shallowEqual);
    const focusedStatus = useSelector((state: AppStateType) => state.interface.focusedStatus, shallowEqual);

    const dispatch = useDispatch();

    const [editorState, setEditorState] = useState<boolean>(false);
    const editTask = useCallback(() => {
        setEditorState(true);
        dispatch(interfaceActions.setPalette(palette));
        dispatch(interfaceActions.setFocusedStatus(true))
    }, [palette, dispatch]);

    const textRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (editorState) textRef.current!.focus()
    }, [editorState]);

    const deleteTask = useCallback(() => {
        dispatch(stateActions.deleteTask(todoListId, task.id))
    }, [todoListId, task.id, dispatch]);

    useLayoutEffect(() => {
        textRef.current!.textContent = task.title;
        if (task.title === '') editTask()
    }, [task, editTask]);

    const changeDoneStatus = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let newTask = {...task, status: e.currentTarget.checked ? 2 : 0};
        dispatch(stateActions.changeTask(newTask))
    }, [task, dispatch]);

    const onBlurHandler = useCallback(() => {
        const taskTitle = textRef.current!.textContent;
        if (validate(taskTitle)) {
            let newTask = {...task, title: taskTitle!};
            dispatch(stateActions.changeTask(newTask));
            setEditorState(false);
            dispatch(interfaceActions.setFocusedStatus(false));
        } else if (!validate(taskTitle) && task.title !== '') {
            textRef.current!.textContent = task.title;
            setEditorState(false);
            dispatch(interfaceActions.setFocusedStatus(false));
        } else {
            dispatch(interfaceActions.setFocusedStatus(false));
            deleteTask()
        }
    }, [task, deleteTask, dispatch]);

    const onKeyDownHandler = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.keyCode === 13 || e.keyCode === 27) {
            e.preventDefault();
            textRef.current!.blur()
        }
    }, []);

    const captureClick = useDrag(({event}) => {
        event?.stopPropagation();
    });

    /*const priority = task.priority === 0 ? 'Low' : 1 ? 'Middle' : 2 ?
        'High' : 3 ? 'Urgently' : 'Later';*/

    return (
        <TaskWrapper $editable={editable && !focusedStatus} $editorState={editorState}>
            <TaskButtons editTask={editTask} deleteTask={deleteTask} palette={palette}/>
            <TaskBackground $editable={editable} $palette={palette} $editorState={editorState}>
                <TaskCheckbox task={task} changeDoneStatus={changeDoneStatus} editable={editable}/>
                <TaskText contentEditable={editorState} onKeyDown={e => onKeyDownHandler(e)}
                          ref={textRef} onBlur={onBlurHandler} {...editorState && {...captureClick()}}/>
            </TaskBackground>
        </TaskWrapper>

    );
}

export default React.memo(TodoListTask, isEqual);

