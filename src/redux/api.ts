import axios from "axios";
import {TaskType, TodoListType} from "./entities";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists",
    withCredentials: true,
    headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
});

const loginInstance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/auth",
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
type GetMeType = {
    id: number,
    email: string,
    login: string
};

export const api = {
    getAuthState: () => {
        return loginInstance.get<CommonResponseType<GetMeType>>('/me').then(async res => {
            if (res.status !== 200) {
                let response = res;
                while (response.status !== 200) {
                    response = await loginInstance.get<CommonResponseType<GetMeType>>('')
                }
                return response.data
            }
            return res.data
        })
    },
    logIn: () => {
        const requestObject = {email: "npikolist@gmail.com", password: "512347", rememberMe: false};
        return loginInstance.post<CommonResponseType<{userId: string}>>('/login', requestObject)
            .then(async res => {
            if (res.status !== 200) {
                let response = res;
                while (response.status !== 200) {
                    response = await loginInstance.post<CommonResponseType<{userId: string}>>
                    ('', requestObject)
                }
                return response.data
            }
            return res.data
        })
    },
    restoreState: () => {
        return instance.get<Array<TodoListType>>('') .then(async res => {
            if (res.status !== 200) {
                let response = res;
                while (response.status !== 200) {
                    response = await instance.get<Array<TodoListType>>('')
                }
                return response.data
            }
            return res.data
        })
    },
    addTodoList: (title: string) => {
        return instance.post<CommonResponseType<{item: TodoListType}>>("", {title}).then(async res => {
            if (res.status !== 200) {
                let response = res;
                while (response.status !== 200) {
                    response = await instance.post<CommonResponseType<{item: TodoListType}>>("", {title})
                }
                return response.data
            }
            return res.data
        })
    },
    restoreTasks: (todoListId: string) => {
        return instance.get<RestoreTasksResponseType>(`/${todoListId}/tasks`).then(async res => {
            if (res.status !== 200) {
                let response = res;
                while (response.status !== 200) {
                    response = await instance.get<RestoreTasksResponseType>(`/${todoListId}/tasks`)
                }
                return response.data
            }
            return res.data
        })
    },
    addTask: (title: string, todoListId: string) => {
        return instance.post<CommonResponseType<{item: TaskType}>>(`/${todoListId}/tasks`, {title})
            .then(async res => {
                if (res.status !== 200) {
                    let response = res;
                    while (response.status !== 200) {
                        response = await instance.post<CommonResponseType<{item: TaskType}>>(`/${todoListId}/tasks`, {title})
                    }
                    return response.data
                }
                return res.data
            })
    },
    changeTask: (todoListId: string, taskId: string, newTask: TaskType) => {
        return instance.put<CommonResponseType<{item: TaskType}>>(`/${todoListId}/tasks/${taskId}`, newTask)
            .then(async res => {
                if (res.status !== 200) {
                    let response = res;
                    while (response.status !== 200) {
                        response = await instance.put<CommonResponseType<{item: TaskType}>>(`/${todoListId}/tasks/${taskId}`, newTask)
                    }
                    return response.data
                }
                return res.data
            })
    },
    deleteTodoList: (todoListId: string) => {
        return instance.delete<CommonResponseType<{}>>(`/${todoListId}`).then(async res => {
            if (res.status !== 200) {
                let response = res;
                while (response.status !== 200) {
                    response = await instance.delete<CommonResponseType<{}>>(`/${todoListId}`)
                }
                return response.data
            }
            return res.data
        })
    },
    deleteTask: (todoListId: string, taskId: string) => {
        return instance.delete<CommonResponseType<{item: TaskType}>>(`/${todoListId}/tasks/${taskId}`)
            .then(async res => {
                if (res.status !== 200) {
                    let response = res;
                    while (response.status !== 200) {
                        response = await instance.delete<CommonResponseType<{item: TaskType}>>(`/${todoListId}/tasks/${taskId}`)
                    }
                    return response.data
                }
                return res.data
            })
    },
    changeTodoListTitle: (todoListId:string, newTitle: string) => {
        return instance.put<CommonResponseType<TodoListType>>(`/${todoListId}`, {title: newTitle})
            .then(async res => {
                if (res.status !== 200) {
                    let response = res;
                    while (response.status !== 200) {
                        response = await instance.put<CommonResponseType<TodoListType>>(`/${todoListId}`, {title: newTitle})
                    }
                    return response.data
                }
                return res.data
            })
    },
    swapTasks: (todoListId: string, swappedTask: string, beforeSwappedTask: string | null) => {
        return instance.put<CommonResponseType<{}>>(`/${todoListId}/tasks/${swappedTask}/reorder`, {putAfterItemId: beforeSwappedTask})
            .then(async res => {
                if (res.status !== 200) {
                    let response = res;
                    while (response.status !== 200) {
                        response = await instance.put<CommonResponseType<{}>>(`/${todoListId}/tasks/${swappedTask}/reorder`,
                            {putAfterItemId: beforeSwappedTask})
                    }
                    return response.data
                }
                return res.data
            })
    },
    swapTodoList: (swappedList: string, beforeSwappedList: string| null) => {
        return instance.put<CommonResponseType<{}>>(`/${swappedList}/reorder`, {putAfterItemId: beforeSwappedList})
            .then(async res => {
                if (res.status !== 200) {
                    let response = res;
                    while (response.status !== 200) {
                        response = await instance.put<CommonResponseType<{}>>(`/${swappedList}/reorder`,
                            {putAfterItemId: beforeSwappedList})
                    }
                    return response.data
                }
                return res.data
            })
    }
};
