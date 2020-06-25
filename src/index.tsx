import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import './App.css';
import store from "./redux/store";
import {Provider} from "react-redux";
/// <reference types="react-dom/experimental"
/*ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));*/

const root = document.getElementById("root") as HTMLElement;
// @ts-ignore
ReactDOM.unstable_createRoot(root).render( <Provider store={store}>
    <App/>
</Provider>);

