import {api} from "./api";
import {TaskType, TodoListType} from "./entities";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppStateType} from "./store";

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

const reducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
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
        default: return state;
    }
};

type ActionType =
    AddTodoListActionType
    | AddTaskActionType
    | ChangeTaskActionType
    | DeleteTodoListActionType
    | DeleteTaskActionType
    | RestoreTodoListActionType
    | RestoreTasksActionType
    | ChangeTodoListTitleActionType
;

type AddTodoListActionType = {
    type: typeof ADD_TODOLIST,
    newTodoList: TodoListType;
};
type AddTaskActionType = {
    type: typeof ADD_TASK;
    newTask: TaskType;
    todoListId: string;
};
type ChangeTaskActionType = {
    type: typeof CHANGE_TASK;
    task: TaskType;
};
type DeleteTodoListActionType = {
    type: typeof DELETE_TODO_LIST;
    todoListId: string;
};
type DeleteTaskActionType = {
    type: typeof DELETE_TASK;
    taskId: string;
    todoListId: string;
};
type RestoreTodoListActionType = {
    type: typeof SET_TODOLISTS;
    todoLists: TodoListType[];
};
type RestoreTasksActionType = {
    type: typeof SET_TASKS;
    tasks: TaskType[];
    todoListId: string;
};
type ChangeTodoListTitleActionType = {
    type: typeof CHANGE_TODO_LIST_TITLE;
    todoListId: string;
    todoListTitle: string;
};


const addTodoListAC = (newTodoList: TodoListType): AddTodoListActionType => {
    return {
        type: ADD_TODOLIST,
        newTodoList: newTodoList
    }
};
const addTaskAC = (newTask: TaskType, todoListId: string): AddTaskActionType => {
    return {
        type: ADD_TASK,
        newTask,
        todoListId
    }
};
const changeTaskAC = (task: TaskType): ChangeTaskActionType => {
    return {
        type: CHANGE_TASK,
        task
    }
};
const deleteTodoListAC = (todoListId: string): DeleteTodoListActionType => {
    return {
        type: DELETE_TODO_LIST,
        todoListId
    }
};
const deleteTaskAC = (todoListId: string, taskId: string):DeleteTaskActionType => {
    return {
        type: DELETE_TASK,
        taskId,
        todoListId
    }
};
const restoreTodoListAC = (todoLists: TodoListType[]): RestoreTodoListActionType => {
    return {
        type: SET_TODOLISTS,
        todoLists
    }
};
const restoreTasksAC = (tasks: TaskType[], todoListId: string): RestoreTasksActionType => {
    return {
        type: SET_TASKS,
        tasks,
        todoListId
    }
};
const changeTodoListTitleAC = (todoListId: string, todoListTitle: string): ChangeTodoListTitleActionType => {
    return {
        type: CHANGE_TODO_LIST_TITLE,
        todoListId,
        todoListTitle
    }
};

type ThunkType = ThunkAction<void, AppStateType, unknown, ActionType>;
type ThunkActionType = ThunkDispatch<AppStateType, unknown, ActionType>

export const loadTodoListsTC = (): ThunkType => (dispatch: ThunkActionType) => {
    api.restoreState().then(data => {
        dispatch(restoreTodoListAC(data))
    })
};
export const addTodoListTC = (title: string): ThunkType => (dispatch: ThunkActionType) => {
    api.addTodoList(title).then(data => {
        if (data.resultCode === 0) dispatch(addTodoListAC(data.data.item))
    })
};
export const addTaskTC = (newTask: string, todoListId: string): ThunkType => (dispatch: ThunkActionType) => {
    api.addTask(newTask, todoListId).then(data => {
        if (data.resultCode === 0) dispatch(addTaskAC(data.data.item, todoListId))
    })
};
export const changeTaskTC = (todoListId: string, taskId: string, newTask: TaskType): ThunkType => (dispatch: ThunkActionType) => {
    api.changeTask(todoListId, taskId, newTask).then(data => {
        if (data.resultCode === 0) dispatch(changeTaskAC(data.data.item))
    })
};
export const deleteTodoListTC = (todoListId: string): ThunkType => (dispatch: ThunkActionType) => {
    api.deleteTodoList(todoListId).then(data => {
        if (data.resultCode === 0) dispatch(deleteTodoListAC(todoListId))
    })
};
export const deleteTaskTC = (todoListId: string, taskId: string): ThunkType => (dispatch: ThunkActionType) => {
    api.deleteTask(todoListId, taskId).then(data => {
        if (data.resultCode === 0) dispatch(deleteTaskAC(todoListId, taskId))
    })
};
export const restoreTasksTC = (todoListId: string): ThunkType => (dispatch: ThunkActionType) => {
    api.restoreTasks(todoListId).then(data => {
       dispatch(restoreTasksAC(data.items, todoListId))
    })
};
export const changeTodoListTitleTC = (todoListId: string, todoListTitle: string): ThunkType => (dispatch: ThunkActionType) => {
    api.changeTodoListTitle(todoListId, todoListTitle).then(data => {
        if (data.resultCode === 0) dispatch(changeTodoListTitleAC(todoListId, todoListTitle))
    })
};

export default reducer