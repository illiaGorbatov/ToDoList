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
import {clamp} from "lodash-es";

const TasksWrapper = styled.div<{ $height: number }>`
  user-select: none;
  position: relative;
  height: ${props => props.$height}px;
  transition: height 0.3s cubic-bezier(0.25, 0, 0, 1);
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
    initialIndex: number,
    task: TaskType
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

    /*const settings = (down?: boolean, originalIndex?: number, y?: number): any => (index: number) => (
            down && index === originalIndex
                ? {
                    scale: 1.2,
                    zIndex: 2,
                    y: (initialY.current[index] || 0) + (y || 0),
                    opacity: 1,
                    immediate: (prop: string): boolean => prop === 'zIndex' || prop === 'y',
                }
                : {
                    scale: 1,
                    y: initialY.current[index] || 0,
                    zIndex: 1,
                    opacity: 1,
                    immediate: false,
                }
        );*/

    const [transitionItems, setTransitionItems] = useState<Array<TransitionItemType>>([tasks.map((task, i) => ({
        y: 0,
        id: task.id,
        height: 0,
        initialIndex: i,
        task: task
    }))]);

    const order = useRef<Array<number>>([]);
    const height = useRef<number>(0);
    const initialYofDragged = useRef<number | null>(0);
    const memoizedOrder = useRef<Array<number>>([]);
    const initialY = useRef<Array<number>>([]);
    const heights = useRef<Array<number>>([]);
    const bounds = useRef<Array<number>>([]);
    const elementsRef = useRef<Array<RefObject<HTMLDivElement>>>([]);

    const [spring, setSpring] = useSpring(() => ({
        scale: 1,
        y: 0
    }), [tasks]);

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
        console.log('useEffect')
        elementsRef.current = tasks.map(() => React.createRef());
        if (tasks.length > transitionItems.length) {
            const newTransitionItems = [{
                y: 0,
                id: tasks[0].id,
                height: 0,
                initialIndex: 0,
                task: tasks[0]
            }].concat(transitionItems);
            setTransitionItems(newTransitionItems)
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
                    initialIndex: item.initialIndex > deletedItem.initialIndex ? item.initialIndex-1 : item.initialIndex
                }
            })
            setTransitionItems(newTransitionItems)
            console.log(deletedTaskIndex)
        }
        rerender(forceRerender + 1);
        console.log(transitionItems)
    }, [tasks]);

    useLayoutEffect(() => {
        console.log('useLayoutEffect')
        heights.current = elementsRef.current.map(ref => ref.current!.offsetHeight);
        if (tasks.length === transitionItems.length) {
            const newTransitionsItems = transitionItems.map((item, index) => ({
                y: heights.current.reduce((total, item, i) => {
                    if (i !== 0 && i <= index) {
                        total += heights.current[i - 1]
                    }
                    return total
                }, 0),
                id: item.id,
                height: heights.current[index],
                initialIndex: item.initialIndex,
                task: item.task
            }));
            setTransitionItems(newTransitionsItems)
        }
        if (tasks.length > transitionItems.length) {
            //if (tasks.length === 0)
            const newTransitionsItems = transitionItems.map((item, index) => {
                if (index === 0) return {
                    ...item,
                    height: heights.current[0],
                    initialIndex: transitionItems.length - 1
                };
                else return {
                    ...item,
                    y: item.y + heights.current[0],
                }
            })
            setTransitionItems(newTransitionsItems)
        }
        const heightsSum = heights.current.reduce((sum, current) => sum + current, 0);
        height.current = heightsSum;
        setHeight(heightsSum);
        console.log(transitionItems)
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

    const gesture = useDrag(({args: [originalIndex], down, movement: [, y], event, first}) => {
        event!.stopPropagation();
        const curIndex = transitionItems.findIndex(item => item.initialIndex === originalIndex);
        if (first) {
            initialYofDragged.current = transitionItems[originalIndex].y;
            bounds.current = [-initialYofDragged.current, transitionItems[transitionItems.length - 1].y - initialYofDragged.current];
            console.log(bounds.current)
        }
        const curRow = clamp(getNewIndex(curIndex, y)!, 0, tasks.length - 1);//текущий новый индекс
        const newOrder = movePos(order.current, curIndex, curRow);// новый порядок
        const newHeights = movePos(heights.current, curIndex, curRow);//новый массив высот
        initialY.current = newHeights.map((_, index) => {//новый массив У координат
            return heights.current.reduce((total, item, i) => {
                if (i !== 0 && i <= index) {
                    total += newHeights[i - 1]
                }
                return total
            }, 0)
        })
        setSpring({y: y, scale: 1, immediate: false});
        if (!down) {
            order.current = newOrder;
            heights.current = newHeights;
            initialYofDragged.current = null;
            if (!isEqual(order.current, memoizedOrder.current)) {
                const newOrder = order.current.map(item => tasks[item].id)
                dispatch(actions.swapTasks(todoListId, newOrder))
            }
        }
    }, {filterTaps: true});

    return (
        <TasksWrapper $height={height.current}>
            {transitions((style, item, t, i) =>
                <TaskWrapper {...editable && {...gesture(i)}} style={style}
                             ref={elementsRef.current[i]}>
                    <TodoListTask task={item.task} todoListId={todoListId} palette={palette}/>
                </TaskWrapper>)}
        </TasksWrapper>
    );
}

export default React.memo(TodoListTasks, isEqual);

