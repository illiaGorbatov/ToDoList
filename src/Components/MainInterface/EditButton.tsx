import React from "react";
import styled from "styled-components/macro";
import {defaultPalette, NeumorphColorsType} from "../neumorphColors";
import {animated, SpringValue, useTransition} from "react-spring";
import isEqual from "react-fast-compare";

const EditButtonWrapper = styled.div<{ $palette: NeumorphColorsType, $height: number }>`
  position: relative;
  z-index: 3;
  width: ${props => props.$height * 0.8}px;
  height: ${props => props.$height * 0.8}px;
  border-radius: 30px;
  box-shadow: ${props => props.$palette.default ? defaultPalette.shadows : props.$palette.shadows} ;
  background: ${props => props.$palette.default ? defaultPalette.background : props.$palette.background};
`;

const ProgressBackground = styled(animated.div)`
  position: absolute;
  width: 100%;
  border-radius: 30px;
  top: 0;
  background-color: red;
`;

const InnerBackground = styled.div<{ $palette: NeumorphColorsType, $cantBeHovered: boolean }>`
  cursor: ${props => props.$cantBeHovered ? 'inherit' : 'pointer'};
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
  position: absolute;
  background-color: ${props => props.$palette.default ? defaultPalette.background : props.$palette.background};
  color: ${props => props.$palette.default ? defaultPalette.color : props.$palette.color};
  display: grid;
  place-items: center;
  border-radius: 30px;
  &:before {
    border-radius: 25px;
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: 1;
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    box-shadow: ${props => props.$palette.innerShadows};
    opacity: 0;
    transition: opacity .3s linear;
  }
  ${props => !props.$cantBeHovered && `&:hover:before {opacity: 1}`}
`;

//calc([minimum size] + ([maximum size] - [minimum size]) * ((100vw - [minimum viewport width]) / ([maximum viewport width] - [minimum viewport width])));
const InnerEditButtonText = styled(animated.div)`
  z-index: 12;
  text-align: center;
  position: absolute;
  overflow: hidden;
  top: 50%;
  font-size: calc(20px + (35 - 20) * ((100vw - 300px) / (2000 - 300)));
`;

const ProgressCounter = styled(animated.div)`
  font-size: calc(12px + (25 - 12) * ((100vw - 300px) / (2000 - 300)));
  text-align: center;
  position: absolute;
  bottom: 10%;
  border-radius: 30px;
`;

type PropsType = {
    switchEditMode: () => void,
    palette: NeumorphColorsType,
    cantBeHovered: boolean,
    actionMessage: string,
    progressBarAnimation: { value: SpringValue<number>, height: SpringValue<string>, opacity: SpringValue<number> },
    interfaceHeight: number
}

const EditButton: React.FC<PropsType> = ({
                                             switchEditMode, palette, cantBeHovered, actionMessage,
                                             progressBarAnimation, interfaceHeight
                                         }) => {

    const textTransition = useTransition(actionMessage, {
        from: {opacity: 1, y: '-100%'},
        enter: {opacity: 1, y: '0%'},
        leave: {opacity: 0, y: '100%'},
    })

    return (
        <EditButtonWrapper onClick={switchEditMode} $palette={palette} $height={interfaceHeight}>
            <InnerBackground $palette={palette}
                             $cantBeHovered={cantBeHovered}>
                <ProgressBackground style={{
                    height: progressBarAnimation.height,
                    opacity: progressBarAnimation.opacity
                }}/>
                <ProgressCounter style={{opacity: progressBarAnimation.opacity}}>
                    {progressBarAnimation.value.to(value => value.toFixed(0) + ' %')}
                </ProgressCounter>
                {textTransition((style) =>
                    <InnerEditButtonText style={{...style, translateY: '-50%'}}>
                        {actionMessage}
                    </InnerEditButtonText>)}
            </InnerBackground>
        </EditButtonWrapper>
    )
}

export default React.memo(EditButton, isEqual)