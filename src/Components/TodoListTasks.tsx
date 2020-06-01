import React, {useEffect, useRef, useState} from "react";
import TodoListTask from "./TodoListTask";
import {TaskType} from "../redux/entities";
import {animated, useSprings} from "react-spring";
import {useDrag} from "react-use-gesture";
import {swap} from "../hooks/swap";
import clamp from "lodash-es/clamp";
import styled from "styled-components/macro";

const TasksWrapper = styled.div`
  user-select: none;
  font-family: 'Raleway', sans-serif;
  position: relative;
`;

const TaskWrapper = styled(animated.div)`
  position: absolute;
  width: 100%;
  overflow: visible;
  pointer-events: auto;
  transform-origin: 50% 50% 0;
  border-radius: 5px;
  color: white;
  text-align: center;
  font-size: 14.5px;
  background: lightblue;
  letter-spacing: 2px;
    &:nth-child(1) {
      background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    }
    &:nth-child(2) {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    &:nth-child(3) {
      background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
    }
    &:nth-child(4) {
      background: linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%);
    }
`;


type SpringType = {
    transform: string,
    zIndex: string,
    boxShadow: string,
    immediate: ((type: string) => void) | boolean
};

type PropsType = {
    changeStatus: (task: TaskType, status: number) => void;
    changeTitle: (task: TaskType, title: string) => void;
    todoListId: string;
    tasks: TaskType[]
};

const TodoListTasks: React.FC<PropsType> = (props) => {

    const settings = (order: Array<number>, down?: boolean, originalIndex?: number, curIndex?: number, y?: number): any =>
        (index: number) => (
            down && index === originalIndex
                ? {
                    zIndex: '1',
                    boxShadow: `rgba(0, 0, 0, 0.15) 0px 15px 30px 0px`,
                    scale: 1.1,
                    y: initialY.current[curIndex!] + (y || 0),
                    immediate: (n: string): boolean => n === 'zIndex' || n === 'y',
                }
                : {
                    boxShadow: `rgba(0, 0, 0, 0.15) 0px 1px 2px 0px`,
                    scale: 1,
                    y: initialY.current[order.indexOf(index)] || 0,
                    zIndex: '0',
                    immediate: false
                }
        );

    /*const [order, setOrder] = useState<Array<number>>([]);
    const [initialY, setY] = useState<Array<number>>([]);
    useEffect(() => {
        setOrder(props.tasks.map((_, index) => index));
        const heights = props.tasks.map(task => task.height!);
        const posY = heights.map((height, index) => {
            return heights.reduce((total, item, i) => {
                if (i !== 0 && i <= index) {
                    total += heights[i - 1]
                }
                return total
            }, 0)
        });
        setY(posY);
        console.log(heights, posY)
        setSprings(settings(order))
    }, [props.tasks]);*/

    const order = useRef<Array<number>>([]);
    const initialY = useRef<Array<number>>([]);
    const heights = useRef<Array<number>>([]);
    const curIndex = useRef<number>(0)
    useEffect(() => {
        order.current = props.tasks.map((_, index) => index);
        heights.current = props.tasks.map(task => task.height!);
        initialY.current = heights.current.map((height, index) => {
            return heights.current.reduce((total, item, i) => {
                if (i !== 0 && i <= index) {
                    total += heights.current[i - 1]
                }
                return total
            }, 0)
        });
        setSprings(settings(order.current))
    }, [props.tasks]);

    const tasksWrapperHeight = props.tasks.length !== 0 ? props.tasks.map(task => task.height || 0)
        .reduce((prevHeight, nextHeight) => prevHeight + nextHeight) : 0;

    const getNewIndex = (index: number, y: number) => {//тут фейл
        if (y > 0 && y > heights.current[index+1] / 2) {
            return index+1;
        }
        if (y < 0 && Math.abs(y) > heights.current[index-1] / 2) {
            return index-1;
        }
        return index
    }

    const [springs, setSprings] = useSprings(props.tasks.length, settings(order.current));
    const gesture = useDrag(({args: [originalIndex], down, movement: [, y]}) => {
        const curIndex = order.current.indexOf(originalIndex);//начальный индекс
        const curRow = clamp(getNewIndex(curIndex, y)!, 0, props.tasks.length - 1);//текущий новый индекс
        order.current = swap(order.current, curIndex, curRow);// новый порядок
        heights.current = swap(heights.current, curIndex, curRow);//новый массив высот
        initialY.current = heights.current.map((height, index) => {//новый массив У координат
            return heights.current.reduce((total, item, i) => {
                if (i !== 0 && i <= index) {
                    total += heights.current[i - 1]
                }
                return total
            }, 0)
        });
        setSprings(settings(order.current, down, originalIndex, curIndex, y));
        console.log(curRow, heights.current, initialY.current)
        /*if (!down) {
            order.current = newOrder;
            initialY.current = newInitialY;
            heights.current = newHeights
        }*/
    }, /*{
        filterTaps: true, bounds: { top: 0 , bottom: tasksWrapperHeight}, rubberband: true
    }*/);

    const tasksElements = props.tasks.map(task =>
        <TodoListTask task={task} changeStatus={props.changeStatus} key={task.id}
                      changeTitle={props.changeTitle} todoListId={props.todoListId}/>
    );
    const fragment = springs.map(({...styles}, i) =>
        <TaskWrapper {...gesture(i)} key={i} style={{
            ...styles
        }}>
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

