import React, {useCallback, useRef, useState} from "react";
import TodoListTasks from '../Tasks/Tasks_WRAPPER';
import TodoListTitle from "./TodoListTitle";
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {actions} from "../../redux/functionalReducer";
import {TaskType} from "../../redux/entities";
import styled from "styled-components/macro";
import {AppStateType} from "../../redux/store";
import {useHover} from "react-use-gesture";
import ContextButtons, {ButtonWrapper} from "./ContextButtons";
import isEqual from "react-fast-compare";
import {defaultPalette, neumorphColors} from "../neumorphColors";

const SingleListWrapper = styled.div<{ $editable: boolean}>`
  position: relative;
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  backface-visibility: hidden;
  overflow: visible;
  padding: 35px;
  font-family: NunitoSans-Light;
  &:hover {
      z-index: 5;
  }
  ${props => !props.$editable &&
    `&:hover ${ListOuterLayer}{
        transform: translateZ(100px)
  }`}
`;

const DetailsWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 100%;
  transform-origin: 50% 50%;
  transform: rotateZ(-90deg) translateY(-50%);
  transform-style: preserve-3d;
  font-size: 25px;
  white-space: nowrap;
`;

const ListOuterLayer = styled.div<{
    $palette: number, $editable: boolean, $closeLookState: boolean,
    $isTasksHovered: boolean, $focusedStatus: boolean
}>`
  cursor: ${props => props.$editable ? 'grab' : 'inherit'};
  border-radius: 30px;
  padding: 35px;
  transform-style: preserve-3d;
  transform-origin: 50% 100%;
  background: ${props => neumorphColors[props.$palette].concaveBackground};
  position: relative;
  transform: translateZ(0);
  transition: transform .6s cubic-bezier(0.25, 0, 0, 1);
  &:before {
      border-radius: 30px;
      content: "";
      position: absolute;
      top: 0;
      z-index: -1;
      bottom: 0;
      left: 0;
      right: 0;
      transition: opacity .3s linear;
      box-shadow: ${props => neumorphColors[props.$palette].shadows};
      opacity: ${props => props.$closeLookState ? 1 : 0};
  };
  ${props => props.$editable && !props.$focusedStatus && !props.$isTasksHovered &&
    `&:hover ${ButtonWrapper},  ${ButtonWrapper}:hover {
           width: 120px;
           height: 120px;
           opacity: 1;
           transition: opacity .6s cubic-bezier(0.25, 0, 0, 1);
       }
       &:hover ${ListInnerLayer} {
           opacity: 1
       }`};
  &:after {
      border-radius: 30px;
      content: "";
      position: absolute;
      top: 0;
      z-index: -1;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: 14px 14px 35px rgba(0, 0, 0, .4);
      transition: opacity .3s linear;
      opacity: ${props => !props.$closeLookState ? 1 : 0};
  };
  ${props => props.$editable && `
    &:hover:after {opacity: 0};
    &:hover:before {opacity: 1};
    &:active {
        cursor: grabbing;
        &:after {opacity: 1};
        &:before {opacity: 0};
        ${ListInnerLayer} {opacity: 1}
    }`}
`;

const ListInnerLayer = styled.div<{ $palette: number}>`
  position: absolute;
  border-radius: 20px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  padding: 25px;
  box-shadow: ${props => neumorphColors[props.$palette].innerShadows};
  opacity: 0;
  transition: opacity .3s linear;
`;


type PropsType = {
    id: string,
    listTitle: string,
    listTasks?: TaskType[],
    paletteIndex: number,
    setNewHeights: (height: number, id: string) => void,
    deleteList: (id: string) => void,
    closeLook: boolean
};

const TodoList: React.FC<PropsType> = ({
                                           id, listTitle, listTasks, paletteIndex,
                                           setNewHeights, deleteList, closeLook
                                       }) => {

    const dispatch = useDispatch();
    const editable = useSelector((state: AppStateType) => state.todoList.editable, shallowEqual);
    const focusedStatus = useSelector((state: AppStateType) => state.todoList.focusedStatus, shallowEqual);

    const [isTasksHovered, setTasksHoveredStatus] = useState<boolean>(false);
    const setHoveredStatus = useCallback((status: boolean) => {
        setTasksHoveredStatus(status)
    }, []);

    const currHeight = useRef<number>(0);
    const ref = useRef<HTMLDivElement>(null);
    const setHeight = useCallback((height: number) => {
        if (currHeight.current === 0 && ref.current) {
            currHeight.current = ref.current.offsetHeight
        }
        if (currHeight.current !== height) {
            setNewHeights(height + currHeight.current, id);
        }
    }, []);


    const [filterValue, setFilterValue] = useState<string>('All');

    const changeFilter = (newFilterValue: string) => {
        setFilterValue(newFilterValue)
    };

    const addTask = useCallback(() => {
        const taskId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, (c, r) => ('x' == c ? (Math.random() * 16 | 0) : (r & 0x3 | 0x8)).toString(16));
        const newTask = {
            title: '',
            id: taskId,
            todoListId: id,
        }
        dispatch(actions.addTask(newTask, id));
    }, []);

    const deleteTodoList = useCallback(() => {
        deleteList(id)
        dispatch(actions.deleteTodoList(id))
    }, []);

    const tasks = listTasks ? listTasks.filter(t => {
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

    //hover Effect

    const bind = useHover(({hovering}) => {
        if (focusedStatus || closeLook) return
        if (hovering) {
            dispatch(actions.setPalette(neumorphColors[paletteIndex]));
        }
        if (!hovering) {
            dispatch(actions.setPalette(defaultPalette));
        }
    });

    //close look animations

    const [isTitleEditable, setTitleEditMode] = useState<boolean>(false);
    const switchTitleMode = useCallback((state: boolean) => {
        setTitleEditMode(state)
    }, []);

    /*console.log(`${listTitle} render`)*/
    return (
        <SingleListWrapper {...!closeLook && {...bind()}} ref={ref} $editable={editable}>
            <ListOuterLayer $palette={paletteIndex} $editable={editable} $isTasksHovered={isTasksHovered}
                                  $closeLookState={closeLook} $focusedStatus={focusedStatus}>
                <ListInnerLayer $palette={paletteIndex}/>
                    <ContextButtons colors={neumorphColors[paletteIndex]} deleteTodoList={deleteTodoList}
                                    addTask={addTask} editList={switchTitleMode}/>
                    <TodoListTitle listTitle={listTitle} id={id} isTitleEditable={isTitleEditable}
                                   deleteTodoList={deleteTodoList}
                                   switchTitleMode={switchTitleMode} palette={neumorphColors[paletteIndex]}/>
                    <TodoListTasks todoListId={id} tasks={tasks} setHeight={setHeight}
                                   palette={neumorphColors[paletteIndex]}
                                   setHoveredStatus={setHoveredStatus}/>
                    {/* <TodoListFooter filterValue={filterValue} changeFilter={changeFilter}/>*/}
                    {/*<DetailsWrapper>
                    more details...
                </DetailsWrapper>*/}
            </ListOuterLayer>
        </SingleListWrapper>
    );
}

export default React.memo(TodoList, isEqual);
