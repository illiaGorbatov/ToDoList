import {api} from "./api";
import {TaskType, TodoListType} from "./entities";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppStateType, InferActionTypes} from "./store";

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

const reducer = (state: InitialStateType = initialState, action: ActionsTypes): InitialStateType => {
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
            return {...state, todoLists: [action.newTodoList, ...state.todoLists]};
        case ADD_TASK:
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: [action.newTask, ...list.tasks]}
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

type ActionsTypes = InferActionTypes<typeof actions>;

const actions = {
    addTodoList: (newTodoList: TodoListType) => ({type: ADD_TODOLIST, newTodoList: newTodoList} as const),
    addTask: (newTask: TaskType, todoListId: string) => ({type: ADD_TASK, newTask, todoListId} as const),
    changeTask: (task: TaskType) => ({type: CHANGE_TASK, task} as const),
    deleteTodoList: (todoListId: string) => ({type: DELETE_TODO_LIST, todoListId} as const),
    deleteTask: (todoListId: string, taskId: string) => ({type: DELETE_TASK, taskId, todoListId} as const),
    restoreTodoList: (todoLists: TodoListType[]) => ({type: SET_TODOLISTS, todoLists} as const),
    restoreTasks: (tasks: TaskType[], todoListId: string) => ({
            type: SET_TASKS,
            tasks,
            todoListId
        } as const),
    changeTodoListTitle: (todoListId: string, todoListTitle: string) => ({
            type: CHANGE_TODO_LIST_TITLE,
            todoListId,
            todoListTitle
        } as const)

}

type ThunkType = ThunkAction<void, AppStateType, unknown, ActionsTypes>;
type ThunkActionType = ThunkDispatch<AppStateType, unknown, ActionsTypes>

export const loadTodoListsTC = (): ThunkType => (dispatch: ThunkActionType) => {
    api.restoreState().then(data => {
        dispatch(actions.restoreTodoList(data))
    })
};
export const addTodoListTC = (title: string): ThunkType => (dispatch: ThunkActionType) => {
    api.addTodoList(title).then(data => {
        if (data.resultCode === 0) dispatch(actions.addTodoList(data.data.item))
    })
};
export const addTaskTC = (newTask: string, todoListId: string): ThunkType => (dispatch: ThunkActionType) => {
    api.addTask(newTask, todoListId).then(data => {
        if (data.resultCode === 0) dispatch(actions.addTask(data.data.item, todoListId))
    })
};
export const changeTaskTC = (todoListId: string, taskId: string, newTask: TaskType): ThunkType => (dispatch: ThunkActionType) => {
    api.changeTask(todoListId, taskId, newTask).then(data => {
        if (data.resultCode === 0) dispatch(actions.changeTask(data.data.item))
    })
};
export const deleteTodoListTC = (todoListId: string): ThunkType => (dispatch: ThunkActionType) => {
    api.deleteTodoList(todoListId).then(data => {
        if (data.resultCode === 0) dispatch(actions.deleteTodoList(todoListId))
    })
};
export const deleteTaskTC = (todoListId: string, taskId: string): ThunkType => (dispatch: ThunkActionType) => {
    api.deleteTask(todoListId, taskId).then(data => {
        if (data.resultCode === 0) dispatch(actions.deleteTask(todoListId, taskId))
    })
};
export const restoreTasksTC = (todoListId: string): ThunkType => (dispatch: ThunkActionType) => {
    api.restoreTasks(todoListId).then(data => {
       dispatch(actions.restoreTasks(data.items, todoListId))
    })
};
export const changeTodoListTitleTC = (todoListId: string, todoListTitle: string): ThunkType => (dispatch: ThunkActionType) => {
    api.changeTodoListTitle(todoListId, todoListTitle).then(data => {
        if (data.resultCode === 0) dispatch(actions.changeTodoListTitle(todoListId, todoListTitle))
    })
};

export default reducer