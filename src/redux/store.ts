import {applyMiddleware, combineReducers, createStore} from "redux";
import todoListReducer from "./reducer";
import thunk from "redux-thunk";

type RootReducerType = typeof rootReducer;
export type AppType = ReturnType<RootReducerType>

const rootReducer = combineReducers({
    todoList: todoListReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;