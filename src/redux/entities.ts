export type TodoListType = {
    id: string;
    addedDate?: string;
    order?: number;
    title: string;
    tasks: TaskType[],
    height?: number
};

export type TaskType = {
    description?: string;
    title: string;
    completed?: boolean;
    status?: number;
    priority?: number;
    startDate?: string;
    deadline?: string;
    id: string;
    todoListId: string;
    order?: number;
    addedDate?: string;
    height?: number;
    editStatus?: boolean
};