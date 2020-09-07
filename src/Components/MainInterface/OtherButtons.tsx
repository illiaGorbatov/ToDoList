import React from "react";
import styled from "styled-components/macro";
import {defaultPalette, NeumorphColorsType} from "../neumorphColors";
import isEqual from "react-fast-compare";
import {isMobile} from "react-device-detect";

const RightButton = styled.div<{ $palette: NeumorphColorsType, $editable: boolean, $height: number }>`
  cursor: pointer;
  position: absolute;
  z-index: 1;
  width: ${props => props.$height * 0.5}px;
  height: ${props => props.$height * 0.5}px;
  border-radius: 30px;
  display: grid;
  place-items: center;
  box-shadow: ${props => props.$palette.default ? defaultPalette.littleShadows : props.$palette.littleShadows};
  background: ${props => props.$palette.default ? defaultPalette.background : props.$palette.background};
  color: ${props => props.$palette.color};
  transform: translate(-50%, -50%);
  top: 50%;
  left: ${props => props.$editable ? '150%' : '50%'};
  transition: left 0.4s cubic-bezier(0.25, 0, 0, 1) 0.3s, background, color 0.4s cubic-bezier(0.25, 0, 0, 1);
  &:hover {
    background: ${props => props.$palette.default ? defaultPalette.background : props.$palette.background};
    color: ${props => props.$palette.default ? defaultPalette.color : props.$palette.color};
  };
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
    box-shadow: ${props => props.$palette.innerLittleShadows};
    opacity: 0;
    transition: opacity .3s linear;
  }
  &:hover:before {opacity: 1}
`;

const LeftButton = styled(RightButton)`
  left: ${props => props.$editable ? '-50%' : '50%'};
`;

const AdditionalButton = styled(RightButton)`
  left: ${props => props.$editable ? '-150%' : '50%'};
`;

const InnerSmallerButtonText = styled.div`
  text-align: center;
  font-size: calc(15px + (25 - 15) * ((100vw - 300px) / (2000 - 300)));
`;

type PropsType = {
    palette: NeumorphColorsType,
    editable: boolean,
    addTodoList: () => void,
    rejectAllChanges: () => void,
    interfaceHeight: number,
    switchScrollableState: () => void,
    scrollableState: boolean
}

const OtherButtons: React.FC<PropsType> = ({palette, editable, switchScrollableState,
                                               interfaceHeight, addTodoList, rejectAllChanges, scrollableState}) => {

    return (
        <>
            <LeftButton onClick={addTodoList} $palette={palette} $editable={editable} $height={interfaceHeight}>
                <InnerSmallerButtonText>
                    Add list
                </InnerSmallerButtonText>
            </LeftButton>
            <RightButton onClick={rejectAllChanges} $palette={palette} $editable={editable} $height={interfaceHeight}>
                <InnerSmallerButtonText>
                    remove changes
                </InnerSmallerButtonText>
            </RightButton>
            {isMobile &&
                <AdditionalButton onClick={switchScrollableState} $palette={palette} $editable={editable} $height={interfaceHeight}>
                    {scrollableState ? 'Drug' : 'Scroll'}
                </AdditionalButton>
            }
        </>
    )
}

export default React.memo(OtherButtons, isEqual)