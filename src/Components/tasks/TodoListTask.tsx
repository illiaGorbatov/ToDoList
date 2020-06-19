import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {actions} from "../../redux/reducer";
import {TaskType} from "../../redux/entities";
import {AppStateType} from "../../redux/store";
import styled from "styled-components/macro";
import TaskButtons, {TaskButtonWrapper} from "./TaskButtons";
import {validate} from "../../hooks/validate";
import {animated, useSpring} from "react-spring";
import TaskCheckbox from "./TaskCheckbox";

const TaskWrapper = styled(animated.div)<{ editable: string | undefined}>`
    position: relative;
    text-align: left;
    z-index: 5;
    ${props => props.editable &&
    `&:hover ${TaskButtonWrapper},  ${TaskButtonWrapper}:focus-within{
           width: 4rem;
           height: 4rem;
        }`
}
`;

const TaskBackground = styled(animated.div)`
    padding: 10px 0;
    background-clip: content-box;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    cursor: grab;
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
};

const TodoListTask: React.FC<PropsType> = React.memo(({task, todoListId}) => {
    const dispatch = useDispatch();
    const editable = useSelector((state: AppStateType) => state.todoList.editable);
    const focusedStatus = useSelector((state: AppStateType) => state.todoList.focusedStatus);

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
    const editModeAnimation = useSpring({
        scale: isTaskEditable || task.editStatus ? 1.3 : 1.0,
        backgroundColor: isTaskEditable || task.editStatus ? 'rgba(202, 106, 154, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        color: isTaskEditable || task.editStatus ? '#ffffff' : '#ca6a9a',
    });

    const priority = task.priority === 0 ? 'Low' : 1 ? 'Middle' : 2 ?
        'High' : 3 ? 'Urgently' : 'Later';

    return (
        <TaskWrapper editable={editable && !focusedStatus ? 'true' : undefined}>
            <TaskButtons editTask={editTask} deleteTask={deleteTask}/>
            <TaskBackground style={editModeAnimation}>
                <TaskCheckbox task={task} changeDoneStatus={changeDoneStatus} editable={editable}/>
                <TaskText contentEditable={isTaskEditable || task.editStatus}
                          onKeyPress={e => onKeyPressHandler(e)}
                          ref={textRef}
                          onBlur={setNewTask} onInput={e => onChangeHandler(e)}/>
            </TaskBackground>
        </TaskWrapper>

    );
})

export default TodoListTask;

