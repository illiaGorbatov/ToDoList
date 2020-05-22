import React, {useRef} from "react";
import '../App.css';
import TodoListTask from "./TodoListTask";
import {TaskType} from "../redux/entities";
import {useSprings, animated} from "react-spring";
import {useDrag} from "react-use-gesture";
import {swap} from "../hooks/swap";
import clamp from "lodash-es/clamp";
import styled from "styled-components/macro";

const TasksWrapper = styled.div`
  user-select: none;
  font-family: 'Raleway', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
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


type PropsType = {
    changeStatus: (task: TaskType, status: number) => void;
    changeTitle: (task: TaskType, title: string) => void;
    todoListId: string;
    tasks: TaskType[]
};

const TodoListTasks: React.FC<PropsType> = (props) => {

    type SpringType = {
        transform: string,
        zIndex: string,
        boxShadow: string,
        immediate: boolean
    };
    type CurrentSpringsType = Array<SpringType>

    const fn = (order: Array<number>, down?: boolean, originalIndex?: number, curIndex?: number, y?: number): any => (index: number): SpringType => (
        down && index === originalIndex
            ? {
                zIndex: '1',
                boxShadow: `rgba(0, 0, 0, 0.15) 0px ${15}px ${2 * 15}px 0px`,
                transform: `translate3d(0,${(curIndex || 0) * 100 + (y || 0)}px,0) scale(${1.1})`,
                immediate: false
            }
            : {
                boxShadow: `rgba(0, 0, 0, 0.15) 0px ${1}px ${2}px 0px`,
                transform: `translate3d(0,${order.indexOf(index) * 100}px,0) scale(${1})`,
                zIndex: '0',
                immediate: false
            }
    )

    const order = useRef(props.tasks.map((_, index) => index))
    const [springs, setSprings] = useSprings(props.tasks.length, fn(order.current))
    const gesture = useDrag(({args: [originalIndex], down, movement: [, y]}) => {
        const curIndex = order.current.indexOf(originalIndex)
        const curRow = clamp(Math.round((curIndex * 100 + y) / 100), 0, props.tasks.length - 1)
        const newOrder = swap(order.current, curIndex, curRow)
        // @ts-ignore
        setSprings(fn(newOrder, down, originalIndex, curIndex, y))
        if (!down) order.current = newOrder
    });

    const tasksElements = props.tasks.map(task =>
        <TodoListTask task={task} changeStatus={props.changeStatus} key={task.id}
                      changeTitle={props.changeTitle} todoListId={props.todoListId}/>
    );

    return (
        <TasksWrapper>
            {springs.map((props, i) =>
                <TaskWrapper {...gesture(i)} key={i} style={props}>
                    {tasksElements[i]}
                </TaskWrapper>
            )}
        </TasksWrapper>
    );
}

export default TodoListTasks;

