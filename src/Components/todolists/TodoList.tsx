import React, {useCallback, useEffect, useRef, useState} from "react";
import TodoListTasks from '../tasks/TodoListTasks';
import '../../App.css'
import TodoListTitle from "./TodoListTitle";
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {actions, restoreTasksTC} from "../../redux/reducer";
import {TaskType} from "../../redux/entities";
import styled from "styled-components/macro";
import {AppStateType} from "../../redux/store";
import {animated, useSpring} from "react-spring";
import {useHover} from "react-use-gesture";
import ContextButtons, {ButtonWrapper} from "./ContextButtons";
import isEqual from "react-fast-compare";

const neumorphColors = [
    {
        background: '#1a0b3b',
        backgroundOuter: 'linear-gradient(145deg, #170a35, #1c0c3f)',
        shadows: '27px 27px 54px #0a0418, -27px -27px 54px #2a125e',
        shadowsHovered: 'inset 27px 27px 54px #0a0418, inset -27px -27px 54px #2a125e',
        innerShadows: '11px 11px 23px #0a0418, -11px -11px 23px #2a125e',
        color: 'rgb(108, 98, 131)',
        hoveredAltBackground: '#ff9605',
        hoveredColor: 'rgb(30, 13, 55)',
        backgroundAltInner: 'linear-gradient(145deg, #ffa105, #e68705)',
        shadowsAlt: '22px 22px 49px #a86303, -22px -22px 49px #ffc907',
        shadowsHoveredAlt: 'inset 22px 22px 49px #a86303, inset -22px -22px 49px #ffc907',
    },
    {
        background: '#f6f7fa',
        backgroundOuter: 'linear-gradient(145deg, #dddee1, #ffffff)',
        shadows: '22px 22px 49px #a2a3a5, -22px -22px 49px #ffffff',
        shadowsHovered: 'inset 22px 22px 49px #a2a3a5, inset -22px -22px 49px #ffffff',
        innerShadows: '11px 11px 23px #a2a3a5, -11px -11px 23px #ffffff',
        color: '#ff9605',
        hoveredAltBackground: '#ff9605',
        hoveredColor: '#f6f7fa',
        backgroundAltInner: 'linear-gradient(145deg, #ffa105, #e68705)',
        shadowsAlt: '22px 22px 49px #a86303, -22px -22px 49px #ffc907',
        shadowsHoveredAlt: 'inset 22px 22px 49px #a86303, inset -22px -22px 49px #ffc907',
    },
    {
        background: '#ff9605',
        backgroundOuter: 'linear-gradient(145deg, #ffa105, #e68705)',
        shadows: '22px 22px 49px #a86303, -22px -22px 49px #ffc907',
        shadowsHovered: 'inset 22px 22px 49px #a86303, inset -22px -22px 49px #ffc907',
        innerShadows: '11px 11px 23px #a86303, -11px -11px 23px #ffc907',
        color: '#f6f7fa',
        hoveredAltBackground: '#f6f7fa',
        hoveredColor: '#ff9605',
        backgroundAltInner: 'linear-gradient(145deg, #dddee1, #ffffff)',
        shadowsAlt: '22px 22px 49px #a2a3a5, -22px -22px 49px #ffffff',
        shadowsHoveredAlt: 'inset 22px 22px 49px #a2a3a5, inset -22px -22px 49px #ffffff',
    }
];

export type NeumorphColorsType = {
    background: string,
    backgroundOuter: string,
    shadows: string,
    shadowsHovered: string,
    innerShadows: string
    color: string,
    hoveredAltBackground: string,
    hoveredColor: string,
    backgroundAltInner: string,
    shadowsAlt: string,
    shadowsHoveredAlt: string,
};

const SingleListWrapper = styled(animated.div)`
  position: relative;
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  backface-visibility: hidden;
  overflow: visible;
  padding: 25px;
  &:hover {
      z-index: 5;
  }
`;

const SingleListBottomLayer = styled(animated.div)<{ index: number, editable: string | undefined }>`
  border-radius: 30px;
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  padding: 25px;
  background: ${props => neumorphColors[props.index].backgroundOuter};
  position: relative;
  &:before {
      opacity: 0;
      border-radius: 30px;
      content: "";
      position: absolute;
      top: 0;
      z-index: -1;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: ${props => neumorphColors[props.index].shadows};
      transition: 0.3s cubic-bezier(0.25, 0, 0, 1);
  };
  &:hover::before {
      opacity: 1;
  };
  ${props => props.editable &&
    `&:hover ${ButtonWrapper},  ${ButtonWrapper}:focus-within
    {
       width: 90px;
       height: 90px;
       opacity: 1;
       transition: opacity .6s cubic-bezier(0.25, 0, 0, 1);
    };`
  }
`;

const DebDiv = styled.div`
    position: absolute;
    top: -100px
`;

type PropsType = {
    id: string,
    listTitle: string,
    listTasks?: TaskType[],
    index: number,
    setNewHeights: (height: number, id: string) => void,
    deleteList: (id: string) => void,
    newTasksId: {todoListId: string, tasks: Array<{oldId: string, newId: string, todoListId: string}>} | undefined
};

const TodoList: React.FC<PropsType> = ({
                                           id, listTitle, listTasks, index,
                                           setNewHeights, deleteList, newTasksId
                                       }) => {

    const dispatch = useDispatch();
    const editable = useSelector((state: AppStateType) => state.todoList.editable, shallowEqual);
    const focusedStatus = useSelector((state: AppStateType) => state.todoList.focusedStatus);

    const [colorScheme] = useState<NeumorphColorsType>(neumorphColors[index % neumorphColors.length]);

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
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0
    }));

    const bind = useHover(({hovering}) => {
        if (hovering) {
            setSpring({
                rotateX: -45,
                rotateY: 30,
                rotateZ: -30
            });
            dispatch(actions.setBackground(colorScheme.background))
        }
        if (!hovering) {
             setSpring({
                 rotateX: 0,
                 rotateY: 0,
                 rotateZ: 0
             });
            dispatch(actions.setBackground('#FFFFFF'))
        }
    });

    const [isTitleEditable, setTitleEditMode] = useState<boolean>(false);
    const switchTitleMode = () => {
        setTitleEditMode(!isTitleEditable)
    };

    console.log(`${listTitle} ${id} render`)
    return (
        <SingleListWrapper {...!editable && {...bind()}} ref={ref}>
            <SingleListBottomLayer index={index % neumorphColors.length} style={spring}
                                   editable={editable && !focusedStatus ? 'true' : undefined}>
                <ContextButtons colors={colorScheme} deleteTodoList={deleteTodoList}
                                addTask={addTask} editList={switchTitleMode}/>
                <TodoListTitle listTitle={listTitle} id={id} isTitleEditable={isTitleEditable}
                               switchTitleMode={switchTitleMode} colors={colorScheme}/>
                <TodoListTasks todoListId={id} tasks={tasks} setHeight={setHeight} colors={colorScheme}
                               newTasksId={newTasksId}/>
                {/* <TodoListFooter filterValue={filterValue} changeFilter={changeFilter}/>*/}
            </SingleListBottomLayer>
        </SingleListWrapper>
    );
}

export default React.memo(TodoList, isEqual);
