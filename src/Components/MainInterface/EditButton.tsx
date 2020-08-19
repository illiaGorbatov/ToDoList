import React from "react";
import styled from "styled-components/macro";
import {interfacePalette, NeumorphColorsType} from "../neumorphColors";
import {animated, SpringValue, useTransition} from "react-spring";
import isEqual from "react-fast-compare";

const EditButtonWrapper = styled.div<{ $palette: NeumorphColorsType }>`
  cursor: pointer;
  position: relative;
  z-index: 3;
  width: 15vw;
  height: 15vw;
  max-width: 210px;
  min-width: 130px;
  max-height: 210px;
  min-height: 130px;
  border-radius: 50%;
  box-shadow: ${props => props.$palette.default ? interfacePalette.shadows : props.$palette.shadows} ;
  background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
`;

const ProgressBackground = styled(animated.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  overflow: hidden;
`;

const Progress = styled(animated.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  background-color: black;
`;

const InnerBackground = styled.div<{ $palette: NeumorphColorsType, $altBackground: boolean }>`
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
  position: absolute;
  background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
  color: ${props => props.$palette.default ? interfacePalette.color : props.$palette.color};
  display: grid;
  place-items: center;
  border-radius: 50%;
  ${props => !props.$altBackground &&
    `&:hover {
        background: ${props.$palette.background};
        color: ${props.$palette.color};
  }`}
`;

//calc([minimum size] + ([maximum size] - [minimum size]) * ((100vw - [minimum viewport width]) / ([maximum viewport width] - [minimum viewport width])));
const InnerEditButtonText = styled(animated.div)`
  z-index: 12;
  text-align: center;
  position: absolute;
  overflow: hidden;
  top: 50%;
  font-size: calc(15px + (50 - 15) * ((100vw - 300px) / (2000 - 300)));
`;

type PropsType = {
    switchEditMode: () => void,
    palette: NeumorphColorsType,
    altBackground: boolean,
    actionMessage: string,
    progressBarAnimation: {clipPath1: SpringValue<string>, clipPath2: SpringValue<string>, opacity: SpringValue<number>}
}

const EditButton:React.FC<PropsType> = ({switchEditMode, palette, altBackground, actionMessage,
                                        progressBarAnimation}) => {

    const textTransition = useTransition(actionMessage, {
        from: {opacity: 1, y: '-100%'},
        enter: {opacity: 1, y: '0%'},
        leave: {opacity: 0, y: '100%'},

    })

    return(
        <EditButtonWrapper onClick={switchEditMode} $palette={palette}>
            <ProgressBackground style={{opacity: progressBarAnimation.opacity}}>
                <Progress style={{clipPath: progressBarAnimation.clipPath1}}/>
                <Progress style={{clipPath: progressBarAnimation.clipPath2}}/>
            </ProgressBackground>
            <InnerBackground $palette={palette}
                             $altBackground={altBackground}>
                {textTransition((style) =>
                    <InnerEditButtonText style={{...style, translateY: '-50%'}}>
                        {actionMessage}
                    </InnerEditButtonText>)}
            </InnerBackground>
        </EditButtonWrapper>
    )
}

export default React.memo(EditButton, isEqual)