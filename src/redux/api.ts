import axios from "axios";
import {TaskType, TodoListType} from "./entities";
import axiosRetry from "axios-retry";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists",
    withCredentials: true,
    headers: {
        'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'
    },
});
axiosRetry(instance, { retries: 4 });

const loginInstance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/auth",
    withCredentials: true,
    headers: {
        'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'
    }
});
axiosRetry(loginInstance, { retries: 4 });

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
type GetMeType = {
    id: number,
    email: string,
    login: string
};

export const api = {
    getAuthState: () => {
        return loginInstance.get<CommonResponseType<GetMeType>>('/me').then(res => res.data)
    },
    logIn: () => {
        const requestObject = {email: "npikolist@gmail.com", password: "512347", rememberMe: false};
        return loginInstance.post<CommonResponseType<{ userId: string }>>('/login', requestObject)
            .then(res => res.data)
    },
    restoreState: () => {
        return instance.get<Array<TodoListType>>('').then(res => res.data)
    },
    addTodoList: (title: string) => {
        return instance.post<CommonResponseType<{ item: TodoListType }>>("", {title}).then(res => res.data)
    },
    restoreTasks: (todoListId: string) => {
        return instance.get<RestoreTasksResponseType>(`/${todoListId}/tasks`).then(res => res.data)
    },
    addTask: (title: string, todoListId: string) => {
        return instance.post<CommonResponseType<{ item: TaskType }>>(`/${todoListId}/tasks`, {title})
            .then(res => res.data)
    },
    changeTask: (todoListId: string, taskId: string, newTask: TaskType) => {
        return instance.put<CommonResponseType<{ item: TaskType }>>(`/${todoListId}/tasks/${taskId}`, newTask)
            .then(res => res.data)
    },
    deleteTodoList: (todoListId: string) => {
        return instance.delete<CommonResponseType<{}>>(`/${todoListId}`).then(res => res.data)
    },
    deleteTask: (todoListId: string, taskId: string) => {
        return instance.delete<CommonResponseType<{ item: TaskType }>>(`/${todoListId}/tasks/${taskId}`)
            .then(res => res.data)
    },
    changeTodoListTitle: (todoListId: string, newTitle: string) => {
        return instance.put<CommonResponseType<TodoListType>>(`/${todoListId}`, {title: newTitle})
            .then(res => res.data)
    },
    swapTasks: (todoListId: string, swappedTask: string, beforeSwappedTask: string | null) => {
        return instance.put<CommonResponseType<{}>>(`/${todoListId}/tasks/${swappedTask}/reorder`, {putAfterItemId: beforeSwappedTask})
            .then(res => res.data)
    },
    swapTodoList: (swappedList: string, beforeSwappedList: string | null) => {
        return instance.put<CommonResponseType<{}>>(`/${swappedList}/reorder`, {putAfterItemId: beforeSwappedList})
            .then(res => res.data)
    }
};
