import {api} from "./api";
import {TaskType, TodoListType} from "./entities";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppStateType, InferActionTypes} from "./store";
import cloneDeep from "lodash-es/cloneDeep";
import {movePos} from "../hooks/movePos";
import {endsWith} from "lodash-es";

type InitialStateType = {
    todoLists: Array<TodoListType>,
    deepCopy: Array<TodoListType>,
    editable: boolean,
    listsOrder: Array<string>,
    tasksOrder: Array<{ todoListId: string, newTasksOrder: Array<string> }>,
    newListsId: Array<{ oldId: string, newId: string }>,
    newTasksId: Array<{ oldId: string, newId: string, todoListId: string }>,
    errorsNumber: number,
    focusedStatus: boolean,
    currentPaletteIndex: number | null,
    initialLoadingState: boolean,
    pendingState: boolean
};

const initialState = {
    todoLists: [],
    deepCopy: [],
    editable: false,
    listsOrder: [],
    tasksOrder: [],
    newListsId: [],
    newTasksId: [],
    errorsNumber: 0,
    focusedStatus: false,
    currentPaletteIndex: null,
    initialLoadingState: true,
    pendingState: false
};

const functionalReducer = (state: InitialStateType = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'functionalReducer/SET_TODO_LISTS':
            return {
                ...state,
                todoLists: action.todoLists
            };
        case 'functionalReducer/SET_TASKS':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: action.tasks}
                    } else return list
                }),
            };
        case 'functionalReducer/ADD_TODO_LIST':
            return {
                ...state,
                todoLists: [action.newTodoList, ...state.todoLists],
            };
        case 'functionalReducer/ADD_TASK':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: [action.newTask, ...list.tasks]}
                    } else return list
                }),
            };
        case 'functionalReducer/CHANGE_TASK':
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
        case 'functionalReducer/DELETE_TODO_LIST':
            return {
                ...state,
                todoLists: state.todoLists.filter(list => list.id !== action.todoListId),
            };
        case 'functionalReducer/DELETE_TASK':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: list.tasks.filter(task => task.id !== action.taskId)}
                    } else return list
                }),
            };
        case 'functionalReducer/CHANGE_TODO_LIST_TITLE':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, title: action.todoListTitle}
                    } else return list
                }),
            };
        case "functionalReducer/SWAP_TODO_LISTS":
            return {
                ...state,
                listsOrder: action.newListsOrder
            }
        case "functionalReducer/SWAP_TASKS":
            const index = state.tasksOrder.findIndex(item => item.todoListId === action.todoListId);
            const newSwappedTasks = index !== -1 ? state.tasksOrder.map((item, i) => {
                if (i === index) return {todoListId: action.todoListId, newTasksOrder: action.newTasksOrder}
                return item
            }) : [...state.tasksOrder, {todoListId: action.todoListId, newTasksOrder: action.newTasksOrder}]
            return {
                ...state,
                tasksOrder: newSwappedTasks
            }
        case "functionalReducer/ENABLE_EDIT_MODE": //глянуть
            return {
                ...state,
                editable: true,
                listsOrder: [],
                tasksOrder: [],
                errorsNumber: 0,
                deepCopy: cloneDeep(state.todoLists)
            };
        case "functionalReducer/DISABLE_EDIT_MODE":
            return {
                ...state,
                editable: false
            }
        case "functionalReducer/SET_ERROR":
            return {
                ...state,
                errorsNumber: state.errorsNumber + 1
            };
        case "functionalReducer/SET_FOCUSED_STATUS":
            return {
                ...state,
                focusedStatus: action.status
            };
        case "functionalReducer/SET_NEW_ID":
            return {
                ...state,
                todoLists: action.newTodoLists
            };
        /*case "functionalReducer/SET_NEW_LISTS_ID":
            return {
                ...state,
                newListsId: action.newListsId
            }
        case "functionalReducer/SET_NEW_TASKS_ID":
            return {
                ...state,
                newTasksId: action.newTasksId
            }*/
        case "functionalReducer/SET_CURRENT_PALETTE_INDEX":
            return {
                ...state,
                currentPaletteIndex: action.index
            }
        case "functionalReducer/REJECT_ALL_CHANGES":
            return {
                ...state,
                todoLists: state.deepCopy,
                editable: false,
                listsOrder: [],
                tasksOrder: [],
            }
        case "functionalReducer/COMPLETE_INITIAL_LOADING_STATE":
            return {
                ...state,
                initialLoadingState: false
            }
        case "functionalReducer/SET_PENDING_STATE":
            return {
                ...state,
                pendingState: action.pendingState
            }
        default:
            return state;
    }
};

type ActionsTypes = InferActionTypes<typeof actions>;

export const actions = {
    addTodoList: (newTodoList: TodoListType) => ({type: 'functionalReducer/ADD_TODO_LIST', newTodoList} as const),
    addTask: (newTask: TaskType, todoListId: string) => ({type: 'functionalReducer/ADD_TASK', newTask, todoListId} as const),
    changeTask: (task: TaskType) => ({type: 'functionalReducer/CHANGE_TASK', task} as const),
    deleteTodoList: (todoListId: string) => ({type: 'functionalReducer/DELETE_TODO_LIST', todoListId} as const),
    deleteTask: (todoListId: string, taskId: string) => ({type: 'functionalReducer/DELETE_TASK', taskId, todoListId} as const),
    restoreTodoList: (todoLists: TodoListType[]) => ({type: 'functionalReducer/SET_TODO_LISTS', todoLists} as const),
    restoreTasks: (tasks: TaskType[], todoListId: string) => ({
        type: 'functionalReducer/SET_TASKS',
        tasks,
        todoListId
    } as const),
    changeTodoListTitle: (todoListId: string, todoListTitle: string) => ({
        type: 'functionalReducer/CHANGE_TODO_LIST_TITLE',
        todoListId,
        todoListTitle
    } as const),
    enableEditMode: () => ({type: 'functionalReducer/ENABLE_EDIT_MODE'} as const),
    disableEditMode: () => ({type: 'functionalReducer/DISABLE_EDIT_MODE'} as const),
    setError: () => ({type: 'functionalReducer/SET_ERROR'} as const),
    setFocusedStatus: (status: boolean) => ({type: 'functionalReducer/SET_FOCUSED_STATUS', status} as const),
    swapTasks: (todoListId: string, newTasksOrder: Array<string>) => ({
        type: 'functionalReducer/SWAP_TASKS', todoListId, newTasksOrder
    } as const),
    swapTodoLists: (newListsOrder: Array<string>) => ({type: 'functionalReducer/SWAP_TODO_LISTS', newListsOrder} as const),
    setTodoLists: (newTodoLists: Array<TodoListType>) => ({type: 'functionalReducer/SET_NEW_ID', newTodoLists} as const),
    /*setNewListsId: (newListsId: Array<{ oldId: string, newId: string }>) => ({
        type: 'functionalReducer/SET_NEW_LISTS_ID', newListsId
    } as const),
    setNewTasksId: (newTasksId: Array<{ oldId: string, newId: string, todoListId: string }>) => ({
        type: 'functionalReducer/SET_NEW_TASKS_ID', newTasksId
    } as const),*/
    setCurrentPaletteIndex: (index: number | null) => ({type: 'functionalReducer/SET_CURRENT_PALETTE_INDEX', index} as const),
    rejectAllChanges: () => ({type: 'functionalReducer/REJECT_ALL_CHANGES'} as const),
    completeInitialLoadingState: () => ({type: 'functionalReducer/COMPLETE_INITIAL_LOADING_STATE'} as const),
    setPendingState: (pendingState: boolean) => ({type: 'functionalReducer/SET_PENDING_STATE', pendingState} as const),
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

/*export const submitAllChanges = (): ThunkType =>
    async (dispatch: ThunkActionType, getState: () => AppStateType) => {
        const deletedLists = getState().todoList.deletedLists;
        const addedLists = getState().todoList.addedLists;
        const clearedAddedLists = getState().todoList.addedLists.filter(item => deletedLists
            .findIndex(i => i === item.id) === -1);
        const changedLists = getState().todoList.changedLists.filter(item => deletedLists
            .findIndex(i => i === item.id) === -1);
        const clearlyDeletedLists = deletedLists.filter(list => addedLists
            .findIndex(item => item.id === list) === -1);
        /!*const addedSwappedLists = getState().todoList.swappedLists.filter(item => clearedAddedLists
            .findIndex(i => i.id === (item[0].id || item[1].id)) !== -1);
        const clearlySwappedLists = getState().todoList.swappedLists.filter(item => addedSwappedLists
            .findIndex(i => i[0] === item[0] && i[1] === item[1]) === -1);*!/

        const deletedTasksWithList = getState().todoList.deletedTasksWithList;
        const deletedTasks = getState().todoList.deletedTasks.filter(item => deletedTasksWithList
            .findIndex(i => i.taskId === item.taskId) === -1);
        const allDeletedTasks = [...deletedTasks, ...deletedTasksWithList];
        const changedTasks = getState().todoList.changedTasks.filter(item => allDeletedTasks
            .findIndex(i => i.taskId === item.id) === -1);
        const addedTasks = getState().todoList.addedTasks.filter(item => allDeletedTasks
            .findIndex(i => i.taskId === item.id) === -1);
        const clearedSwappedTasks = getState().todoList.swappedTasks.filter(item => deletedLists
            .findIndex(i => i === item.todoListId) === -1).map(item => item.swappedTasks
            .map(taskArray => [...taskArray, item.todoListId])).map(item => {
            const newArray: Array<string> = [];
            return newArray.concat(...item)
        })
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
        const addedSwappedTasks = clearedSwappedTasks.map(item => item.filter(task =>
            clearlyAddedTasks.findIndex(i => i.id === task) !== -1));
        const addedInNewListsSwappedTasks = clearedSwappedTasks.map(item => item.filter(task =>
            addedInNewListsTasks.findIndex(i => i.id === task) !== -1));
        const clearlySwappedTasks = clearedSwappedTasks.map(item => item.filter(task => (
            addedSwappedTasks.findIndex(i => (i[0] || i[1]) === task) === -1 || addedInNewListsSwappedTasks
                .findIndex(i => (i[0] || i[1]) === task) === -1)));
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
                let newTasks: Array<{ newId: string, oldId: string, listId: string }> = [];
                const promises = addedInNewListsTasks.map(async (task) => {
                    let newListId = newLists.find(list => list.oldId === task.todoListId)!.newId;
                    return await api.addTask(task.title, newListId).then(data => {
                        if (data.resultCode === 0) newTasks.push({
                            newId: data.data.item.id,
                            oldId: task.id,
                            listId: data.data.item.todoListId
                        })
                        if (data.resultCode !== 0) dispatch(actions.setError())
                    })
                })
                await Promise.all(promises);
                if (addedInNewListsSwappedTasks.length !== 0) {
                    const newIdSwappedTasks = addedInNewListsSwappedTasks.map(tasks => tasks.map(task => {
                        const currentTask = newTasks.find(newTask => task === newTask.oldId)!;
                        return {newId: currentTask.newId, listId: currentTask.listId}
                    }))
                    newIdSwappedTasks.map(tasks => {
                        api.swapTasks(tasks[0].listId, tasks[0].newId, tasks[1].newId)
                    })
                }
            }
        }
        if (clearlyAddedTasks.length !== 0) {
            let newTasks: Array<{ newId: string, oldId: string, listId: string }> = [];
            const promises = clearlyAddedTasks.map(async (task) => {
                api.addTask(task.title, task.todoListId).then(data => {
                    if (data.resultCode === 0) newTasks.push({
                        newId: data.data.item.id,
                        oldId: task.id,
                        listId: data.data.item.todoListId
                    })
                    if (data.resultCode !== 0) dispatch(actions.setError())
                });
            })
            await Promise.all(promises);
            if (addedSwappedTasks.length !== 0) {
                const newIdSwappedTasks = addedSwappedTasks.map(tasks => tasks.map(task => {
                    const currentTask = newTasks.find(newTask => task === newTask.oldId)!;
                    return {newId: currentTask.newId, listId: currentTask.listId}
                }))
                newIdSwappedTasks.map(tasks => {
                    api.swapTasks(tasks[0].listId, tasks[0].newId, tasks[1].newId).then(data => {
                        if (data.resultCode !== 0) dispatch(actions.setError())
                    })
                })
            }
        }
        if (clearlySwappedTasks.length !== 0) {
            clearlySwappedTasks.forEach(tasks => {
                api.swapTasks(tasks[2], tasks[0], tasks[1]).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            })
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
        if (clearlyChangedTasks.length !== 0) {
            clearlyChangedTasks.forEach(task => {
                api.changeTask(task.todoListId, task.id, task).then(data => {
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
        dispatch(actions.disableEditMode())
    };*/


export const initialization = (): ThunkType => async (dispatch: ThunkActionType) => {
    const authState = await api.getAuthState();
    console.log(authState)
    if (!authState.data.id) {
        await api.logIn()
    }
    dispatch(getStateFromServer());
    dispatch(actions.completeInitialLoadingState())
};

const getStateFromServer = (): ThunkType => async (dispatch: ThunkActionType) => {
    const lists = await api.restoreState();
    let listsWithTasks = lists;
    const getTasks = lists.map(async (item) => {
        return await api.restoreTasks(item.id).then(data => {
            const index = listsWithTasks.findIndex(list => item.id === list.id);
            listsWithTasks[index] = {...item, tasks: data.items}
        })
    });
    await Promise.all(getTasks)
    dispatch(actions.setTodoLists(listsWithTasks));
};

export const submitAllChanges = (): ThunkType =>
    async (dispatch: ThunkActionType, getState: () => AppStateType) => {

        dispatch(actions.disableEditMode());
        /*dispatch(actions.setPendingState(true))*/

        const oldTodoLists = getState().todoList.deepCopy;
        const newTodoLists = getState().todoList.todoLists;
        let listsOrder = getState().todoList.listsOrder;
        let tasksOrder = getState().todoList.tasksOrder;

        const newListsId: Array<{ oldId: string, newId: string }> = [];
        const newTasksId: Array<{ oldId: string, newId: string, todoListId: string }> = [];
        let todoListsWithNewId: Array<TodoListType> = [];

        //added items
        const addedLists = newTodoLists.filter(list => oldTodoLists.findIndex(oldList => oldList.id === list.id) === -1);
        const deletedLists = oldTodoLists.filter(list => newTodoLists.findIndex(newList => newList.id === list.id) === -1);
        const editedLists: Array<TodoListType> = []
        newTodoLists.map(list => {
            const oldList = oldTodoLists.find(oldList => oldList.id === list.id);
            if (oldList && list.title !== oldList.title) {
                editedLists.push(list)
            }
        })

        let addedTasks: Array<TaskType> = [];
        const editedTasks: Array<TaskType> = [];
        newTodoLists.map(list => {
            const oldList = oldTodoLists.find(oldList => oldList.id === list.id);
            if (oldList) {
                list.tasks.map(task => {
                    const oldTask = oldList.tasks.find(oldTask => oldTask.id === task.id)
                    if (!oldTask) {
                        addedTasks.push(task);
                        return
                    }
                    if (oldTask && oldTask.title !== task.title) {
                        editedTasks.push(task)
                    }
                })
            }
            if (!oldList && list.tasks.length !== 0) {
                list.tasks.map(task => addedTasks.push(task))
            }
        })
        const deletedTasks: Array<TaskType> = [];
        oldTodoLists.map(list => {
            const newList = newTodoLists.find(newList => newList.id === list.id);
            if (newList) {
                list.tasks.map(task => {
                    const newTask = newList.tasks.find(newTask => newTask.id === task.id)
                    if (!newTask) {
                        deletedTasks.push(task)
                    }
                })
            }
        })

        if (deletedLists.length !== 0) {
            deletedLists.map(list => {
                api.deleteTodoList(list.id).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            })
        }
        if (deletedTasks.length !== 0) {
            deletedTasks.map(task => {
                api.deleteTask(task.todoListId, task.id).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            })
        }
        if (editedLists.length !== 0) {
            editedLists.map(list => {
                api.changeTodoListTitle(list.id, list.title).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            })
        }
        if (editedTasks.length !== 0) {
            editedTasks.map(task => {
                api.changeTask(task.todoListId, task.id, task).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            })
        }

        const createAndChangeIdOfTasksInOrderList = async () => {
            if (addedTasks.length !== 0) {
                const tasksPromises = addedTasks.map(async (task) => {
                    return await api.addTask(task.title, task.todoListId).then(data => {
                        if (data.resultCode === 0) newTasksId.push({
                            newId: data.data.item.id,
                            oldId: task.id,
                            todoListId: data.data.item.todoListId
                        })
                        if (data.resultCode !== 0) dispatch(actions.setError())
                    });
                })
                await Promise.all(tasksPromises);
                if (tasksOrder.length !== 0) {
                    tasksOrder = tasksOrder.map(item => {
                        const newList = newListsId.find(list => list.oldId === item.todoListId)
                        const tasksWithNewId = item.newTasksOrder.map(taskId => {
                            const newTask = newTasksId.find(newTask => newTask.oldId === taskId);
                            if (newTask) return newTask.newId;
                            return taskId
                        })
                        return {todoListId: newList ? newList.newId : item.todoListId, newTasksOrder: tasksWithNewId}
                    })
                }
            }
        }

        if (addedLists.length !== 0) {
            const listPromises = addedLists.map(async (list) => {
                return await api.addTodoList(list.title).then(data => {
                    if (data.resultCode === 0) newListsId.push({newId: data.data.item.id, oldId: list.id})
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })

            })
            await Promise.all(listPromises);
            if (addedTasks.length !== 0) {
                addedTasks = addedTasks.map(task => {
                    const newListId = newListsId.find(list => list.oldId === task.todoListId);
                    if (newListId) return {...task, todoListId: newListId.newId}
                    return task
                })
            }
            if (listsOrder.length !== 0) {
                listsOrder = listsOrder.map(item => {
                    const newList = newListsId.find(list => list.oldId === item)
                    if (newList) return newList.newId;
                    return item
                })
            }
            await createAndChangeIdOfTasksInOrderList()
        } else await createAndChangeIdOfTasksInOrderList();

        //changing id
        if (newListsId.length !== 0) {
            todoListsWithNewId = newTodoLists.map(list => {
                const newList = newListsId.find(item => item.oldId === list.id)
                if (newList) return {...list, id: newList.newId};
                return list
            })
        } else todoListsWithNewId = newTodoLists;
        if (newTasksId.length !== 0) {
            todoListsWithNewId = todoListsWithNewId.map(list => {
                const tasks = list.tasks.map(task => {
                    const newTask = newTasksId.find(item => item.oldId === task.id)
                    if (newTask) return {...task, id: newTask.newId}
                    return task
                })
                return {...list, tasks}
            })
        }
        /*if (newListsId.length !== 0 || newTasksId.length !== 0) {
            dispatch(actions.setTodoLists(todoListsWithNewId))
        }*/

        //swap all items
        if (listsOrder.length !== 0 || addedLists.length > 1) {
            if (deletedLists.length !== 0 && listsOrder.length !== 0) {
                listsOrder = listsOrder.filter(list => todoListsWithNewId.findIndex(item => item.id === list) !== -1)
            }
            let currentOrder = addedLists.length > 1 ? await api.restoreState().then(data => data.map(item => item.id))
                : todoListsWithNewId.map(list => list.id);
            const swapOrder: Array<{ swappedId: string, beforeSwappedId: string | null }> = [];
            const order = listsOrder.length !== 0 ? listsOrder : todoListsWithNewId.map(list => list.id);
            order.map((thisListPosId, index) => {
                if (thisListPosId !== currentOrder[index]) {
                    if (index === 0) swapOrder.push({swappedId: thisListPosId, beforeSwappedId: null})
                    else swapOrder.push({swappedId: thisListPosId, beforeSwappedId: listsOrder[index - 1]});
                    const oldIndex = currentOrder.findIndex(listId => listId === thisListPosId)
                    currentOrder = movePos(currentOrder, oldIndex, index)
                }
            });
            swapOrder.map(item => {
                api.swapTodoList(item.swappedId, item.beforeSwappedId).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                });
            })
        }

        if (tasksOrder.length !== 0 || addedTasks.length > 1) {
            if (deletedTasks.length !== 0 && tasksOrder.length !== 0) {
                tasksOrder = tasksOrder.map(item => {
                    const currentList = todoListsWithNewId.find(list => list.id === item.todoListId)
                    if (currentList) {
                        const newTasksOrder = item.newTasksOrder.filter(taskId => currentList.tasks.findIndex(task =>
                            task.id === taskId) !== -1)
                        return {...item, newTasksOrder}
                    }
                    return item
                })
            }
            let addedTasksInLists: Array<{ todoListId: string, tasks: Array<string> }> = [];
            const currentListsStateOnServer = newTasksId.length > 1 ? await (async () => {
                newTasksId.map(task => {
                    const list = addedTasksInLists.length !== 0 ?
                        addedTasksInLists.find(list => list.todoListId === task.todoListId) : undefined;
                    if (list) {
                        const index = addedTasksInLists.findIndex(list => list.todoListId === task.todoListId);
                        addedTasksInLists[index] = {...list, tasks: [...list.tasks, task.newId]}
                    } else addedTasksInLists.push({todoListId: task.todoListId, tasks: [task.newId]})
                })
                let listsToUpdate: Array<string> = [];
                addedTasksInLists.map(item => {
                    if (item.tasks.length > 1) listsToUpdate.push(item.todoListId)
                })
                if (listsToUpdate.length !== 0) {
                    let listsOnServer: Array<{ todoListId: string, tasks: Array<string> }> = [];
                    const getListOrder = listsToUpdate.map(async (item) => {
                        return await api.restoreTasks(item).then(res => {
                            const tasks = res.items.map(item => item.id);
                            listsOnServer.push({todoListId: item, tasks})
                        });
                    });
                    await Promise.all(getListOrder);
                    return listsOnServer
                } else return undefined
            })() : undefined;

            console.log(currentListsStateOnServer,
                todoListsWithNewId.find(item => item.id === currentListsStateOnServer![0].todoListId)!
                    .tasks.map(item => item.id),
                todoListsWithNewId.find(item => item.id === currentListsStateOnServer![0].todoListId)!
                    .tasks.map(item => item.title))

            let requiredOrder: Array<{ todoListId: string, tasks: Array<string> }> = [];
            if (currentListsStateOnServer && tasksOrder.length !== 0) {
                currentListsStateOnServer.map(item => {
                    const isItemInOrder = tasksOrder.find(currItem =>
                        currItem.todoListId === item.todoListId);
                    if (isItemInOrder) return;
                    const orderFromCurrentState = todoListsWithNewId.find(list => item.todoListId === list.id)!;
                    requiredOrder.push({
                        todoListId: orderFromCurrentState.id,
                        tasks: orderFromCurrentState.tasks.map(task => task.id)
                    })
                });
                tasksOrder.map(item => requiredOrder.push({todoListId: item.todoListId, tasks: item.newTasksOrder}))
            } else if (!currentListsStateOnServer && tasksOrder.length !== 0) {
                requiredOrder = tasksOrder.map(item => ({todoListId: item.todoListId, tasks: item.newTasksOrder}));
            } else if (currentListsStateOnServer && tasksOrder.length === 0) {
                currentListsStateOnServer.map(item => {
                    const orderFromCurrentState = todoListsWithNewId.find(list => item.todoListId === list.id)!;
                    requiredOrder.push({
                        todoListId: orderFromCurrentState.id,
                        tasks: orderFromCurrentState.tasks.map(task => task.id)
                    })
                });
            }

            const currentOrder = requiredOrder.map(item => {
                const itemWithUpdatedState = currentListsStateOnServer ? currentListsStateOnServer
                    .find(list => list.todoListId === item.todoListId) : undefined;
                const curItem = todoListsWithNewId.find(list => list.id === item.todoListId)!;
                if (itemWithUpdatedState) return itemWithUpdatedState;
                return {todoListId: curItem.id, tasks: curItem.tasks.map(task => task.id)}
            });

            const swapOrder: Array<{ todoListId: string, swappedId: string, beforeSwappedId: string | null }> = [];
            requiredOrder.forEach(newOrder => {
                let currOrder = currentOrder.find(item => item.todoListId === newOrder.todoListId)!.tasks;
                newOrder.tasks.forEach((newTaskPosId, index) => {
                    if (newTaskPosId !== currOrder[index]) {
                        if (index === 0) swapOrder.push({
                            todoListId: newOrder.todoListId, swappedId: newTaskPosId, beforeSwappedId: null
                        });
                        else swapOrder.push({
                            todoListId: newOrder.todoListId, swappedId: newTaskPosId,
                            beforeSwappedId: currOrder[index - 1]
                        });
                        const oldIndex = currOrder.findIndex(taskId => taskId === newTaskPosId)
                        currOrder = movePos(currOrder, oldIndex, index)
                    }
                })
            });
            const groupedSwapOrder: Array<{todoListId: string, swapOrder: Array<{swappedId: string, beforeSwappedId: string | null}>}> = [];
            swapOrder.forEach(task => {
                const currentList = groupedSwapOrder.find(item => item.todoListId === task.todoListId);
                if (currentList) groupedSwapOrder.map(item => item.todoListId === currentList.todoListId ?
                    item.swapOrder.push({swappedId: task.swappedId, beforeSwappedId: task.todoListId}) : item
                );
                groupedSwapOrder.push({
                    todoListId: task.todoListId,
                    swapOrder: [{swappedId: task.swappedId, beforeSwappedId: task.beforeSwappedId}]
                })
            });
            const swapOrderPending = groupedSwapOrder.map(async (item) => {
                const consistentSwapOrder = item.swapOrder
                for (let order of consistentSwapOrder) {
                    await api.swapTasks(item.todoListId, order.swappedId, order.beforeSwappedId).then(data => {
                        if (data.resultCode !== 0) dispatch(actions.setError())
                    })
                }
            });
            await Promise.all(swapOrderPending)
           /* for (let item of swapOrder) {
                await api.swapTasks(item.todoListId, item.swappedId, item.beforeSwappedId).then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                })
            }*/
        }

        if (addedLists.length !== 0 || addedTasks.length !== 0) {
            dispatch(getStateFromServer())
        }
    };

export default functionalReducer