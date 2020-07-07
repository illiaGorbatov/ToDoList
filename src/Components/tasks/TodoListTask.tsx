import React, {useEffect, useRef, useState} from "react";
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

const TaskBackground = styled(animated.div)<{$palette: NeumorphColorsType, $editable: boolean}>`
    padding: 15px 0;
    background: ${props => props.$palette.background};
    color: ${props => props.$palette.color};
    display: flex;
    position: relative;
    border-radius: 10px;
    cursor: ${props => props.$editable ? "grab" : "inherit"};
    z-index: 2;
    &:before {
      border-radius: 10px;
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: -1;
      box-shadow: ${props => props.$palette.shadows};
      border: 3px solid transparent;
      transition: border .3s linear;
    };
    ${props => props.$editable &&
    `&:hover:before {
         border: 3px solid ${props.$palette.hoveredAltBackground}
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
        const isValid = validate(title);
        if (isValid) {
            let newTask = {...task, title, editStatus: false};
            dispatch(actions.changeTask(newTask));
        } else deleteTask()
    };

    const onKeyPressHandler = (e: React.KeyboardEvent) => {
        console.log(e)
        if (e.key ===  "Enter") {
            e.preventDefault();
            textRef.current!.blur()
        }
    };
    //animation
    const editModeAnimation = useSpring({
        scale: isTaskEditable || task.editStatus ? 1.3 : 1.0,
    });

    const priority = task.priority === 0 ? 'Low' : 1 ? 'Middle' : 2 ?
        'High' : 3 ? 'Urgently' : 'Later';

    console.log(task.title)

    return (
        <TaskWrapper $editable={editable && !focusedStatus}>
            <TaskButtons editTask={editTask} deleteTask={deleteTask}/>
            <TaskBackground style={editModeAnimation} $editable={editable}
                            $palette={palette}>
                <TaskCheckbox task={task} changeDoneStatus={changeDoneStatus} editable={editable} palette={palette}/>
                <TaskText contentEditable={isTaskEditable || task.editStatus}
                          onKeyPress={e => onKeyPressHandler(e)}
                          ref={textRef}
                          onBlur={setNewTask} onInput={e => onChangeHandler(e)}/>
            </TaskBackground>
        </TaskWrapper>

    );
})

export default TodoListTask;

