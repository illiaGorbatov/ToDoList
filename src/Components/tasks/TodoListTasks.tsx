import React, {useEffect, useRef} from "react";
import TodoListTask from "./TodoListTask";
import {TaskType} from "../../redux/entities";
import {animated, useSprings} from "react-spring";
import {useDrag} from "react-use-gesture";
import {movePos} from "../../hooks/movePos";
import clamp from "lodash-es/clamp";
import styled from "styled-components/macro";
import {useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";

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

type PropsType = {
    todoListId: string;
    tasks: TaskType[]
};

const TodoListTasks: React.FC<PropsType> = (props) => {

    const editable = useSelector((state: AppStateType) => state.todoList.editable);

    const settings = (order: Array<number>, down?: boolean, originalIndex?: number, curIndex?: number, y?: number): any =>
        (index: number) => (
            down && index === originalIndex
                ? {
                    zIndex: 1,
                    boxShadow: `rgba(0, 0, 0, 0.15) 0px 15px 30px 0px`,
                    scale: 1.1,
                    y: (initialYofDragged.current || 0) + (y || 0),
                    immediate: (n: string): boolean => n === 'zIndex' || n === 'y',
                }
                : {
                    boxShadow: `rgba(0, 0, 0, 0.15) 0px 1px 2px 0px`,
                    scale: 1,
                    y: initialY.current[order.indexOf(index)]|| 0,
                    zIndex: 'none',
                    immediate: false
                }
        );

    const order = useRef<Array<number>>([]);
    const initialY = useRef<Array<number>>([]);
    const heights = useRef<Array<number>>([]);
    const initialYofDragged = useRef<number | null>(null);

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

    const [springs, setSprings] = useSprings(props.tasks.length, settings(order.current));
    const gesture = useDrag(({args: [originalIndex], down, movement: [, y]}) => {
        if (!editable) return;
        const curIndex = order.current.indexOf(originalIndex);//начальный индекс
        if (!initialYofDragged.current) initialYofDragged.current = initialY.current[curIndex];
        const curRow = clamp(getNewIndex(curIndex, y)!, 0, props.tasks.length - 1);//текущий новый индекс
        const newOrder = movePos(order.current, curIndex, curRow);// новый порядок
        const newHeights = movePos(heights.current, curIndex, curRow);//новый массив высот
        initialY.current = newHeights.map((height, index) => {//новый массив У координат
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

    const tasksElements = props.tasks.map(task =>
        <TodoListTask task={task} key={task.id}
                      todoListId={props.todoListId}/>
    );
    const fragment = springs.map((styles, i) =>
        <TaskWrapper {...gesture(i)} key={i} style={styles}>
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

