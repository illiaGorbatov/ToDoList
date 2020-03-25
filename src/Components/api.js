import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists",
    withCredentials: true,
    headers: {'API-KEY': 'b4801660-f864-43f9-8acc-579713cc64df'}
});

export const api = {
    restoreState: () => {
        return instance.get()
    },
    addTodoList: (title) => {
        return instance.post("", {title: title})
    },
    restoreTodoListState: (todoListId) => {
        return instance.get(`/${todoListId}/tasks`)
    },
    addTask: (todoListId, title) => {
        return instance.post(`/${todoListId}/tasks`, {title: title})
    },
    changeStatus: (todoListId, taskId, newTask) => {
        return instance.put(`/${todoListId}/tasks/${taskId}`, newTask)
    },
    changeTitle: (todoListId, taskId, newTask) => {
        return instance.put(`/${todoListId}/tasks/${taskId}`, newTask)
    },
    deleteTodoList: (todoListId) => {
        return instance.delete(`/${todoListId}`)
    },
    deleteTask: (todoListId, taskId) => {
        return instance.delete(`/${todoListId}/tasks/${taskId}`)
    },
    changeTodoListTitle: (todoListId, newTitle) => {
        return instance.put(`/${todoListId}`, {title: newTitle})
    }
};
