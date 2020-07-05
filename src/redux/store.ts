import {applyMiddleware, combineReducers, createStore} from "redux";
import functionalReducer from "./functionalReducer";
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension';

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;

type PropertiesType<T> = T extends { [key: string]: infer U } ? U : never;
export type InferActionTypes<T extends { [key: string]: (...args: any) => any }> = ReturnType<PropertiesType<T>>

const rootReducer = combineReducers({
    todoList: functionalReducer,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;