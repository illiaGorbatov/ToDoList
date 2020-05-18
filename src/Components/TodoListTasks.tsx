import * as React from 'react';
import '../App.css';
import TodoListTask from "./TodoListTask";
import {TaskType} from "../redux/entities";

type OwnPropsType = {
    changeStatus: (task: TaskType, status: number) => void;
    changeTitle: (task: TaskType, title: string) => void;
    todoListId: string;
    tasks: TaskType[]
};

const TodoListTasks: React.FC<OwnPropsType> = (props) => {

    const tasksElements = props.tasks.map(task =>
        <TodoListTask task={task} changeStatus={props.changeStatus} key={task.id}
                      changeTitle={props.changeTitle} todoListId={props.todoListId}/>
    );

    return (
        <div className="todoList-tasks">
            {tasksElements}
        </div>
    );
}

export default TodoListTasks;

