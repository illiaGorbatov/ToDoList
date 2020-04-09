import {api} from "../Components/api";
import {TodoListType} from "./entities";

export const ADD_TODOLIST = 'todolist/redux/reducer/ADD_TODOLIST';
export const ADD_TASK = 'todolist/redux/reducer/ADD_TASK';
export const CHANGE_TASK = 'todolist/redux/reducer/CHANGE_TASK';
export const DELETE_TODO_LIST = 'todolist/redux/reducer/DELETE_TODO_LIST';
export const DELETE_TASK = 'todolist/redux/reducer/DELETE_TASK';
export const SET_TODOLISTS = 'todolist/redux/reducer/SET_TODOLISTS';
export const SET_TASKS = 'todolist/redux/reducer/SET_TASKS';
export const CHANGE_TODO_LIST_TITLE = 'todolist/redux/reducer/CHANGE_TODO_LIST_TITLE';

type InitialStateType = {
    todoLists: TodoListType[]
};

const initialState = {
    todoLists: []
};

const reducer = (state: InitialStateType = initialState, action) => {
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
        case CHANGE_TODO_LIST_TITLE:
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, title: action.todoListTitle}
                    } else return list
                })
            };
    }
    return state;
};

type ActionType = {

};

type AddTodoListACType = {
    type: typeof ADD_TODOLIST,
    newTodoList: TodoListType;
};


const addTodoListAC = (newTodoList: TodoListType): AddTodoListACType => {
    return {
        type: ADD_TODOLIST,
        newTodoList: newTodoList
    }
};
const addTaskAC = (newTask, todoListId) => {
    return {
        type: ADD_TASK,
        newTask,
        todoListId
    }
};
const changeTaskAC = (task) => {
    return {
        type: CHANGE_TASK,
        task
    }
};
const deleteTodoListAC = (todoListId) => {
    return {
        type: DELETE_TODO_LIST,
        todoListId
    }
};
const deleteTaskAC = (todoListId, taskId) => {
    return {
        type: DELETE_TASK,
        taskId,
        todoListId
    }
};
const restoreTodoListAC = (todoLists) => {
    return {
        type: SET_TODOLISTS,
        todoLists
    }
};
const restoreTasksAC = (tasks, todoListId) => {
    return {
        type: SET_TASKS,
        tasks,
        todoListId
    }
};
const changeTodoListTitleAC = (todoListId, todoListTitle) => {
    return {
        type: CHANGE_TODO_LIST_TITLE,
        todoListId,
        todoListTitle
    }
};


export const loadTodoListsTC = () => (dispatch) => {
    api.restoreState().then(res => {
        dispatch(restoreTodoListAC(res.data))
    })
};
export const addTodoListTC = (title) => (dispatch) => {
    api.addTodoList(title).then(res => {
        if (res.data.resultCode === 0) dispatch(addTodoListAC(res.data.data.item))
    })
};
export const addTaskTC = (newTask, todoListId) => (dispatch) => {
    api.addTask(newTask, todoListId).then(res => {
        if (res.data.resultCode === 0) dispatch(addTaskAC(res.data.data.item, todoListId))
    })
};
export const changeTaskTC = (todoListId, taskId, newTask) => (dispatch) => {
    api.changeTask(todoListId, taskId, newTask).then(res => {
        if (res.data.resultCode === 0) dispatch(changeTaskAC(res.data.data.item))
    })
};
export const deleteTodoListTC = (todoListId) => (dispatch) => {
    api.deleteTodoList(todoListId).then(res => {
        if (res.data.resultCode === 0) dispatch(deleteTodoListAC(todoListId))
    })
};
export const deleteTaskTC = (todoListId, taskId) => (dispatch) => {
    api.deleteTask(todoListId, taskId).then(res => {
        if (res.data.resultCode === 0) dispatch(deleteTaskAC(todoListId, taskId))
    })
};
export const restoreTasksTC = (todoListId) => (dispatch) => {
    api.restoreTasks(todoListId).then(res => {
       dispatch(restoreTasksAC(res.data.items, todoListId))
    })
};
export const changeTodoListTitleTC = (todoListId, todoListTitle) => (dispatch) => {
    api.changeTodoListTitle(todoListId, todoListTitle).then(res => {
        if (res.data.resultCode === 0) dispatch(changeTodoListTitleAC(todoListId, todoListTitle))
    })
};

export default reducer