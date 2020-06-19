import React, {RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import TodoList from "./TodoList";
import {actions, loadTodoListsTC} from "../../redux/reducer";
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from "../../redux/store";
import styled from "styled-components/macro";
import {useMedia} from "../../hooks/useMedia";
import {animated, useSpring, useTransition, useSprings} from "react-spring";
import {useDrag} from "react-use-gesture";
import {TodoListType} from "../../redux/entities";
import {swap} from "../../hooks/swap";
import {useMeasure} from "../../hooks/useMesure";

const AllLists = styled(animated.div)<{ height: number }>`
  background-color: rgba(255, 255, 255, 0.5) ;
  position: relative;
  transform-style: preserve-3d;
  width: 70vw;
  height: ${props => props.height}px;
  z-index: 2;
`;

const TodoListContainer = styled(animated.div)<{ width: number }>` 
  transform-style: preserve-3d;
  position: absolute;
  width: ${props => props.width}px;
`;

const Addddd = styled(animated.div)`
  position: absolute;
  width: 10px;
  height: 10px;
  z-index: 20;
`;

type GridItemsType = {
    x: number,
    y: number,
    height: number,
    id: string,
    rightX: number,
    topY: number,
    horizontalCenter: number,
    verticalCenter: number,
    toDoList: JSX.Element
}

const TodoListsContainer: React.FC = () => {

    const editable = useSelector((store: AppStateType) => store.todoList.editable);
    const todoLists = useSelector((store: AppStateType) => store.todoList.todoLists);
    const dispatch = useDispatch();

    useEffect(() => {
        if (todoLists.length === 0) dispatch(loadTodoListsTC());
    }, []);

    const addTodoList = (title: string) => {
        const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, (c, r) => ('x' == c ? (r = Math.random() * 16 | 0) : (r & 0x3 | 0x8)).toString(16));
        const newList = {
            id,
            title,
            tasks: []
        }
        dispatch(actions.addTodoList(newList));
    };

    const wrapperAnimation = useSpring({
        x: editable ? '30vw' : '0vw',
        y: editable ? 0 : 275,
        rotateX: editable ? 0 : 45,
        rotateZ: editable ? 0 : 45,
        config: {tension: 100, friction: 60, clamp: true},
    });

    const [listsHeights, setHeight] = useState<Array<number>>([]);
    const temporaryValue = useRef<Array<{ height: number, id: string }>>([]);
    const setData = (height: number, id: string) => {
        const findHeight = temporaryValue.current.findIndex(item => item.id === id);
        const newHeightsArray = findHeight === -1 ? [...temporaryValue.current, {height, id}]
            : temporaryValue.current.map((item, i) => {
                if (i === findHeight) return {height, id};
                return item
            });
        temporaryValue.current = newHeightsArray
        if (newHeightsArray.length === todoLists.length) {
            const heights = todoLists.map(item => newHeightsArray.find(object => object.id === item.id)!.height)
            setHeight(heights)
        }
    };
    const deleteList = (id: string) => {
        const newHeights = temporaryValue.current.filter(item => item.id !== id)
        const heights = newHeights.map(item => item.height)
        setHeight(heights)
    }

    /*const toDoLists = useMemo(() => todoLists.map((item, i) => ({
        list: <TodoList id={item.id} key={item.id} index={i}
                        listTitle={item.title} listTasks={item.tasks} setData={setData}/>,
        id: item.id
    })), [todoLists]);*/
//adaptive grid with transitions

    const [springs, setSprings] = useSprings(todoLists.length, i => ({
        x: 0,
        y: 0
    }))

    const [bigItems, setItems] = useState<Array<GridItemsType>>([])
    const elementsHeights = useRef<Array<number>>([]);
    useEffect(() => {
        elementsHeights.current = listsHeights;
        const newHeights = new Array(columns).fill(0);
        gridItems.current = todoLists.map(
            (item, i) => {
                const height = elementsHeights.current[i] || 0;
                const column = i % columns;
                const x = currWidth * column;
                const y = (newHeights[column] += height) - height
                const rightX = x + currWidth;
                const topY = y + height;
                const horizontalCenter = x + currWidth / 2;
                const verticalCenter = y + height / 2;
                const toDoList = <TodoList id={item.id} key={item.id} index={i} deleteList={deleteList}
                                           listTitle={item.title} listTasks={item.tasks} setData={setData}/>
                return {x, y, height, id: item.id, topY, rightX, horizontalCenter, verticalCenter, toDoList}
            });
        heights.current = newHeights;
        /*setSprings(i => ({
            x: gridItems.current[i].x,
            y: gridItems.current[i].y
        }))*/
        setItems(gridItems.current)
    }, [listsHeights, todoLists]);

    const columns = useMedia(['(min-width: 2000px)', '(min-width: 1400px)', '(min-width: 800px)'], [4, 3, 2], 1);
    const [bind, {width}] = useMeasure();
    const currWidth = useMemo(() => width / columns, [width]);

    const heights = useRef<Array<number>>([]);
    const gridItems = useRef<Array<GridItemsType>>([]);

    const reordering = (oldIndex: number, newIndex: number) => {
        elementsHeights.current = swap(elementsHeights.current, oldIndex, newIndex)
        const newHeights = new Array(columns).fill(0);
        gridItems.current = swap(gridItems.current, oldIndex, newIndex).map(
            (item, i) => {
                const column = i % columns;
                const x = currWidth * column;
                const y = (newHeights[column] += item.height) - item.height;
                const rightX = x + currWidth;
                const topY = y + item.height;
                const horizontalCenter = x + currWidth / 2;
                const verticalCenter = y + item.height / 2;
                return {...item, x, y, rightX, topY, horizontalCenter, verticalCenter}
            });
        heights.current = newHeights;
        setItems(gridItems.current)
        /*setSprings(i => ({
            x: gridItems.current[i].x,
            y: gridItems.current[i].y
        }))*/
    }

    const [debugAn, setAn] = useSpring(() => ({x: 0, y: 0, immediate: true}));

    const verticalBorder = useRef<number>(0);
    const horizontalBorder = useRef<number>(0);
    const prevVelocity = useRef<Array<number>>([0, 0]);
    const calculatePositions = (x: number, y: number, vx: number, vy: number) => {
        if (vx === 0 && vy) {
            horizontalBorder.current = currX.current + x + currWidth / 2
        }
        if (vy === 0 && vx) {
            verticalBorder.current = currY.current + y + currHeight.current / 2;
        }
        if (vx > 0) {
            horizontalBorder.current = currX.current + x + currWidth;
        }
        if (vx < 0) {
            horizontalBorder.current = currX.current + x;
        }
        if (vy > 0) {
            verticalBorder.current = currY.current + y + currHeight.current;
        }
        if (vy < 0) {
            verticalBorder.current = currY.current + y;
        }
        setAn({x: horizontalBorder.current, y: verticalBorder.current, immediate: true})
        let i = gridItems.current.findIndex(item => {
            let horBord = false;
            let verBord = false;
            if (vx === 0 && horizontalBorder.current > item.x && horizontalBorder.current < item.rightX
                && prevVelocity.current[0] && vy !== 0) {
                horBord = true
            }
            if (vy === 0 && verticalBorder.current > item.y && verticalBorder.current < item.topY
                && prevVelocity.current[1] && vx !== 0) {
                verBord = true;
            }
            if (vx > 0 && horizontalBorder.current > item.horizontalCenter && horizontalBorder.current < item.rightX) {
                horBord = true;
            }
            if (vx < 0 && horizontalBorder.current > item.x && horizontalBorder.current < item.horizontalCenter) {
                horBord = true;
            }
            if (vy > 0 && verticalBorder.current < item.topY && verticalBorder.current > item.horizontalCenter) {
                verBord = true;
            }
            if (vy < 0 && verticalBorder.current > item.y && verticalBorder.current < item.horizontalCenter) {
                verBord = true;
            }
            if (horBord && verBord) return true
        });
        prevVelocity.current = [vx, vy];
        return i < todoLists.length && i >= 0 ? i : null;
    }

    const transitions = useTransition(bigItems, {
        from: ({x}) =>
            ({x, y: 0, opacity: 0}),
        enter: ({x, y}) =>
            ({x, y, opacity: 1}),
        update: ({x, y}) =>
            ({x, y}),
        leave: {height: 0, opacity: 0},
        config: {mass: 5, tension: 500, friction: 100},
        trail: 25,
        key: item => item.id,
    });

    const draggedList = useRef<number>(0);
    const currX = useRef<number>(0);
    const currY = useRef<number>(0);
    const currHeight = useRef<number>(0);
    const [draggedListId, dragList] = useState<null | string>(null);
    const [spring, setSpring] = useSpring(() => ({
        x: 0,
        y: 0,
        zIndex: 1
    }));
    const gesture = useDrag(({
                                 args: [id], down, movement: [x, y], event,
                                 vxvy: [vx, vy]
                             }) => {
        draggedList.current = gridItems.current.findIndex(item => item.id === id);
        if (!draggedListId) {
            currX.current = gridItems.current[draggedList.current].x;
            currY.current = gridItems.current[draggedList.current].y;
            currHeight.current = gridItems.current[draggedList.current].height;
            setSpring({
                x: currX.current,
                y: currY.current,
                zIndex: 3,
                immediate: true,
                onRest: () => dragList(id)
            });
            return
        }
        setSpring({
            x: currX.current + x,
            y: currY.current + y,
            immediate: false
        });
        const newIndex = calculatePositions(x, y, vx, vy);
        if (newIndex !== null && newIndex !== draggedList.current) reordering(draggedList.current, newIndex);
        if (!down) {
            setSpring({
                x: gridItems.current[draggedList.current].x,
                y: gridItems.current[draggedList.current].y,
                zIndex: 1,
                onRest: () => dragList(null),
                immediate: false
            });
        }
    }, {filterTaps: true});
    const fragment = transitions((style, item, t, i) =>
        <TodoListContainer style={draggedListId && draggedListId === item.id ? spring : style}
                           {...editable && {...gesture(item.id)}} width={currWidth}>
            {item.toDoList}
        </TodoListContainer>
    );

    /*const fragment = gridItems.current.length !== 0 && springs.map((style, i) =>
        <TodoListContainer style={draggedListId && draggedListId === gridItems.current[i].id ? spring : style}
                           {...editable && {...gesture(gridItems.current[i].id)}} width={currWidth} key={gridItems.current[i].id}>
            {toDoLists.find(list => list.id === gridItems.current[i].id)!.list}
        </TodoListContainer>
    );*/
console.log('render')
    return (
        <AllLists height={(Math.max(...heights.current) || 0)} style={wrapperAnimation} {...bind}>
            <Addddd style={debugAn}/>
            {fragment}
        </AllLists>
    );
}

export default TodoListsContainer;

