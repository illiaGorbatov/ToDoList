import React from "react";
import styled, {createGlobalStyle} from "styled-components/macro";
import {library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/free-regular-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";
import TodoListsContainer from "./todolists/TodolistsContainer";
import AnimatedBackground from "./AnimatedBackground";
import MainInterface from "./MainInterface";

library.add(far, fas);

const GlobalStyles = createGlobalStyle`
  * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    };
  body {
    background-color: white;
    margin: 0;
    padding: 0;
    user-select: none;
    outline: none;
    &::-webkit-scrollbar { 
      display: none;
    };
  };
  html {
    -ms-overflow-style: none; 
  }
`;

const Wrapper = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
`;

const App: React.FC = () => {

    return (
        <>
            <GlobalStyles/>
            <AnimatedBackground/>
            <Wrapper>
                <MainInterface/>
                <TodoListsContainer/>
            </Wrapper>
        </>
    );
}

export default App;

