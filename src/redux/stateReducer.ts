import {api} from "./api";
import {TaskType, TodoListType} from "./entities";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppStateType, InferActionTypes} from "./store";
import cloneDeep from "lodash-es/cloneDeep";
import {movePos} from "../hooks/movePos";
import {interfaceActions} from "./interfaceReducer";

type InitialStateType = {
    todoLists: Array<TodoListType>,
    deepCopy: Array<TodoListType>,
    editable: boolean,
    listsOrder: Array<string>,
    tasksOrder: Array<{ todoListId: string, newTasksOrder: Array<string> }>,
    newListsId: Array<{ oldId: string, newId: string }>,
    newTasksId: Array<{ oldId: string, newId: string, todoListId: string }>,
};

const initialState = {
    todoLists: [],
    deepCopy: [],
    editable: false,
    listsOrder: [],
    tasksOrder: [],
    newListsId: [],
    newTasksId: [],
};

const stateReducer = (state: InitialStateType = initialState, action: StateActionsType): InitialStateType => {
    switch (action.type) {
        case 'stateReducer/SET_TODO_LISTS':
            return {
                ...state,
                todoLists: action.todoLists
            };
        case 'stateReducer/SET_TASKS':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: action.tasks}
                    } else return list
                }),
            };
        case 'stateReducer/ADD_TODO_LIST':
            return {
                ...state,
                todoLists: [action.newTodoList, ...state.todoLists],
            };
        case 'stateReducer/ADD_TASK':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: [action.newTask, ...list.tasks]}
                    } else return list
                }),
            };
        case 'stateReducer/CHANGE_TASK':
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
        case 'stateReducer/DELETE_TODO_LIST':
            return {
                ...state,
                todoLists: state.todoLists.filter(list => list.id !== action.todoListId),
            };
        case 'stateReducer/DELETE_TASK':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, tasks: list.tasks.filter(task => task.id !== action.taskId)}
                    } else return list
                }),
            };
        case 'stateReducer/CHANGE_TODO_LIST_TITLE':
            return {
                ...state,
                todoLists: state.todoLists.map(list => {
                    if (list.id === action.todoListId) {
                        return {...list, title: action.todoListTitle}
                    } else return list
                }),
            };
        case "stateReducer/SWAP_TODO_LISTS":
            return {
                ...state,
                listsOrder: action.newListsOrder
            }
        case "stateReducer/SWAP_TASKS":
            const index = state.tasksOrder.findIndex(item => item.todoListId === action.todoListId);
            const newSwappedTasks = index !== -1 ? state.tasksOrder.map((item, i) => {
                if (i === index) return {todoListId: action.todoListId, newTasksOrder: action.newTasksOrder}
                return item
            }) : [...state.tasksOrder, {todoListId: action.todoListId, newTasksOrder: action.newTasksOrder}]
            return {
                ...state,
                tasksOrder: newSwappedTasks
            }
        case "stateReducer/ENABLE_EDIT_MODE": //глянуть
            return {
                ...state,
                editable: true,
                listsOrder: [],
                tasksOrder: [],
                deepCopy: cloneDeep(state.todoLists)
            };
        case "stateReducer/DISABLE_EDIT_MODE":
            return {
                ...state,
                editable: false
            }
        case "stateReducer/SET_NEW_ID":
            return {
                ...state,
                todoLists: action.newTodoLists
            };
        case "stateReducer/REJECT_ALL_CHANGES":
            return {
                ...state,
                todoLists: state.deepCopy,
                editable: false,
                listsOrder: [],
                tasksOrder: [],
            }
        default:
            return state;
    }
};

export const stateActions = {
    addTodoList: (newTodoList: TodoListType) => ({type: 'stateReducer/ADD_TODO_LIST', newTodoList} as const),
    addTask: (newTask: TaskType, todoListId: string) => ({type: 'stateReducer/ADD_TASK', newTask, todoListId} as const),
    changeTask: (task: TaskType) => ({type: 'stateReducer/CHANGE_TASK', task} as const),
    deleteTodoList: (todoListId: string) => ({type: 'stateReducer/DELETE_TODO_LIST', todoListId} as const),
    deleteTask: (todoListId: string, taskId: string) => ({type: 'stateReducer/DELETE_TASK', taskId, todoListId} as const),
    restoreTodoList: (todoLists: TodoListType[]) => ({type: 'stateReducer/SET_TODO_LISTS', todoLists} as const),
    restoreTasks: (tasks: TaskType[], todoListId: string) => ({
        type: 'stateReducer/SET_TASKS',
        tasks,
        todoListId
    } as const),
    changeTodoListTitle: (todoListId: string, todoListTitle: string) => ({
        type: 'stateReducer/CHANGE_TODO_LIST_TITLE',
        todoListId,
        todoListTitle
    } as const),
    enableEditMode: () => ({type: 'stateReducer/ENABLE_EDIT_MODE'} as const),
    disableEditMode: () => ({type: 'stateReducer/DISABLE_EDIT_MODE'} as const),
    swapTasks: (todoListId: string, newTasksOrder: Array<string>) => ({
        type: 'stateReducer/SWAP_TASKS', todoListId, newTasksOrder
    } as const),
    swapTodoLists: (newListsOrder: Array<string>) => ({type: 'stateReducer/SWAP_TODO_LISTS', newListsOrder} as const),
    setTodoLists: (newTodoLists: Array<TodoListType>) => ({type: 'stateReducer/SET_NEW_ID', newTodoLists} as const),
    rejectAllChanges: () => ({type: 'stateReducer/REJECT_ALL_CHANGES'} as const),
}

type StateActionsType = InferActionTypes<typeof stateActions>;
type DispatchedActionsTypes = InferActionTypes<typeof stateActions & typeof interfaceActions>;

type ThunkType = ThunkAction<void, AppStateType, unknown, DispatchedActionsTypes>;
type ThunkActionType = ThunkDispatch<AppStateType, unknown, DispatchedActionsTypes>;

export const loadTodoListsTC = (): ThunkType => (dispatch: ThunkActionType) => {
    api.restoreState().then(data => {
        dispatch(stateActions.restoreTodoList(data))
    })
};
export const addTodoListTC = (title: string): ThunkType => (dispatch: ThunkActionType) => {
    api.addTodoList(title).then(data => {
        if (data.resultCode === 0) dispatch(stateActions.addTodoList(data.data.item))
    })
};
export const changeTaskTC = (todoListId: string, taskId: string, newTask: TaskType): ThunkType => (dispatch: ThunkActionType) => {
    api.changeTask(todoListId, taskId, newTask).then(data => {
        if (data.resultCode === 0) dispatch(stateActions.changeTask(data.data.item))
    })
};
export const deleteTaskTC = (todoListId: string, taskId: string): ThunkType => (dispatch: ThunkActionType) => {
    api.deleteTask(todoListId, taskId).then(data => {
        if (data.resultCode === 0) dispatch(stateActions.deleteTask(todoListId, taskId))
    })
};
export const changeTodoListTitleTC = (todoListId: string, todoListTitle: string): ThunkType => (dispatch: ThunkActionType) => {
    api.changeTodoListTitle(todoListId, todoListTitle).then(data => {
        if (data.resultCode === 0) dispatch(stateActions.changeTodoListTitle(todoListId, todoListTitle))
    })
};



export const initialization = (): ThunkType => async (dispatch: ThunkActionType) => {
    const authState = await api.getAuthState();
    if (!authState.data.id) {
        await api.logIn()
    }
    dispatch(getStateFromServer(true));
};

const getStateFromServer = (initial: boolean): ThunkType => async (dispatch: ThunkActionType) => {
    if (!initial) dispatch(interfaceActions.setFetchingState('fetching new data'));
    const lists = await api.restoreState();
    let listsWithTasks = lists;
    if (lists.length !== 0) {
        dispatch(interfaceActions.setAllTasks(lists.length));
        dispatch(interfaceActions.setCompletedTask(true))
        const getTasks = lists.map(async (item) => {
            return await api.restoreTasks(item.id).then(data => {
                const index = listsWithTasks.findIndex(list => item.id === list.id);
                listsWithTasks[index] = {...item, tasks: data.items};
                dispatch(interfaceActions.setCompletedTask(false))
            })
        });
        await Promise.all(getTasks)
    }
    dispatch(stateActions.setTodoLists(listsWithTasks));
    if (initial) setTimeout(() => dispatch(interfaceActions.completeInitialLoadingState()), 600);
};

export const submitAllChanges = (): ThunkType =>
    async (dispatch: ThunkActionType, getState: () => AppStateType) => {

        dispatch(stateActions.disableEditMode());
        dispatch(interfaceActions.setFetchingState('sending data'))
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
        newTodoLists.forEach(list => {
            const oldList = oldTodoLists.find(oldList => oldList.id === list.id);
            if (oldList && list.title !== oldList.title) {
                editedLists.push(list)
            }
        })

        let addedTasks: Array<TaskType> = [];
        const editedTasks: Array<TaskType> = [];
        newTodoLists.forEach(list => {
            const oldList = oldTodoLists.find(oldList => oldList.id === list.id);
            if (oldList) {
                list.tasks.forEach(task => {
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
                list.tasks.forEach(task => addedTasks.push(task))
            }
        })
        const deletedTasks: Array<TaskType> = [];
        oldTodoLists.forEach(list => {
            const newList = newTodoLists.find(newList => newList.id === list.id);
            if (newList) {
                list.tasks.forEach(task => {
                    const newTask = newList.tasks.find(newTask => newTask.id === task.id)
                    if (!newTask) {
                        deletedTasks.push(task)
                    }
                })
            }
        })

        //progress bar logic
        let allTasks = 0;
        if (deletedLists.length !== 0) allTasks = allTasks + deletedLists.length;
        if (deletedTasks.length !== 0) allTasks = allTasks + deletedTasks.length;
        if (addedLists.length !== 0) allTasks = allTasks + addedLists.length;
        if (addedTasks.length !== 0) allTasks = allTasks + addedTasks.length;
        if (editedLists.length !== 0) allTasks = allTasks + editedLists.length;
        if (editedTasks.length !== 0) allTasks = allTasks + editedTasks.length;
        dispatch(interfaceActions.setAllTasks(allTasks));

        //queries
        dispatch(interfaceActions.setCompletedTask(true))
        if (deletedLists.length !== 0) {
            deletedLists.forEach(list => {
                api.deleteTodoList(list.id).then(data => {
                    if (data.resultCode === 0) dispatch(interfaceActions.setCompletedTask(false))
                })
            })
        }
        if (deletedTasks.length !== 0) {
            deletedTasks.forEach(task => {
                api.deleteTask(task.todoListId, task.id).then(data => {
                    if (data.resultCode === 0) dispatch(interfaceActions.setCompletedTask(false))
                })
            })
        }
        if (editedLists.length !== 0) {
            editedLists.forEach(list => {
                api.changeTodoListTitle(list.id, list.title).then(data => {
                    if (data.resultCode === 0) dispatch(interfaceActions.setCompletedTask(false))
                })
            })
        }
        if (editedTasks.length !== 0) {
            editedTasks.forEach(task => {
                api.changeTask(task.todoListId, task.id, task).then(data => {
                    if (data.resultCode === 0) dispatch(interfaceActions.setCompletedTask(false))
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
                        if (data.resultCode === 0) dispatch(interfaceActions.setCompletedTask(false))
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
                    if (data.resultCode === 0) {
                        newListsId.push({newId: data.data.item.id, oldId: list.id});
                        dispatch(interfaceActions.setCompletedTask(false))
                    }
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

        //swap progress
        dispatch(interfaceActions.setFetchingState('swap items'));

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

        //swap items
        if (listsOrder.length !== 0 || addedLists.length > 1) {
            if (deletedLists.length !== 0 && listsOrder.length !== 0) {
                listsOrder = listsOrder.filter(list => todoListsWithNewId.findIndex(item => item.id === list) !== -1)
            }
            let currentOrder = addedLists.length > 1 ? await api.restoreState().then(data => data.map(item => item.id))
                : todoListsWithNewId.map(list => list.id);
            const swapOrder: Array<{ swappedId: string, beforeSwappedId: string | null }> = [];
            const order = listsOrder.length !== 0 ? listsOrder : todoListsWithNewId.map(list => list.id);
            order.forEach((thisListPosId, index) => {
                if (thisListPosId !== currentOrder[index]) {
                    if (index === 0) swapOrder.push({swappedId: thisListPosId, beforeSwappedId: null})
                    else swapOrder.push({swappedId: thisListPosId, beforeSwappedId: listsOrder[index - 1]});
                    const oldIndex = currentOrder.findIndex(listId => listId === thisListPosId)
                    currentOrder = movePos(currentOrder, oldIndex, index)
                }
            });
            swapOrder.forEach(item => {
                api.swapTodoList(item.swappedId, item.beforeSwappedId)/*.then(data => {
                    if (data.resultCode !== 0) dispatch(actions.setError())
                });*/
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
                newTasksId.forEach(task => {
                    const list = addedTasksInLists.length !== 0 ?
                        addedTasksInLists.find(list => list.todoListId === task.todoListId) : undefined;
                    if (list) {
                        const index = addedTasksInLists.findIndex(list => list.todoListId === task.todoListId);
                        addedTasksInLists[index] = {...list, tasks: [...list.tasks, task.newId]}
                    } else addedTasksInLists.push({todoListId: task.todoListId, tasks: [task.newId]})
                })
                let listsToUpdate: Array<string> = [];
                addedTasksInLists.forEach(item => {
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

            /*console.log(currentListsStateOnServer,
                todoListsWithNewId.find(item => item.id === currentListsStateOnServer![0].todoListId)!
                    .Tasks.map(item => item.id),
                todoListsWithNewId.find(item => item.id === currentListsStateOnServer![0].todoListId)!
                    .Tasks.map(item => item.title))*/

            let requiredOrder: Array<{ todoListId: string, tasks: Array<string> }> = [];
            if (currentListsStateOnServer && tasksOrder.length !== 0) {
                currentListsStateOnServer.forEach(item => {
                    const isItemInOrder = tasksOrder.find(currItem =>
                        currItem.todoListId === item.todoListId);
                    if (isItemInOrder) return;
                    const orderFromCurrentState = todoListsWithNewId.find(list => item.todoListId === list.id)!;
                    requiredOrder.push({
                        todoListId: orderFromCurrentState.id,
                        tasks: orderFromCurrentState.tasks.map(task => task.id)
                    })
                });
                tasksOrder.forEach(item => requiredOrder.push({todoListId: item.todoListId, tasks: item.newTasksOrder}))
            } else if (!currentListsStateOnServer && tasksOrder.length !== 0) {
                requiredOrder = tasksOrder.map(item => ({todoListId: item.todoListId, tasks: item.newTasksOrder}));
            } else if (currentListsStateOnServer && tasksOrder.length === 0) {
                currentListsStateOnServer.forEach(item => {
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
                    await api.swapTasks(item.todoListId, order.swappedId, order.beforeSwappedId)/*.then(data => {
                        if (data.resultCode !== 0) dispatch(actions.setError())
                    })*/
                }
            });
            await Promise.all(swapOrderPending)
        }
        dispatch(interfaceActions.setFetchingState(null));


        if (addedLists.length !== 0 || addedTasks.length !== 0) {
            dispatch(getStateFromServer(false))
        }
    };

export default stateReducer