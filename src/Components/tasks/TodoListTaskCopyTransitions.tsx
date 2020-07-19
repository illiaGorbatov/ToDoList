import React, {RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import TodoListTask from "./TodoListTask";
import {TaskType} from "../../redux/entities";
import {animated, useSpring, useTransition} from "react-spring";
import {useDrag} from "react-use-gesture";
import styled from "styled-components/macro";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {actions} from "../../redux/functionalReducer";
import {movePos} from "../../hooks/movePos";
import isEqual from "react-fast-compare";
import {NeumorphColorsType} from "../neumorphColors";

const TasksWrapper = styled.div<{ $height: number }>`
  user-select: none;
  position: relative;
  height: ${props => props.$height}px;
  transition: height 0.3s cubic-bezier(0.25, 0, 0, 1) 0.2s;
`;

const TaskWrapper = styled(animated.div)`
  position: absolute;
  width: 100%;
  overflow: visible;
  pointer-events: auto;
  text-align: center;
  font-size: 14.5px;
`;

type TransitionItemType = {
    y: number,
    id: string,
    height: number,
    task: TaskType,
    bottomBorder: number,
    middleBorder: number
};

type PropsType = {
    todoListId: string;
    tasks: TaskType[],
    setHeight: (height: number) => void,
    palette: NeumorphColorsType
};

const TodoListTasks: React.FC<PropsType> = ({tasks, todoListId, setHeight, palette}) => {

    const editable = useSelector((state: AppStateType) => state.todoList.editable, shallowEqual);
    const dispatch = useDispatch();

    const [transitionItems, setTransitionItems] = useState<Array<TransitionItemType>>(tasks.map((task) => ({
        y: 0,
        id: task.id,
        height: 0,
        task: task,
        bottomBorder: 0,
        middleBorder: 0
    })));

    const [idOfDragged, setIdOfDragged] = useState<string>('');

    const initialYofDragged = useRef<number | null>(0);
    const initialIndexOfDragged = useRef<number>(0);
    const height = useRef<number>(0);
    const memoizedOrder = useRef<Array<TransitionItemType>>([]);
    const bounds = useRef<Array<number>>([]);
    const elementsRef = useRef<Array<RefObject<HTMLDivElement>>>([]);

    const [spring, setSpring] = useSpring(() => ({
        scale: 1,
        y: initialYofDragged.current || 0,
        zIndex: 5,
        immediate: (props) => props === 'y'
    }), []);

    const transitions = useTransition(transitionItems, {
        from: ({y}) => ({y, opacity: 0}),
        enter: ({y}) => ({y, opacity: 1}),
        update: ({y}) => ({y}),
        leave: {height: 0, opacity: 0},
        config: {mass: 5, tension: 500, friction: 100},
        trail: 25,
        key: item => item.id,
    });

    const [forceRerender, rerender] = useState<number>(0);
    useEffect(() => {
        elementsRef.current = tasks.map(() => React.createRef());
        if (tasks.length > transitionItems.length) {
            const newTransitionItems = [{
                y: 0,
                id: tasks[0].id,
                height: 0,
                task: tasks[0],
                bottomBorder: 0,
                middleBorder: 0
            }].concat(transitionItems);
            setTransitionItems(newTransitionItems);
            rerender(forceRerender + 1);
        }
        if (tasks.length < transitionItems.length) {
            const deletedTaskIndex = transitionItems.findIndex(item => tasks.findIndex(task => task.id === item.id) === -1);
            const deletedItem = transitionItems[deletedTaskIndex];
            const newTransitionItems = transitionItems.filter((_, index) => index !== deletedTaskIndex)
                .map((item, index) => {
                    if (index < deletedTaskIndex) return item;
                    else return {
                        ...item,
                        y: item.y - deletedItem.height,
                        bottomBorder: item.bottomBorder - deletedItem.height,
                        middleBorder: item.middleBorder - deletedItem.height
                    }
                })
            setTransitionItems(newTransitionItems);
            const heightsSum = newTransitionItems.reduce((sum, item) => sum + item.height, 0);
            height.current = heightsSum;
            setHeight(heightsSum);

        } else rerender(forceRerender + 1);
    }, [tasks]);

    useLayoutEffect(() => {
        console.log(elementsRef.current);
        const heights = elementsRef.current.map(ref => ref.current!.offsetHeight)
        const newTransitionItems = transitionItems.map((item, index) => {
            const calcY = heights.reduce((total, item, i) => {
                if (i !== 0 && i <= index) {
                    total += heights[i - 1]
                }
                return total
            }, 0);
            return {
                ...item,
                y: calcY,
                height: heights[index],
                bottomBorder: heights[index] + calcY,
                middleBorder: heights[index] / 2 + calcY
            }
        });
        setTransitionItems(newTransitionItems)
        const heightsSum = newTransitionItems.reduce((sum, item) => sum + item.height, 0);
        if (heightsSum || heightsSum === 0) {
            height.current = heightsSum;
            setHeight(heightsSum);
        }
    }, [forceRerender]);

    const getNewIndex = (transitionItem: TransitionItemType, y: number) => {
        if (y > 0) {
            const newIndex = transitionItems.findIndex(item => item.bottomBorder > transitionItem.middleBorder+y
                && item.y < transitionItem.middleBorder+y);
            return newIndex === -1 ? false : newIndex
        }
        if (y < 0) {
            const newIndex = transitionItems.findIndex(item => item.y < transitionItem.middleBorder+y
                && item.bottomBorder > transitionItem.middleBorder+y)
            return newIndex === -1 ? false : newIndex
        }
        return false
    }

    const gesture = useDrag(({args: [transitionItem], down, movement: [, y], event, first, active}) => {
        event!.stopPropagation();
        const curIndex = transitionItems.findIndex(item => item.id === transitionItem.id);
        if (initialYofDragged.current === null) {
            initialYofDragged.current = transitionItem.y;
            bounds.current = [-initialYofDragged.current!,
                transitionItems[transitionItems.length - 1].y - initialYofDragged.current!];
            memoizedOrder.current = transitionItems;
            setIdOfDragged(transitionItem.id);
            initialIndexOfDragged.current = curIndex;
            setSpring({y: transitionItem.y, scale: 1.2, immediate: (props) => props === 'y'});
            console.log('first')
        }
        if (active) {
            const curRow = getNewIndex(transitionItem, y);//текущий новый индекс
            if (curRow !== curIndex && curRow !== false) {
                console.log(curRow, curIndex);
                let newTransitionItems = movePos(transitionItems, curIndex, curRow);
                newTransitionItems = newTransitionItems.map((item, index) => {
                    const calcY = newTransitionItems.reduce((total, item, i) => {
                        if (i !== 0 && i <= index) {
                            total += newTransitionItems[i - 1].height
                        }
                        return total
                    }, 0);
                    return {
                        ...item,
                        y: calcY,
                        bottomBorder: item.height + calcY,
                        middleBorder: item.height / 2 + calcY
                    }
                });
                setTransitionItems(newTransitionItems);
                console.log(newTransitionItems, transitionItems)
            }
            const calcY = (y > bounds.current[1] ? bounds.current[1] + (y - bounds.current[1]) * 0.1 : y < bounds.current[0] ?
                bounds.current[0] + (y - bounds.current[0]) * 0.1 : y) + initialYofDragged.current!;
            setSpring({y: calcY, scale: 1.2, immediate: (props) => props === 'y'});
        }
        if (!down) {
            initialYofDragged.current = null;
            setSpring({
                y: transitionItems[curIndex].y,
                scale: 1,
                immediate: false,
                onRest: () => setIdOfDragged('')});
            if (!isEqual(transitionItems, memoizedOrder.current)) {
                const newOrder = transitionItems.map(item => item.id);
                dispatch(actions.swapTasks(todoListId, newOrder));
            }
        }
    }, {filterTaps: true});

    console.log(idOfDragged)

    return (
        <TasksWrapper $height={height.current}>
            {transitions((style, item, t, i) =>
                <TaskWrapper {...editable && {...gesture(item)}} style={idOfDragged === item.id ? spring : style}
                             ref={elementsRef.current[i]}>
                    <TodoListTask task={item.task} todoListId={todoListId} palette={palette}/>
                </TaskWrapper>)}
        </TasksWrapper>
    );
}

export default React.memo(TodoListTasks, isEqual);

