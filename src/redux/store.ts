import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension';
import interfaceReducer from "./interfaceReducer";
import stateReducer from "./stateReducer";

const rootReducer = combineReducers({
    todoList: stateReducer,
    interface: interfaceReducer
});

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;

type PropertiesType<T> = T extends { [key: string]: infer U } ? U : never;
export type InferActionTypes<T extends { [key: string]: (...args: any) => any }> = ReturnType<PropertiesType<T>>

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;