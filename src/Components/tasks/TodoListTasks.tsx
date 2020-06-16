import React, {RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import TodoListTask from "./TodoListTask";
import {TaskType} from "../../redux/entities";
import {animated, useSprings, useSpring} from "react-spring";
import {useDrag} from "react-use-gesture";
import {movePos} from "../../hooks/movePos";
import clamp from "lodash-es/clamp";
import styled from "styled-components/macro";
import {useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";

const TasksWrapper = styled(animated.div)`
  user-select: none;
  font-family: 'Raleway', sans-serif;
  position: relative;
`;

const TaskWrapper = styled(animated.div)`
  position: absolute;
  width: 100%;
  overflow: visible;
  pointer-events: auto;
  text-align: center;
  font-size: 14.5px;
`;

type PropsType = {
    todoListId: string;
    tasks: TaskType[]
};

const TodoListTasks: React.FC<PropsType> = ({tasks, todoListId}) => {

    const editable = useSelector((state: AppStateType) => state.todoList.editable);

    const settings = (order: Array<number>, down?: boolean, originalIndex?: number, curIndex?: number, y?: number): any =>
        (index: number) => (
            down && index === originalIndex
                ? {
                    zIndex: 2,
                    /*boxShadow: `rgba(0, 0, 0, 0.15) 0px 15px 30px 0px`,*/
                    y: (initialYofDragged.current || 0) + (y || 0),
                    immediate: (n: string): boolean => n === 'zIndex' || n === 'y',
                }
                : {
                    /*boxShadow: `rgba(0, 0, 0, 0.15) 0px 1px 2px 0px`,*/
                    y: initialY.current[order.indexOf(index)] || 0,
                    zIndex: 1,
                    immediate: false
                }
        );

    const order = useRef<Array<number>>([]);
    const initialY = useRef<Array<number>>([]);
    const heights = useRef<Array<number>>([]);
    const initialYofDragged = useRef<number | null>(null);

    const [tasksWrapperHeight, setHeight] = useState<number>(0);
    const elementsRef = useRef<Array<RefObject<HTMLDivElement>>>([]);
    useEffect(() => {
        if (tasks.length !== 0) {
            elementsRef.current = tasks.map(() => React.createRef());
            order.current = tasks.map((_, i) => i);
            setSprings(settings(order.current));
        }
    }, [tasks])

    /*useEffect(() => {
        order.current = tasks.map((_, index) => index);
        heights.current = tasks.map(task => task.height!);
        initialY.current = heights.current.map((height, index) => {
            return heights.current.reduce((total, item, i) => {
                if (i !== 0 && i <= index) {
                    total += heights.current[i - 1]
                }
                return total
            }, 0)
        });
        setSprings(settings(order.current))
    }, [tasks]);*/
    const [dragged, setDragged] = useState<boolean>(false);
    const undragedStyle = {position: 'relative'}

    useLayoutEffect(() => {
        if (elementsRef.current.length !== 0 && elementsRef.current[0].current !== null) {
            heights.current = elementsRef.current.map(ref => ref.current!.offsetHeight);
            initialY.current = heights.current.map((task, index) => {
                return heights.current.reduce((total, item, i) => {
                    if (i !== 0 && i <= index) {
                        total += heights.current[i - 1]
                    }
                    return total
                }, 0)
            });
            setSprings(settings(order.current));
            const newTasksWrapperHeight = heights.current.length !== 0 ? heights.current.reduce(
                (prevHeight, nextHeight) => prevHeight + nextHeight) : 0;
            if (newTasksWrapperHeight !== tasksWrapperHeight) setHeight(newTasksWrapperHeight)
        }
    }, [tasks, dragged]);

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

    const [springs, setSprings] = useSprings(tasks.length, settings(order.current));
    const gesture = useDrag(({args: [originalIndex], down, movement: [, y], event}) => {
        event!.stopPropagation();
        const curIndex = order.current.indexOf(originalIndex);//начальный индекс
        if (!initialYofDragged.current) initialYofDragged.current = initialY.current[curIndex];
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
        setSprings(settings(newOrder, down, originalIndex, curIndex, y));
        if (!down) {
            order.current = newOrder;
            heights.current = newHeights;
            initialYofDragged.current = null
        }
    }, {filterTaps: true} /*{
        filterTaps: true, bounds: { top: 0 , bottom: tasksWrapperHeight}, rubberband: true
    }*/);

    const tasksHeight = useSpring({
        height: tasksWrapperHeight
    })

    const tasksElements = useMemo(() => tasks.map(task =>
        <TodoListTask task={task} key={task.id}
                      todoListId={todoListId}/>)
    , [tasks]);

    const fragment = springs.map((styles, i) =>
        <TaskWrapper {...editable && {...gesture(i)}} key={i} style={editable ? styles : undragedStyle} ref={elementsRef.current[i]}>
                {tasksElements[i]}
        </TaskWrapper>
    );
    return (
        <TasksWrapper style={{height: tasksWrapperHeight}}>
            {fragment}
        </TasksWrapper>
    );
}

export default React.memo(TodoListTasks);

