import React, {useEffect, useRef, useState} from "react";
import TodoListTasks from '../tasks/TodoListTasks';
import TodoListFooter from './TodoListFooter';
import '../../App.css'
import AddNewTask from "../tasks/AddNewTask";
import TodoListTitle from "./TodoListTitle";
import {useDispatch, useSelector} from 'react-redux';
import {actions, restoreTasksTC} from "../../redux/reducer";
import {TaskType} from "../../redux/entities";
import styled from "styled-components/macro";
import {AppStateType} from "../../redux/store";
import ModalWrapper from "../modalWrapper";
import { useSpring, animated } from "react-spring";
import {useHover} from "react-use-gesture";

const colors = [
    `linear-gradient(to top, #a8edea 0%, #fed6e3 100%)`,
    `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`,
    `linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)`,
    `linear-gradient(120deg, #f093fb 0%, #f5576c 100%)`,
    `linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)`,
    `linear-gradient(to top, #5ee7df 0%, #b490ca 100%)`,
    `linear-gradient(to top, #d299c2 0%, #fef9d7 100%)`,
    `linear-gradient(to top, #ebc0fd 0%, #d9ded8 100%)`,
    `linear-gradient(120deg, #f6d365 0%, #fda085 100%)`,
    `linear-gradient(to top, #96fbc4 0%, #f9f586 100%)`,
    `linear-gradient(-225deg, #FFFEFF 0%, #D7FFFE 100%)`,
    `linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)`,
    `linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)`,
    `linear-gradient(-20deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)`
];

const SingleListWrapper = styled(animated.div)`
  padding: 20px;
  position: relative;
  transform-style: preserve-3d;
  transform-origin: 50% 100%;
  backface-visibility: hidden;
  overflow: visible
`;

const SingleList = styled.div`
  padding: 15px;
  position: relative;
  width: 100%;
  height: 100%;
  text-transform: uppercase;
  font-size: 10px;
  border-radius: 4px;
  box-shadow: 0 10px 50px -10px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.span`
  height: 17px;
  width: 17px;
  border: 1px solid black;
  cursor: pointer;
  text-align: center;
`;

type PropsType = {
    id: string;
    key: string;
    listTitle: string;
    listTasks?: TaskType[];
};

const TodoList: React.FC<PropsType> = ({id, listTitle, listTasks}) => {

    const dispatch = useDispatch();
    const editable = useSelector((state: AppStateType) => state.todoList.editable);

    const [backgroundColor] = useState<string>(colors[Math.ceil(Math.random() * colors.length)]);

    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);
    useEffect(() => {
        if (ref.current) {
            let newHeight = ref.current.offsetHeight;
            if (height !== newHeight) {
                setHeight(newHeight)
                dispatch(actions.setListHeight(newHeight, id))
            }
        }
    })

    const [filterValue, setFilterValue] = useState<string>('All');

    useEffect(() => {//переделать
        if (!listTasks) dispatch(restoreTasksTC(id))
    }, []);


    const changeFilter = (newFilterValue: string) => {
        setFilterValue(newFilterValue)
    };

    const addTask = () => {
        const taskId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, (c, r) => ('x' == c ? (Math.random() * 16 | 0) : (r & 0x3 | 0x8)).toString(16));
        const newTask = {
            title: '',
            id: taskId,
            todoListId: id,
            editStatus: true
        }
        dispatch(actions.addTask(newTask, id));
    };

    const deleteTodoList = () => {
        dispatch(actions.deleteTodoList(id))
    };

    const tasks = listTasks ? listTasks.filter(t => {
        if (filterValue === "All") {
            return true;
        }
        if (filterValue === "Active") {
            return t.status === 0;
        }
        if (filterValue === "Completed") {
            return t.status === 2;
        }
    }) : [];

    //hover Effect
    const [spring, setSpring] = useSpring(() => ({
        rotateZ: 0,
        rotateY: 0,
        rotateX: 0,
    }));

    const bind = useHover(({hovering}) => {
        if (hovering) setSpring({
            rotateZ: -10,
            rotateY: 0,
            rotateX: -30,
        });
        if (!hovering) setSpring({
            rotateZ: 0,
            rotateY: 0,
            rotateX: 0,
        });
    })


    return (
        <SingleListWrapper ref={ref} style={spring} {...bind()}>
            <SingleList style={{backgroundImage: backgroundColor}}>
                <div>
                    <TodoListTitle listTitle={listTitle} id={id}/>
                    <CloseButton onClick={deleteTodoList}>
                        X
                    </CloseButton>
                </div>
                <TodoListTasks todoListId={id}
                               tasks={tasks}/>
                <AddNewTask addTask={addTask} itemType={'task'}/>
                {/* <TodoListFooter filterValue={filterValue} changeFilter={changeFilter}/>*/}
            </SingleList>
        </SingleListWrapper>
    );
}

export default React.memo(TodoList);
