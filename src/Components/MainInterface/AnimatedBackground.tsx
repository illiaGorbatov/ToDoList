import React, {useEffect} from "react";
import {shallowEqual, useSelector} from 'react-redux';
import {AppStateType} from "../../redux/store";
import styled from "styled-components/macro";
import {animated, useSpring} from "react-spring";
import {library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/free-regular-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";

library.add(far, fas);


const Background = styled(animated.div)` 
  position: fixed;
  width: 100vw;
  height: 100vh;
`;

const AnimatedBackground:React.FC = () => {

    const currentPalette = useSelector((store: AppStateType) => store.interface.currentPaletteIndex, shallowEqual);

    const [animateBackground, setBackground] = useSpring(() => ({
        background: currentPalette.background
    }));

    useEffect(() => {
        setBackground({background: currentPalette.background})
    }, [currentPalette])

    return <Background style={animateBackground}/>
}

export default AnimatedBackground;

