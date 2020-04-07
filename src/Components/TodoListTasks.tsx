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

class TodoListTasks extends React.Component<OwnPropsType> {
    render() {

        let tasksElements = this.props.tasks.map(task =>
            <TodoListTask task={task} changeStatus={this.props.changeStatus} key={task.id}
                          changeTitle={this.props.changeTitle} todoListId={this.props.todoListId}/>
        );

        return (
            <div className="todoList-tasks">
                {tasksElements}
            </div>
        );
    }
}

export default TodoListTasks;

