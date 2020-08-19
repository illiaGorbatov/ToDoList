import React from "react";
import styled from "styled-components/macro";
import {interfacePalette, NeumorphColorsType} from "../neumorphColors";
import {animated} from "react-spring";
import isEqual from "react-fast-compare";

const SmallerButton = styled.div<{ $palette: NeumorphColorsType, $editable: boolean }>`
  cursor: pointer;
  position: absolute;
  z-index: 2;
  width: 7vw;
  height: 7vw;
  max-width: 105px;
  min-width: 70px;
  max-height: 105px;
  min-height: 70px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: ${props => props.$palette.default ? interfacePalette.littleShadows : props.$palette.littleShadows};
  background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
  color: ${props => props.$palette.color};
  transform: translate(-50%, -50%);
  top: 50%;
  left: ${props => props.$editable ? '-20%' : '50%'};
  transition: left 0.4s cubic-bezier(0.25, 0, 0, 1) 0.3s, background, color 0.4s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
    color: ${props => props.$palette.default ? interfacePalette.color : props.$palette.color};
  }
`;

const MediumButton = styled(animated.div)<{ $palette: NeumorphColorsType, $editable: boolean }>`
  cursor: pointer;
  position: absolute;
  z-index: 1;
  width: 10vw;
  height: 10vw;
  max-width: 160px;
  min-width: 100px;
  max-height: 160px;
  min-height: 100px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: ${props => props.$palette.default ? interfacePalette.littleShadows : props.$palette.littleShadows};
  background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
  color: ${props => props.$palette.color};
  transform: translate(-50%, -50%);
  top: 50%;
  left: ${props => props.$editable ? '130%' : '50%'};
  transition: left 0.4s cubic-bezier(0.25, 0, 0, 1) 0.3s, background, color 0.4s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${props => props.$palette.default ? interfacePalette.background : props.$palette.background};
    color: ${props => props.$palette.default ? interfacePalette.color : props.$palette.color};
  }
`;

const InnerSmallerButtonText = styled.div`
  text-align: center;
  font-size: calc(10px + (20 - 10) * ((100vw - 300px) / (2000 - 300)));
`;

type PropsType = {
    palette: NeumorphColorsType,
    editable: boolean,
    addTodoList: () => void,
    rejectAllChanges: () => void
}

const OtherButtons: React.FC<PropsType> = ({palette, editable, addTodoList, rejectAllChanges}) => {

    return (
        <>
            <SmallerButton onClick={addTodoList} $palette={palette} $editable={editable}>
                <InnerSmallerButtonText>
                    Add list
                </InnerSmallerButtonText>
            </SmallerButton>
            <MediumButton onClick={rejectAllChanges} $palette={palette} $editable={editable}>
                <InnerSmallerButtonText>
                    remove changes
                </InnerSmallerButtonText>
            </MediumButton>
        </>
    )
}

export default React.memo(OtherButtons, isEqual)