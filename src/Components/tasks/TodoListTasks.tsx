import React, {RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import TodoListTask from "./TodoListTask";
import {TaskType} from "../../redux/entities";
import {animated, useSprings, useSpring} from "react-spring";
import {useDrag} from "react-use-gesture";
import styled from "styled-components/macro";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {actions} from "../../redux/functionalReducer";
import {movePos} from "../../hooks/movePos";
import isEqual from "react-fast-compare";
import {NeumorphColorsType} from "../neumorphColors";
import {clamp} from "lodash-es";

const TasksWrapper = styled(animated.div)/*<{$height: number}>*/`
  user-select: none;
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
    tasks: TaskType[],
    setHeight: (height: number) => void,
    palette: NeumorphColorsType
};

const TodoListTasks: React.FC<PropsType> = ({tasks, todoListId, setHeight, palette}) => {

    const editable = useSelector((state: AppStateType) => state.todoList.editable, shallowEqual);
    const dispatch = useDispatch();

    const settings = (order: Array<number>, down?: boolean, originalIndex?: number, curIndex?: number, y?: number): any => (index: number) => {
            /*console.log('calculating')*/
            if (down && index === originalIndex && y !== undefined) {
                const calcY = y > bounds.current[1] ? bounds.current[1] + (y - bounds.current[1]) * 0.1 : y < bounds.current[0] ?
                    bounds.current[0] + (y - bounds.current[0]) * 0.1 : y;
                console.log(calcY)
                return {
                    scale: 1.2,
                    zIndex: 2,
                    y: initialYofDragged.current! + calcY,
                    opacity: 1,
                    immediate: (prop: string): boolean => prop === 'zIndex' || prop === 'y',
                }
            } else return {
                scale: 1,
                y: initialY.current[order.indexOf(index)] || 0,
                zIndex: 1,
                opacity: 1,
                immediate: false,
            }
        }
    ;

    const initialRender = (index: number) =>{
        if (!memoizedTasksId.current) return {
            scale: 1,
            y: 0,
            zIndex: 1,
            opacity: 1,
            immediate: false,
        }
        if (editable && tasks.length > memoizedTasksId.current.length) {
            const position = initialY.current[order.current.indexOf(index)];
            /*if (index === 0) return {
                to: async animate => {
                    await animate({y: position, opacity: 0, immediate: true});
                    await animate({opacity: 1, immediate: false})
                }
            }
            return {
                to: async animate => {
                    await animate({y: position - heights.current[0], immediate: true});
                    await animate({y: position, immediate: false})
                }
            }*/
        }
        if (editable && tasks.length < memoizedTasksId.current.length) {

        }
    };

    const order = useRef<Array<number>>([]);
    const initialYofDragged = useRef<number | null>(0);
    const memoizedOrder = useRef<Array<number>>([]);
    const memoizedTasksId = useRef<Array<string>>([]);
    const initialY = useRef<Array<number>>([]);
    const heights = useRef<Array<number>>([]);
    const bounds = useRef<Array<number>>([]);
    const elementsRef = useRef<Array<RefObject<HTMLDivElement>>>([]);

    /*const [springs, setSprings] = useSprings(tasks.length, settings(order.current), [tasks]);*/
    const [springs, setSprings] = useSprings(tasks.length, settings(order.current), [tasks]);

    /*const [height, setCurrentHeight] = useState<number>(0);*/
    const [height, setCurrentHeight] = useSpring(() => ({height: 0}))

    const [forceRerender, rerender] = useState<number>(0);
    useEffect(() => {
        elementsRef.current = tasks.map(() => React.createRef());
        rerender(forceRerender + 1);
    }, [tasks]);

    /*useLayoutEffect(() => {
        if (editable && tasks.length > memoizedTasksId.current.length) {
            setSprings(i =>
                i === 0 ? {opacity: 0, immediate: true} : {to: false}
            )
        }
    }, [tasks])*/
    console.log('tasks')
    useLayoutEffect(() => {
        if (!editable && tasks.length !== 0) {
            order.current = tasks.map((_, i) => i);
            heights.current = elementsRef.current.map(ref => ref.current!.offsetHeight);
            calcPositions();
            setSprings(settings(order.current));
        }
        if (editable && tasks.length > memoizedTasksId.current.length) {
            order.current = [0, ...order.current.map(item => item + 1)];
            heights.current = [elementsRef.current[0].current!.offsetHeight, ...heights.current];
            calcPositions();
            setSprings(i => {
                const position = initialY.current[order.current.indexOf(i)];
                console.log(initialY.current, order.current, position, position - heights.current[0])
                if (i === 0) return {
                    to: async animate => {
                        await animate({y: position, opacity: 0, immediate: true});
                        await animate({opacity: 1, immediate: false})
                    }
                }
                return {
                    to: async animate => {
                        await animate({y: position - heights.current[0], immediate: true});
                        await animate({y: position, immediate: false})
                    }
                }
            });
        }
        if (editable && tasks.length < memoizedTasksId.current.length) {
            const deletedTaskIndex = memoizedTasksId.current.findIndex(taskId => tasks.findIndex(item => item.id === taskId) === -1);
            const deletedOrder = order.current.indexOf(deletedTaskIndex);
            order.current = order.current.filter(index => index !== deletedTaskIndex)
                .map(item => item > deletedTaskIndex ? item - 1 : item);
            heights.current = heights.current.filter((_, index) => index !== deletedOrder);
            calcPositions();
            setSprings(i => {
                return {
                    scale: 1,
                    y: initialY.current[order.current.indexOf(i)],
                    zIndex: 1,
                    immediate: false,
                }
            });
        }
        const heightsSum = heights.current.reduce((sum, current) => sum + current, 0);
        setCurrentHeight({height: heightsSum});
        setHeight(heightsSum);
        memoizedTasksId.current = tasks.map(item => item.id);
    }, [forceRerender]);

    const calcPositions = () => {
        initialY.current = heights.current.map((height, index) => {
            return heights.current.reduce((total, item, i) => {
                if (i !== 0 && i <= index) {
                    total += heights.current[i - 1]
                }
                return total
            }, 0)
        });
    }

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
        const curIndex = order.current.indexOf(originalIndex);
        if (first) {
            initialYofDragged.current = initialY.current[curIndex];
            bounds.current = [-initialYofDragged.current, initialY.current[order.current.indexOf(tasks.length - 1)] - initialYofDragged.current];
            console.log(bounds.current)
        }
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
            initialYofDragged.current = null;
            if (!isEqual(order.current, memoizedOrder.current)) {
                const newOrder = order.current.map(item => tasks[item].id)
                dispatch(actions.swapTasks(todoListId, newOrder))
            }
        }
    }, {filterTaps: true});

    return (
        <TasksWrapper /*$height={height}*/ style={height}>
            {tasks.map((task, i) =>
                <TaskWrapper {...editable && {...gesture(i)}} key={task.id} style={springs[i]}
                             ref={elementsRef.current[i]}>
                    <TodoListTask task={task} todoListId={todoListId} palette={palette}/>
                </TaskWrapper>)}
        </TasksWrapper>
    );
}

export default React.memo(TodoListTasks, isEqual);

