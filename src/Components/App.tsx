import React, {useEffect} from "react";
import styled, {createGlobalStyle} from "styled-components/macro";
import {library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/free-regular-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";
import AnimatedBackground from "./MainInterface/AnimatedBackground";
import MainInterfaceContainer from "./MainInterface/MainInterfaceContainer";
import ScrollContainer from "./AppAnimatedWrappers/ScrollableElements/ScrollContainer";

library.add(far, fas);

const GlobalStyles = createGlobalStyle`
  * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      touch-action: none;
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

    useEffect(() => {
        const reloadFunction = () => document.location.reload()
        window.addEventListener("orientationchange", reloadFunction)
        return () => window.removeEventListener("orientationchange", reloadFunction)
    }, []);

    return (
        <>
            <GlobalStyles/>
            <AnimatedBackground/>
            <Wrapper>
                <MainInterfaceContainer/>
                <ScrollContainer/>
            </Wrapper>
        </>
    );
}

export default App;

