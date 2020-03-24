export const ADD_TODOLIST = 'todolist/redux/reducer/ADD_TODOLIST';
export const ADD_TASK = 'todolist/redux/reducer/ADD_TASK';
export const CHANGE_TASK = 'todolist/redux/reducer/CHANGE_TASK';
export const DELETE_TODO_LIST = 'todolist/redux/reducer/DELETE_TODO_LIST';
export const DELETE_TASK = 'todolist/redux/reducer/DELETE_TASK';
export const SET_TODOLISTS = 'todolist/redux/reducer/SET_TODOLISTS';
export const SET_TASKS = 'todolist/redux/reducer/SET_TASKS';
export const CHANGE_FILTER = 'todolist/redux/reducer/CHANGE_FILTER';

const initialState = {
    todoLists: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TODOLISTS:
            return {
                ...state,
                todoLists: action.todoLists
            };
        case SET_TASKS:
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: action.tasks}
                    } else return list
                }),
            };
        case ADD_TODOLIST:
            return {...state, todoLists: [...state.todoLists, action.newTodoList]};
        case ADD_TASK:
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: [...list.tasks, action.newTask]}
                    } else return list
                }),
            };
        case CHANGE_TASK:
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.task.todoListId) {
                        return {
                            ...list, tasks: list.tasks.map(task => {
                                if (task.id === action.task.id) {
                                    return {...action.task}
                                } else return task;
                            })
                        }
                    } else return list
                }),
            };
        case DELETE_TODO_LIST:
            return {
                ...state,
                todoLists: state.todoLists.filter(list => list.id !== action.todoListId)
            };
        case DELETE_TASK:
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: list.tasks.filter(task => task.id !== action.taskId)}
                    } else return list
                }),
            };
    }
    return state;
};

export const addTodoListAC = (newTodoList) => {
    return {
        type: ADD_TODOLIST,
        newTodoList: newTodoList
    }
};
export const addTaskAC = (newTask, todoListId) => {
    return {
        type: ADD_TASK,
        newTask,
        todoListId
    }
};
export const changeTaskAC = (task) => {
    return {
        type: CHANGE_TASK,
        task
    }
};
export const deleteTodoListAC = (todoListId) => {
    return {
        type: DELETE_TODO_LIST,
        todoListId
    }
};
export const deleteTaskAC = (taskId, todoListId) => {
    return {
        type: DELETE_TASK,
        taskId,
        todoListId
    }
};
export const setTodoListAC = (todoLists) => {
    return {
        type: SET_TODOLISTS,
        todoLists
    }
};
export const setTasksAC = (tasks, todoListId) => {
    return {
        type: SET_TASKS,
        tasks,
        todoListId
    }
};

export default reducer