import React, {useCallback, useRef, useState} from "react";
import TodoListTasks from '../tasks/TodoListTasks';
import '../../App.css'
import TodoListTitle from "./TodoListTitle";
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {actions} from "../../redux/functionalReducer";
import {TaskType} from "../../redux/entities";
import styled from "styled-components/macro";
import {AppStateType} from "../../redux/store";
import {animated, useSpring} from "react-spring";
import {useHover} from "react-use-gesture";
import ContextButtons, {ButtonWrapper} from "./ContextButtons";
import isEqual from "react-fast-compare";
import {neumorphColors} from "../neumorphColors";

const SingleListWrapper = styled(animated.div)`
  position: relative;
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  backface-visibility: hidden;
  overflow: visible;
  padding: 25px;
  font-family: NunitoSans-Light;
  &:hover {
      z-index: 5;
  }
`;

const DetailsWrapper = styled(animated.div)`
  position: absolute;
  top: 50%;
  left: 100%;
  transform-origin: 50% 50%;
  transform: rotateZ(-90deg) translateY(-50%);
  transform-style: preserve-3d;
  font-size: 25px;
  white-space: nowrap;
`;

const SingleListBottomLayer = styled(animated.div)<{
    $palette: number, $editable: boolean, $closeLookState: boolean, $hovered: boolean
}>`
  border-radius: 30px;
  transform-style: preserve-3d;
  transform-origin: 50% 100%;
  padding: 25px;
  background: ${props => neumorphColors[props.$palette].backgroundOuter};
  position: relative;
  ${props => (props.$closeLookState || props.$hovered) &&
    `&:before {
      border-radius: 30px;
      content: "";
      position: absolute;
      top: 0;
      z-index: -1;
      bottom: 0;
      left: 0;
      right: 0;
      border: 5px solid transparent;
      box-shadow: ${neumorphColors[props.$palette].shadows};
  }`};
  ${props => props.$closeLookState === false && props.$hovered === false &&
    `&:after {
      border-radius: 30px;
      content: "";
      position: absolute;
      top: 0;
      z-index: -1;
      bottom: 0;
      left: 0;
      right: 0;
      border: 5px solid transparent;
      box-shadow: 22px 22px 49px rgba(0, 0, 0, .4);
  }`};
  ${props => props.$editable &&
    `&:after {
      border-radius: 30px;
      content: "";
      position: absolute;
      top: 0;
      z-index: -1;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: 22px 22px 49px rgba(0, 0, 0, .4);
      border: 5px solid transparent;
      transition: border .3s linear;
    }
    &:hover:after {
          border: 5px solid ${neumorphColors[props.$palette].hoveredAltBackground}
    }`
  };
  ${props => props.$editable &&
    `&:hover ${ButtonWrapper},  ${ButtonWrapper}:focus-within {
       width: 90px;
       height: 90px;
       opacity: 1;
       transition: opacity .6s cubic-bezier(0.25, 0, 0, 1);
    };`
  }
`;

type PropsType = {
    id: string,
    listTitle: string,
    listTasks?: TaskType[],
    colorPalette: number,
    setNewHeights: (height: number, id: string) => void,
    deleteList: (id: string) => void,
    /*newTasksId: { todoListId: string, tasks: Array<{ oldId: string, newId: string, todoListId: string }> } | undefined*/
};

const TodoList: React.FC<PropsType> = ({
                                           id, listTitle, listTasks, colorPalette,
                                           setNewHeights, deleteList, /*newTasksId*/
                                       }) => {

    const dispatch = useDispatch();
    const editable = useSelector((state: AppStateType) => state.todoList.editable, shallowEqual);
    const focusedStatus = useSelector((state: AppStateType) => state.todoList.focusedStatus);

    const currHeight = useRef<number>(0);
    const ref = useRef<HTMLDivElement>(null);
    const setHeight = useCallback(() => {
        if (ref.current) {
            const height = ref.current.offsetHeight;
            if (currHeight.current !== height) {
                setNewHeights(height, id);
            }
        }
    }, [])
    const [filterValue, setFilterValue] = useState<string>('All');

    const changeFilter = (newFilterValue: string) => {
        setFilterValue(newFilterValue)
    };


    const addTask = () => {
        const taskId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, (c, r) => ('x' == c ? (Math.random() * 16 | 0) : (r & 0x3 | 0x8)).toString(16));
        const newTask = {
            title: '',
            id: taskId,
            todoListId: id,
            editStatus: true
        }
        dispatch(actions.addTask(newTask, id));
        dispatch(actions.setFocusedStatus(true))
    };

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
    const [spring, setSpring] = useSpring(() => ({
        z: 0
    }));

    const bind = useHover(({hovering}) => {
        if (hovering) {
            dispatch(actions.setCurrentPaletteIndex(colorPalette));
            setHoveredState(true);
            setSpring({z: 100})
        }
        if (!hovering) {
            dispatch(actions.setCurrentPaletteIndex(null));
            setHoveredState(false);
            setSpring({z: 0});
        }
    });

    //close look animations
    const [closeLookState, setCloseLookState] = useState<boolean>(false);
    const [hoveredState, setHoveredState] = useState<boolean>(false);

    const [isTitleEditable, setTitleEditMode] = useState<boolean>(false);
    const switchTitleMode = () => {
        setTitleEditMode(!isTitleEditable)
    };

    /*console.log(`${listTitle} render`)*/
    return (
        <SingleListWrapper {...!closeLookState && {...bind()}} ref={ref} onClick={() => setCloseLookState(!closeLookState)}>
            <SingleListBottomLayer $palette={colorPalette} style={spring}
                                   $editable={editable && !focusedStatus}
                                   $closeLookState={closeLookState}
                                   $hovered={hoveredState}>
                <ContextButtons colors={neumorphColors[colorPalette]} deleteTodoList={deleteTodoList}
                                addTask={addTask} editList={switchTitleMode}/>
                <TodoListTitle listTitle={listTitle} id={id} isTitleEditable={isTitleEditable}
                               switchTitleMode={switchTitleMode} palette={neumorphColors[colorPalette]}/>
                <TodoListTasks todoListId={id} tasks={tasks} setHeight={setHeight} palette={neumorphColors[colorPalette]}
                               /*newTasksId={newTasksId}*//>
                {/* <TodoListFooter filterValue={filterValue} changeFilter={changeFilter}/>*/}
                {/*<DetailsWrapper>
                    more details...
                </DetailsWrapper>*/}
            </SingleListBottomLayer>
        </SingleListWrapper>
    );
}

export default React.memo(TodoList, isEqual);
