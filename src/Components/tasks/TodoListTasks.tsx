import React, {RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import TodoListTask from "./TodoListTask";
import {TaskType} from "../../redux/entities";
import {animated, useSprings} from "react-spring";
import {useDrag} from "react-use-gesture";
import styled from "styled-components/macro";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {actions} from "../../redux/functionalReducer";
import {movePos} from "../../hooks/movePos";
import isEqual from "react-fast-compare";
import { NeumorphColorsType } from "../neumorphColors";

const TasksWrapper = styled.div`
  user-select: none;
  position: relative;
`;

const TaskWrapper = styled(animated.div)`
  position: relative;
  width: 100%;
  overflow: visible;
  pointer-events: auto;
  text-align: center;
  font-size: 14.5px;
`;

type PropsType = {
    todoListId: string;
    tasks: TaskType[],
    setHeight: () => void,
    palette: NeumorphColorsType
    /*newTasksId: {todoListId: string, tasks: Array<{oldId: string, newId: string, todoListId: string}>} | undefined*/
};

const TodoListTasks: React.FC<PropsType> = ({tasks, todoListId, setHeight, palette}) => {

    const editable = useSelector((state: AppStateType) => state.todoList.editable, shallowEqual);
    const dispatch = useDispatch();

    const settings = (down?: boolean, originalIndex?: number, y?: number): any =>
        (index: number) => (
            down && index === originalIndex
                ? {
                    scale: 1.2,
                    zIndex: 2,
                    y: (initialY.current[index] || 0) + (y || 0),
                    immediate: (prop: string): boolean => prop === 'zIndex' || prop === 'y',
                }
                : {
                    scale: 1,
                    y: initialY.current[index] || 0,
                    zIndex: 1,
                    immediate: false,
                }
        );

    const order = useRef<Array<number>>([]);
    const memoizedOrder = useRef<Array<number>>([]);
    const memoizedTasksId = useRef<Array<string>>([]);
    const initialY = useRef<Array<number>>([]);
    const heights = useRef<Array<number>>([]);
    const initialIndex = useRef<number>(0);
    const newIndex = useRef<number>(0);
    const processedMemoizedIndex = useRef<number>(0);
    const newMemoizedY = useRef<number>(0);
    const elementsRef = useRef<Array<RefObject<HTMLDivElement>>>([]);

    const [springs, setSprings] = useSprings(tasks.length, settings(), [tasks]);
    console.log(springs, tasks.length)

    const [forceRerender, rerender] = useState<number>(0);
    useEffect(() => {
        console.log(tasks.length, memoizedTasksId.current.length)
        elementsRef.current = tasks.map(() => React.createRef());
        if (!editable && tasks.length !== 0) {
            order.current = tasks.map((_, i) => i);
            initialY.current = tasks.map(() => 0);
        }
        if (editable && tasks.length > memoizedTasksId.current.length) {
            order.current = [0, ...order.current.map(item => item+1)];
            initialY.current = [0, ...initialY.current]
        }
        if (editable && tasks.length < memoizedTasksId.current.length) {
            const deletedTaskIndex = memoizedTasksId.current.findIndex(taskId => tasks.findIndex(item => item.id === taskId) === -1);
            order.current = order.current.filter(index => index !== deletedTaskIndex)
                .map(item => item > deletedTaskIndex ? item-1 : item);
            initialY.current = initialY.current.filter((_, index) => index !== deletedTaskIndex);
        }
        memoizedTasksId.current = tasks.map(item => item.id);
        rerender(forceRerender + 1);
        console.log(tasks.length, memoizedTasksId.current.length, order.current, initialY.current)
    }, [tasks]);

    useLayoutEffect(() => {
        if (tasks.length !== 0) {
            heights.current = elementsRef.current.map(ref => ref.current!.offsetHeight);
            setSprings(settings())
        }
        setHeight();
    }, [forceRerender]);

    const getNewIndex = (index: number, y: number) => {
        if (y > 0) {
            let newIndex = index;
            let height = 0;
            while (y > height + heights.current[index + 1] / 2) {
                newIndex += 1;
                height += heights.current[index + 1];
            }
            return newIndex > heights.current.length - 1 ? heights.current.length - 1 : newIndex;
        }
        if (y < 0) {
            let newIndex = index;
            let height = 0;
            while (Math.abs(y) > height + heights.current[index - 1] / 2) {
                newIndex -= 1;
                height += heights.current[index - 1];
            }
            return newIndex < 0 ? 0 : newIndex;
        }
        return index
    }

    const gesture = useDrag(({
                                 args: [originalIndex], down, movement: [, y],
                                 event, first, active
                             }) => {
        event?.stopPropagation()
        if (first) {
            newIndex.current = order.current.indexOf(originalIndex);
            initialIndex.current = order.current.indexOf(originalIndex);
            memoizedOrder.current = order.current
        }
        const curIndex = order.current.indexOf(originalIndex);
        const curRow = getNewIndex(initialIndex.current, y);
        const processedIndex = order.current[curRow];
        if (active) {
            const curIndex = order.current.indexOf(originalIndex);
            const curRow = getNewIndex(initialIndex.current, y);
            if (curRow !== newIndex.current) {
                initialY.current = initialY.current.map((item, index) => {
                    if (index === originalIndex) {
                        if (curIndex > curRow) newMemoizedY.current -= heights.current[processedIndex];
                        else newMemoizedY.current += heights.current[processedIndex];
                        return item
                    }
                    if (index === processedIndex) {
                        return curIndex > curRow ? item + heights.current[originalIndex]
                            : item - heights.current[originalIndex]
                    }
                    return item
                });
                processedMemoizedIndex.current = processedIndex;
                newIndex.current = curRow
                order.current = movePos(order.current, curIndex, curRow);
            }
            setSprings(settings(down, originalIndex, y))
        }
        if (!down) {
            initialY.current[originalIndex] += newMemoizedY.current;
            newMemoizedY.current = 0;
            if (!isEqual(order.current, memoizedOrder.current)) {
                console.log('swap')
                heights.current = movePos(heights.current, curIndex, curRow);
                (async () => {
                    await setSprings(settings(down, originalIndex, y));
                    const newOrder = order.current.map(item => tasks[item].id)
                    dispatch(actions.swapTasks(todoListId, newOrder))
                })();
            } else setSprings(settings(down, originalIndex, y))
        }
    }, {filterTaps: true});

    return (
        <TasksWrapper>
            {tasks.map((task, i) =>
                <TaskWrapper {...editable && {...gesture(i)}} key={task.id} style={springs[i]}
                             ref={elementsRef.current[i]}>
                    <TodoListTask task={task} todoListId={todoListId} palette={palette}/>
                </TaskWrapper>)}
        </TasksWrapper>
    );
}

export default React.memo(TodoListTasks, isEqual);

