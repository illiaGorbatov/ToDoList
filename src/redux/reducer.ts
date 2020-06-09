import {api} from "./api";
import {TaskType, TodoListType} from "./entities";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppStateType, InferActionTypes} from "./store";
import cloneDeep from "lodash-es/cloneDeep";

type InitialStateType = {
    todoLists: Array<TodoListType>,
    deepCopy: TodoListType[],
    deletedLists: Array<string>,
    addedLists: Array<TodoListType>,
    changedLists: Array<TodoListType>,
    deletedTasks: Array<{ todoListId: string, taskId: string }>,
    changedTasks: Array<TaskType>,
    addedTasks: Array<TaskType>,
    deletedTasksWithList: Array<{ todoListId: string, taskId: string }>,
    editable: boolean,
    errorsNumber: number,
    isModalOpened: boolean,
};

const initialState = {
    todoLists: [],
    deepCopy: [],
    editable: false,
    deletedLists: [],
    addedLists: [],
    changedLists: [],
    deletedTasks: [],
    changedTasks: [],
    addedTasks: [],
    deletedTasksWithList: [],
    errorsNumber: 0,
    isModalOpened: false
};

const reducer = (state: InitialStateType = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'reducer/SET_TODO_LISTS':
            return {
                ...state,
                todoLists: action.todoLists
            };
        case 'reducer/SET_TASKS':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: action.tasks}
                    } else return list
                }),
            };
        case 'reducer/ADD_TODO_LIST':
            return {
                ...state,
                todoLists: [action.newTodoList, ...state.todoLists],
                addedLists: [...state.addedLists, action.newTodoList]
            };
        case 'reducer/ADD_TASK':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: [...list.tasks, action.newTask]}
                    } else return list
                }),
                addedTasks: [...state.addedTasks, action.newTask]
            };
        case 'reducer/CHANGE_TASK':
            const indexOfTask = state.changedTasks.findIndex(item => item.id === action.task.id);
            const newTasksArray = indexOfTask === -1 ? [...state.changedTasks, action.task]
                : state.changedTasks.map((item, i) => {
                    if (i === indexOfTask) return action.task;
                    return item
                });
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
                changedTasks: [...newTasksArray]
            };
        case 'reducer/DELETE_TODO_LIST':
            return {
                ...state,
                todoLists: state.todoLists.filter(list => list.id !== action.todoListId),
                deletedLists: [...state.deletedLists, action.todoListId],
                deletedTasksWithList: [...state.deletedTasksWithList, ...state.todoLists
                    .find(item => item.id === action.todoListId)!.tasks
                    .map(item => ({todoListId: item.todoListId, taskId: item.id}))]
            };
        case 'reducer/DELETE_TASK':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: list.tasks.filter(task => task.id !== action.taskId)}
                    } else return list
                }),
                deletedTasks: [...state.deletedTasks, {todoListId: action.todoListId, taskId: action.taskId}]
            };
        case 'reducer/CHANGE_TODO_LIST_TITLE':
            const listIndex = state.changedLists.findIndex(item => item.id === action.todoListId);
            const newListsArray: Array<TodoListType> = listIndex === -1 ? [...state.changedLists, {
                    id: action.todoListId, title: action.todoListTitle, tasks: []
                }]
                : state.changedLists.map((item, i) => {
                    if (i === listIndex) return {id: action.todoListId, title: action.todoListTitle, tasks: []};
                    return item
                });
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, title: action.todoListTitle}
                    } else return list
                }),
                changedLists: [...newListsArray]
            };
        case 'reducer/CHANGE_TASK_HEIGHT':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {
                            ...list, tasks: list.tasks.map(task => {
                                if (task.id === action.id) {
                                    return {...task, height: action.height}
                                } else return task;
                            })
                        }
                    } else return list
                }),
            };
        case 'reducer/CHANGE_LIST_HEIGHT':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, height: action.height}
                    } else return list
                })
            };
        case "reducer/ENABLE_EDIT_MODE":
            return {
                ...state,
                editable: true,
                deletedLists: [],
                addedLists: [],
                changedLists: [],
                deletedTasks: [],
                changedTasks: [],
                addedTasks: [],
                deletedTasksWithList: [],
                errorsNumber: 0,
                deepCopy: cloneDeep(state.todoLists)
            };
        case "reducer/DISABLE_EDIT_MODE":
            return {
                ...state,
                editable: false
            }
        case "reducer/SET_ERROR":
            return {
                ...state,
                errorsNumber: state.errorsNumber + 1
            };
        default:
            return state;
    }
};

type ActionsTypes = InferActionTypes<typeof actions>;

export const actions = {
    addTodoList: (newTodoList: TodoListType) => ({type: 'reducer/ADD_TODO_LIST', newTodoList} as const),
    addTask: (newTask: TaskType, todoListId: string) => ({type: 'reducer/ADD_TASK', newTask, todoListId} as const),
    changeTask: (task: TaskType) => ({type: 'reducer/CHANGE_TASK', task} as const),
    deleteTodoList: (todoListId: string) => ({type: 'reducer/DELETE_TODO_LIST', todoListId} as const),
    deleteTask: (todoListId: string, taskId: string) => ({type: 'reducer/DELETE_TASK', taskId, todoListId} as const),
    restoreTodoList: (todoLists: TodoListType[]) => ({type: 'reducer/SET_TODO_LISTS', todoLists} as const),
    restoreTasks: (tasks: TaskType[], todoListId: string) => ({
        type: 'reducer/SET_TASKS',
        tasks,
        todoListId
    } as const),
    changeTodoListTitle: (todoListId: string, todoListTitle: string) => ({
        type: 'reducer/CHANGE_TODO_LIST_TITLE',
        todoListId,
        todoListTitle
    } as const),
    setTaskHeight: (height: number, id: string, todoListId: string) => ({
        type: 'reducer/CHANGE_TASK_HEIGHT',
        height, id, todoListId
    } as const),
    setListHeight: (height: number, todoListId: string) => ({
        type: 'reducer/CHANGE_LIST_HEIGHT',
        height, todoListId
    } as const),
    enableEditMode: () => ({type: 'reducer/ENABLE_EDIT_MODE'} as const),
    disableEditMode: () => ({type: 'reducer/DISABLE_EDIT_MODE'} as const),
    setError: () => ({type: 'reducer/SET_ERROR'} as const),
}

type ThunkType = ThunkAction<void, AppStateType, unknown, ActionsTypes>;
type ThunkActionType = ThunkDispatch<AppStateType, unknown, ActionsTypes>;

export const loadTodoListsTC = (): ThunkType => (dispatch: ThunkActionType) => {
    api.restoreState().then(data => {
        dispatch(actions.restoreTodoList(data))
    })
};
export const addTodoListTC = (title: string): ThunkType => (dispatch: ThunkActionType) => {//done
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

export const submitAllChanges = (): ThunkType =>
    async (dispatch: ThunkActionType, getState: () => AppStateType) => {
        const deletedLists = getState().todoList.deletedLists;
        const addedLists = getState().todoList.addedLists;
        const clearedAddedLists = getState().todoList.addedLists.filter(item => deletedLists
            .findIndex(i => i === item.id) === -1);
        const changedLists = getState().todoList.changedLists.filter(item => deletedLists
            .findIndex(i => i === item.id) === -1);
        const clearlyDeletedLists = deletedLists.filter(list => addedLists
            .findIndex(item => item.id === list) === -1);

        const deletedTasksWithList = getState().todoList.deletedTasksWithList;
        const deletedTasks = getState().todoList.deletedTasks.filter(item => deletedTasksWithList
            .findIndex(i => i.taskId === item.taskId) === -1);
        const allDeletedTasks = [...deletedTasks, ...deletedTasksWithList];
        const changedTasks = getState().todoList.changedTasks.filter(item => allDeletedTasks
            .findIndex(i => i.taskId === item.id) === -1);
        const addedTasks = getState().todoList.addedTasks.filter(item => allDeletedTasks
            .findIndex(i => i.taskId === item.id) === -1);
        //очистка от удалённых

        const clearlyAddedLists = clearedAddedLists.map(list => {
            const sameList = changedLists.find(item => item.id === list.id);
            if (sameList) {
                return sameList
            } else return list
        });
        const clearlyChangedLists = changedLists.filter(list => clearlyAddedLists
            .findIndex(item => item.id === list.id) === -1);
        //очистка одинаковых листов

        const clearedNewTasks = addedTasks.map(task => {
            const sameTask = changedTasks.find(item => item.id === task.id)
            if (sameTask) {
                return sameTask
            } else return task
        });
        const clearlyChangedTasks = changedTasks.filter(task => clearedNewTasks
            .findIndex(item => item.id === task.id) === -1);
        const addedInNewListsTasks = clearedNewTasks.filter(task => clearlyAddedLists
            .findIndex(list => list.id === task.todoListId) !== -1);
        const clearlyAddedTasks = clearedNewTasks.filter(task => addedInNewListsTasks
            .findIndex(item => item.id === task.id) !== 1);
        //очистка тасок

        //запросы
        if (clearlyAddedLists.length !== 0) {
            let newLists: Array<{ newId: string, oldId: string }> = [];
            const promises = clearlyAddedLists.map(async (list) => {
                return await api.addTodoList(list.title).then(data => {
                    if (data.resultCode === 0) newLists.push({newId: data.data.item.id, oldId: list.id})
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            })
            await Promise.all(promises);
            if (addedInNewListsTasks.length !== 0) {
                addedInNewListsTasks.forEach(task => {
                    let newListId = newLists.find(list => list.oldId === task.todoListId)!.newId;
                    console.log(newListId)
                    api.addTask(task.title, newListId).then(data => {
                        if (data.resultCode !== 0) dispatch(actions.setError())
                    })
                })
            }
        }
        if (clearlyDeletedLists.length !== 0) {
            clearlyDeletedLists.forEach(list => {
                api.deleteTodoList(list).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            })
        }
        if (clearlyChangedLists.length !== 0) {
            clearlyChangedLists.forEach(list => {
                api.changeTodoListTitle(list.id, list.title).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            })
        }
        if (deletedTasks.length !== 0) {
            deletedTasks.forEach(task => {
                api.deleteTask(task.todoListId, task.taskId).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            })
        }
        if (clearlyChangedTasks.length !== 0) {
            clearlyChangedTasks.forEach(task => {
                api.changeTask(task.todoListId, task.id, task).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            })
        }
        if (clearlyAddedTasks.length !== 0) {
            clearlyAddedTasks.forEach(task => {
                api.addTask(task.title, task.todoListId).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            })
        }
        dispatch(actions.disableEditMode())
    }

export default reducer