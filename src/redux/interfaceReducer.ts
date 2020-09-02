import {InferActionTypes} from "./store";
import {defaultPalette, NeumorphColorsType} from "../Components/neumorphColors";

type InitialStateType = {
    focusedStatus: boolean,
    currentPaletteIndex: NeumorphColorsType,
    initialLoadingState: boolean,
    pendingState: boolean,
    swapState: boolean,
    fetchingState: boolean,
    height: number,
    width: number,
    interfaceHeight: number,
    allTasks: number,
    completedTasks: number,
    closeLookState: boolean,
    scrollableState: boolean
};

const initialState = {
    focusedStatus: false,
    currentPaletteIndex: defaultPalette,
    initialLoadingState: true,
    pendingState: false,
    swapState: false,
    fetchingState: false,
    height: 0,
    width: 0,
    interfaceHeight: 0,
    allTasks: 0,
    completedTasks: 0,
    closeLookState: false,
    scrollableState: true
};

const interfaceReducer = (state: InitialStateType = initialState, action: InterfaceActionsTypes): InitialStateType => {
    switch (action.type) {
        case "interfaceReducer/SET_FOCUSED_STATUS":
            return {
                ...state,
                focusedStatus: action.status
            };
        case "interfaceReducer/SET_CURRENT_PALETTE_INDEX":
            return {
                ...state,
                currentPaletteIndex: action.palette
            }
        case "interfaceReducer/COMPLETE_INITIAL_LOADING_STATE":
            return {
                ...state,
                initialLoadingState: false
            }
        case "interfaceReducer/SET_PENDING_STATE":
            return {
                ...state,
                pendingState: action.pendingState
            }
        case "interfaceReducer/SET_HEIGHT":
            return {
                ...state,
                height: action.height
            }
        case "interfaceReducer/SET_WIDTH":
            return {
                ...state,
                width: action.width
            }
        case "interfaceReducer/SET_INTERFACE_HEIGHT":
            return {
                ...state,
                interfaceHeight: action.height
            }
        case "interfaceReducer/SET_ALL_TASKS":
            return {
                ...state,
                allTasks: action.tasks
            }
        case "interfaceReducer/SET_COMPLETED_TASK":
            return {
                ...state,
                completedTasks: action.restore ? 0 : state.completedTasks+1
            }
        case "interfaceReducer/SET_SWAP_STATE":
            return {
                ...state,
                swapState: action.state
            }
        case "interfaceReducer/SET_CLOSE_LOOK_STATE":
            return {
                ...state,
                closeLookState: action.state
            }
        case "interfaceReducer/SET_SCROLLABLE_STATE":
            return {
                ...state,
                scrollableState: action.state
            }
        default:
            return state;
    }
};

export const interfaceActions = {
    setFocusedStatus: (status: boolean) => ({type: 'interfaceReducer/SET_FOCUSED_STATUS', status} as const),
    setPalette: (palette: NeumorphColorsType) => ({type: 'interfaceReducer/SET_CURRENT_PALETTE_INDEX', palette} as const),
    completeInitialLoadingState: () => ({type: 'interfaceReducer/COMPLETE_INITIAL_LOADING_STATE'} as const),
    setPendingState: (pendingState: boolean) => ({type: 'interfaceReducer/SET_PENDING_STATE', pendingState} as const),
    setHeight: (height: number) => ({type: 'interfaceReducer/SET_HEIGHT', height} as const),
    setWidth: (width: number) => ({type: 'interfaceReducer/SET_WIDTH', width} as const),
    setInterfaceHeight: (height: number) => ({type: 'interfaceReducer/SET_INTERFACE_HEIGHT', height} as const),
    setAllTasks: (tasks: number) => ({type: 'interfaceReducer/SET_ALL_TASKS', tasks} as const),
    setCompletedTask: (restore: boolean) => ({type: 'interfaceReducer/SET_COMPLETED_TASK', restore} as const),
    setSwapState: (state: boolean) => ({type: 'interfaceReducer/SET_SWAP_STATE', state} as const),
    setFetchingState: (state: boolean) => ({type: 'interfaceReducer/SET_FETCHING_STATE', state} as const),
    setCloseLookState: (state: boolean) => ({type: 'interfaceReducer/SET_CLOSE_LOOK_STATE', state} as const),
    setScrollableState: (state: boolean) => ({type: 'interfaceReducer/SET_SCROLLABLE_STATE', state} as const),
}

type InterfaceActionsTypes = InferActionTypes<typeof interfaceActions>;

export default interfaceReducer