import axios from "axios";
import {TaskType, TodoListType} from "../redux/entities";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists",
    withCredentials: true,
    headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
});

type AddTodoListResponseType = {
    resultCode: number;
    messages: string[];
    data: {item: TodoListType};
};
type RestoreTasksResponseType = {
    items: TaskType[];
    totalCount: number;
    error?: string
};
type AddTaskResponseType = {
    resultCode: number;
    messages: string[];
    data: {item: TaskType};
};
type ChangeTaskResponseType = {
    resultCode: number;
    messages: string[];
    data: {item: TaskType};
};
type DeleteTodoListResponseType = {
    resultCode: number;
    messages: string[];
    data: {};
};
type DeleteTaskResponseType = {
    resultCode: number;
    messages: string[];
    data: {item: TaskType};
};

export const api = {
    restoreState: () => {
        return instance.get<TodoListType[]>('')
    },
    addTodoList: (title: string) => {
        return instance.post<AddTodoListResponseType>("", {title: title})
    },
    restoreTasks: (todoListId: string) => {
        return instance.get<RestoreTasksResponseType>(`/${todoListId}/tasks`)
    },
    addTask: (title: string, todoListId: string) => {
        return instance.post<AddTaskResponseType>(`/${todoListId}/tasks`, {title: title})
    },
    changeTask: (todoListId: string, taskId: string, newTask: TaskType) => {
        return instance.put<ChangeTaskResponseType>(`/${todoListId}/tasks/${taskId}`, newTask)
    },
    deleteTodoList: (todoListId: string) => {
        return instance.delete<DeleteTodoListResponseType>(`/${todoListId}`)
    },
    deleteTask: (todoListId: string, taskId: string) => {
        return instance.delete<DeleteTaskResponseType>(`/${todoListId}/tasks/${taskId}`)
    },
    changeTodoListTitle: (todoListId:string, newTitle: string) => {
        return instance.put(`/${todoListId}`, {title: newTitle})
    }
};
