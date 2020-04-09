export  type TodoListType = {
    id: string;
    addedDate: string;
    order: number;
    title: string;
};

export type TaskType = {
    title: string;
    description: string;
    completed: boolean;
    status: number;
    priority: number;
    startDate: string;
    deadline: string;
};