import axios from "axios";
import {TaskType, TodoListType} from "./entities";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists",
    withCredentials: true,
    headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
});

type CommonResponseType<T> = {
    resultCode: number;
    messages: string[];
    data: T
};
type RestoreTasksResponseType = {
    items: TaskType[];
    totalCount: number;
    error?: string
};

export const api = {
    restoreState: () => {
        return instance.get<TodoListType[]>('').then(res => res.data)
    },
    addTodoList: (title: string) => {
        return instance.post<CommonResponseType<{item: TodoListType}>>("", {title}).then(res => res.data)
    },
    restoreTasks: (todoListId: string) => {
        return instance.get<RestoreTasksResponseType>(`/${todoListId}/tasks`).then(res => res.data)
    },
    addTask: (title: string, todoListId: string) => {
        return instance.post<CommonResponseType<{item: TaskType}>>(`/${todoListId}/tasks`, {title})
            .then(res => res.data)
    },
    changeTask: (todoListId: string, taskId: string, newTask: TaskType) => {
        return instance.put<CommonResponseType<{item: TaskType}>>(`/${todoListId}/tasks/${taskId}`, newTask)
            .then(res => res.data)
    },
    deleteTodoList: (todoListId: string) => {
        return instance.delete<CommonResponseType<{}>>(`/${todoListId}`).then(res => res.data)
    },
    deleteTask: (todoListId: string, taskId: string) => {
        return instance.delete<CommonResponseType<{item: TaskType}>>(`/${todoListId}/tasks/${taskId}`)
            .then(res => res.data)
    },
    changeTodoListTitle: (todoListId:string, newTitle: string) => {
        return instance.put<CommonResponseType<TodoListType>>(`/${todoListId}`, {title: newTitle})
            .then(res => res.data)
    },
    swapTasks: (todoListId: string, currentTask: string, swappedTask: string) => {
        return instance.put<CommonResponseType<{}>>(`/${todoListId}/tasks/${currentTask}/reorder`, {putAfterItemId: swappedTask})
            .then(res => res.data)
    },
    swapTodoList: (currentList: string, swappedList: string) => {
        return instance.put<CommonResponseType<{}>>(`/${currentList}/reorder`, {putAfterItemId: swappedList})
            .then(res => res.data)
    }
};
