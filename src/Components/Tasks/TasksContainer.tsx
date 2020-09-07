import React, {RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import TodoListTask from "./TodoListTask";
import {TaskType} from "../../redux/entities";
import {animated, useSprings} from "react-spring";
import {useDrag, useHover} from "react-use-gesture";
import styled from "styled-components/macro";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {movePos} from "../../hooks/movePos";
import isEqual from "react-fast-compare";
import {NeumorphColorsType} from "../neumorphColors";
import {interfaceActions} from "../../redux/interfaceReducer";
import {stateActions} from "../../redux/stateReducer";
import {isMobile} from "react-device-detect";

export const TasksWrapper = styled.div<{ $height: number }>`
  user-select: none;
  position: relative;
  height: ${props => props.$height}px;
  transition: height 0.3s cubic-bezier(0.25, 0, 0, 1) 0.2s;
`;

const TaskWrapper = styled(animated.div)`
  position: absolute;
  width: 100%;
  overflow: visible;
  padding: 10px 0;
  pointer-events: auto;
  text-align: center;
  font-size: 14.5px;
`;

type PropsType = {
    todoListId: string;
    tasks: TaskType[],
    setHeight: (height: number) => void,
    palette: NeumorphColorsType,
    setHoveredStatus: (status: boolean) => void
};

const TasksContainer: React.FC<PropsType> = ({tasks, todoListId, setHeight, palette, setHoveredStatus}) => {

    const editable = useSelector((state: AppStateType) => state.todoList.editable, shallowEqual);
    const width = useSelector((store: AppStateType) => store.interface.width, shallowEqual);
    const scrollableState = useSelector((store: AppStateType) => store.interface.scrollableState, shallowEqual);
    const dispatch = useDispatch();

    const settings = useCallback((order: Array<number>, down?: boolean, originalIndex?: number, y?: number): any => (index: number) => {
            if (down && index === originalIndex && y !== undefined) {
                const calcY = y > bounds.current[1] ? bounds.current[1] + (y - bounds.current[1]) * 0.1 : y < bounds.current[0] ?
                    bounds.current[0] + (y - bounds.current[0]) * 0.1 : y;
                return {
                    scale: 1.2,
                    zIndex: 2,
                    y: initialYofDragged.current! + calcY,
                    opacity: 1,
                    immediate: (prop: string): boolean => prop === 'zIndex' || prop === 'y',
                }
            } else {
                return {
                    scale: 1,
                    y: initialY.current.length < tasks.length ? initialY.current[order.indexOf(tasks.length-index-2)] || 0
                        : initialY.current[order.indexOf(tasks.length-index-1)] || 0,
                    zIndex: 'inherit',
                    opacity: 1,
                    immediate: false,
                }
            }
        }, [tasks]);

    const order = useRef<Array<number>>([]);
    const initialYofDragged = useRef<number | null>(null);
    const memoizedOrder = useRef<Array<number>>([]);
    const memoizedTasksId = useRef<Array<string>>([]);
    const initialY = useRef<Array<number>>([]);
    const heights = useRef<Array<number>>([]);
    const bounds = useRef<Array<number>>([]);
    const elementsBorder = useRef<Array<{topBorder: number, center: number, bottomBorder: number}>>([]);
    const elementsRef = useRef<Array<RefObject<HTMLDivElement>>>([]);
    const [height, setCurrentHeight] = useState<number>(0)

    const [springs, setSprings] = useSprings(tasks.length, settings(order.current), [tasks]);

    const [forceRerender, rerender] = useState<number>(0);
    useEffect(() => {
        elementsRef.current = tasks.map(() => React.createRef());

        let i = 1
        rerender(i)
        i++;
    }, [tasks]);

    const calcPositions = useCallback((heightsArray: Array<number>) => {
        initialY.current = heightsArray.map((height, index) => {
            return heightsArray.reduce((total, item, i) => {
                if (i !== 0 && i <= index) {
                    total += heightsArray[i - 1]
                }
                return total
            }, 0)
        });
        elementsBorder.current = initialY.current.map((item, i) => ({
            topBorder: item,
            center: item + heightsArray[i]/2,
            bottomBorder: item + heightsArray[i]
        }));
    }, []);

    useLayoutEffect(() => {
        if (!editable && tasks.length !== 0) {
            order.current = tasks.map((_, i) => i);
            heights.current = elementsRef.current.map(ref => ref.current!.offsetHeight);
        }
        if (editable && tasks.length > memoizedTasksId.current.length) {
            order.current = [0, ...order.current.map(item => item + 1)];
            heights.current = [elementsRef.current[0].current!.offsetHeight, ...heights.current];
        }
        if (editable && tasks.length < memoizedTasksId.current.length) {
            const deletedTaskIndex = memoizedTasksId.current.findIndex(taskId => tasks.findIndex(item => item.id === taskId) === -1);
            const deletedOrder = order.current.indexOf(deletedTaskIndex);
            order.current = order.current.filter(index => index !== deletedTaskIndex)
                .map(item => item > deletedTaskIndex ? item - 1 : item);
            heights.current = heights.current.filter((_, index) => index !== deletedOrder);
        }
        if (tasks.length === memoizedTasksId.current.length) {
            heights.current = elementsRef.current.map(ref => ref.current!.offsetHeight);
        }
        calcPositions(heights.current);
        setSprings(settings(order.current));
        const heightsSum = heights.current.reduce((sum, current) => sum + current, 0);
        setCurrentHeight(heightsSum);
        setHeight(heightsSum);
        memoizedTasksId.current = tasks.map(item => item.id);
    }, [forceRerender, width, calcPositions, setHeight, setSprings, setCurrentHeight, editable, tasks, settings]);

    const getNewIndex = useCallback((index: number, y: number) => {
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
    }, [])

    const gesture = useDrag(({args: [originalIndex, trueIndex], down, movement: [, y], event}) => {
        if (isMobile && scrollableState) return;
        event?.stopPropagation();
        const curIndex = order.current.indexOf(trueIndex);
        if (initialYofDragged.current === null) {
            initialYofDragged.current = initialY.current[curIndex];
            bounds.current = [-initialYofDragged.current, initialY.current[tasks.length-1] - initialYofDragged.current];
            dispatch(interfaceActions.setFocusedStatus(true))
        }
        if (!initialYofDragged.current) initialYofDragged.current = initialY.current[curIndex];
        const curRow = getNewIndex(curIndex, y);//текущий новый индекс
        const newOrder = movePos(order.current, curIndex, curRow);// новый порядок
        const newHeights = movePos(heights.current, curIndex, curRow);//новый массив высот
        calcPositions(newHeights);
        setSprings(settings(newOrder, down, originalIndex, y));
        if (!down) {
            order.current = newOrder;
            heights.current = newHeights;
            initialYofDragged.current = null;
            if (!isEqual(order.current, memoizedOrder.current)) {
                const newOrder = order.current.map(item => tasks[item].id)
                dispatch(stateActions.swapTasks(todoListId, newOrder))
            }
            dispatch(interfaceActions.setFocusedStatus(false))
        }
    }, {filterTaps: true});

    const hovering = useHover(({hovering}) => {
        if (hovering) setHoveredStatus(true);
        if (!hovering) setHoveredStatus(false)
    });

    return (
        <TasksWrapper $height={height} {...editable && {...hovering()}}>
            {tasks.map((task, i) =>
                <TaskWrapper {...editable && {...gesture(tasks.length-i-1, i)}} key={task.id} style={springs[tasks.length-i-1]}
                             ref={elementsRef.current[i]}>
                    <TodoListTask task={task} todoListId={todoListId} palette={palette}/>
                </TaskWrapper>)}
        </TasksWrapper>
    );
}

export default React.memo(TasksContainer, isEqual);

