import React, {RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import TodoListTask from "./TodoListTask";
import {TaskType} from "../../redux/entities";
import {animated, useSprings} from "react-spring";
import {useDrag} from "react-use-gesture";
import styled from "styled-components/macro";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {actions} from "../../redux/reducer";
import {movePos} from "../../hooks/movePos";

const TasksWrapper = styled.div`
  user-select: none;
  font-family: 'Raleway', sans-serif;
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
    newTask: TaskType | null
};

const TodoListTasks: React.FC<PropsType> = ({tasks, todoListId, newTask}) => {

    const editable = useSelector((state: AppStateType) => state.todoList.editable);
    const dispatch = useDispatch();

    const settings = (down?: boolean, originalIndex?: number, y?: number, swap?: () => void): any =>
        (index: number) => (
            down && index === originalIndex
                ? {
                    scale: 1.2,
                    zIndex: 2,
                    /*boxShadow: `rgba(0, 0, 0, 0.15) 0px 15px 30px 0px`,*/
                    y: (initialY.current[index] || 0) + (y || 0),
                    immediate: (n: string): boolean => n === 'zIndex' || n === 'y',
                }
                : {
                    scale: 1,
                    /*boxShadow: `rgba(0, 0, 0, 0.15) 0px 1px 2px 0px`,*/
                    y: initialY.current[index] || 0,
                    zIndex: 1,
                    immediate: false,
                    onRest: () => {
                        if (swap) swap()
                    }
                }
        );

    const order = useRef<Array<number>>([]);
    const initialY = useRef<Array<number>>([]);
    const heights = useRef<Array<number>>([]);
    const initialIndex = useRef<number>(0);
    const newIndex = useRef<number>(0);
    const newMemoizedY = useRef<number>(0);
    const elementsRef = useRef<Array<RefObject<HTMLDivElement>>>([]);

    const [editableTasks, setTasks] = useState<Array<TaskType>>([])

    useEffect(() => {
        if (tasks.length !== 0) {
            elementsRef.current = tasks.map(() => React.createRef());
            order.current = tasks.map((_, i) => i);
            setSprings(settings());
            initialY.current = tasks.map(() => 0);
            setTasks(tasks)
        }
    }, [tasks]);
    useEffect(() => {
        if (newTask) {
            elementsRef.current = [...elementsRef.current, React.createRef()];
            setTasks([...editableTasks, newTask]);
            order.current = [...order.current, order.current.length];
            initialY.current = [...initialY.current, 0];
        }
    }, [newTask]);


    useLayoutEffect(() => {
        if (elementsRef.current.length !== 0 && elementsRef.current[0].current !== null) {
            heights.current = elementsRef.current.map(ref => ref.current!.offsetHeight);
            initialY.current = tasks.map(() => 0);
            setSprings(settings());
        }
    }, [tasks, editable, newTask]);

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

    const [springs, setSprings] = useSprings(tasks.length, settings());
    const gesture = useDrag(({args: [originalIndex], down, movement: [, y], event, first}) => {
        event?.stopPropagation()
        if (first) {
            newIndex.current = order.current.indexOf(originalIndex);
            initialIndex.current = order.current.indexOf(originalIndex);
        }
        const curIndex = order.current.indexOf(originalIndex);
        const curRow = getNewIndex(initialIndex.current, y);
       /* const processedIndex = (() => {
            if (curRow > originalIndex) return order.current[curRow > newIndex.current ? curRow : newIndex.current];
            if (curRow < originalIndex) return order.current[curRow > newIndex.current ? newIndex.current : curRow];
            return order.current[newIndex.current]
        })();*/
        const processedIndex = order.current[curRow];
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
            console.log(curIndex, curRow, newIndex.current, processedIndex)
            newIndex.current = curRow
            order.current = movePos(order.current, curIndex, curRow);
        }
        if (!down) {
            const newOrder = movePos(order.current, curIndex, curRow);
            initialY.current[originalIndex] += newMemoizedY.current;
            newMemoizedY.current = 0;
            if (order.current !== newOrder) {
                heights.current = movePos(heights.current, curIndex, curRow);
                order.current = newOrder;
                const swap = () => {
                    dispatch(actions.swapTasks(todoListId, [editableTasks[originalIndex].id, editableTasks[processedIndex].id]));
                }
                setSprings(settings(down, originalIndex, y, swap))
            } else setSprings(settings(down, originalIndex, y))
        } else setSprings(settings(down, originalIndex, y))
    }, {eventOptions: {capture: true}, filterTaps: true} /*{
        filterTaps: true, bounds: { top: 0 , bottom: tasksWrapperHeight}, rubberband: true
    }*/);

    const tasksElements = useMemo(() => editableTasks.map(task =>
            <TodoListTask task={task} key={task.id}
                          todoListId={todoListId}/>)
        , [editableTasks]);

    const fragment = springs.map((styles, i) =>
        <TaskWrapper {...editable && {...gesture(i)}} key={i} style={styles}
                     ref={elementsRef.current[i]}>
            {tasksElements[i]}
        </TaskWrapper>
    );

    return (
        <TasksWrapper>
            {fragment}
        </TasksWrapper>
    );
}

export default React.memo(TodoListTasks);

