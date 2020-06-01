import React, {useEffect, useState} from "react";
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
                    y: calculateY(curIndex!) + (y || 0),
                    immediate: (n: string): boolean => n === 'zIndex',
                }
                : {
                    boxShadow: `rgba(0, 0, 0, 0.15) 0px 1px 2px 0px`,
                    scale: 1,
                    y: calculateY(order.indexOf(index)) || 0,
                    zIndex: '0',
                    immediate: false
                }
        );

    const calculateY = (index: number): number => {
        const y = initialY.length !== 0 ? initialY.reduce((total, item, i) => {
            if (i !== 0 && i <= index) {
                total += initialY[i - 1]
            }
            return total
        }, 0) : 0;
        console.log(y, index, initialY)
        return y
    }

    const [order, setOrder] = useState<Array<number>>([]);
    const [initialY, setY] = useState<Array<number>>([]);
    useEffect(() => {
        setOrder(props.tasks.map((_, index) => index));
        setY(props.tasks.map(task => task.height!));
        setSprings(settings(order))
    }, [props.tasks]);

    const tasksWrapperHeight = props.tasks.length !== 0 ? props.tasks.map(task => task.height || 0)
        .reduce((prevHeight, nextHeight) => prevHeight + nextHeight) : 0;

    const [springs, setSprings] = useSprings(props.tasks.length, settings(order));
    const gesture = useDrag(({args: [originalIndex], down, movement: [, y]}) => {
        const curIndex = order.indexOf(originalIndex);//индекс
        const positionY = calculateY(curIndex) || 0;//индекс в массиве order
        const curRow = clamp(Math.round((positionY + y) / positionY), 0, props.tasks.length - 1);
        const newOrder = swap(order, curIndex, curRow);
        setSprings(settings(newOrder, down, originalIndex, curIndex, y));
        if (!down) setOrder(newOrder)
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

