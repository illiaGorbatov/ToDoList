import React, {useEffect, useRef, useState} from "react";
import '../../App.css';
import styled from "styled-components/macro";
import {useDispatch} from "react-redux";
import {actions} from "../../redux/functionalReducer";
import {animated, useSpring} from "react-spring";
import { NeumorphColorsType } from "../neumorphColors";

const ListTitle = styled(animated.div)<{$palette: NeumorphColorsType}>`
  background-image: ${props => props.$palette.background};
  color: ${props => props.$palette.color};
  position: relative;
  font-size: 25px;
  text-align: center;
  padding: 15px 10px;
  margin: 0 auto 10px auto;
  width: 100%;
  border-radius: 10px;
  outline: none;
  display: inline-block;
  overflow-wrap: break-word;
  -webkit-line-break: after-white-space;
  &:before {
      border-radius: 10px;
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: ${props => props.$palette.innerShadows};
  }
`;

type PropsType = {
    listTitle: string,
    id: string,
    switchTitleMode: () => void,
    isTitleEditable: boolean,
    palette: NeumorphColorsType
};

const TodoListTitle: React.FC<PropsType> = ({listTitle, id, isTitleEditable, switchTitleMode, palette}) => {

    const dispatch = useDispatch();

    useEffect(() => {
        if (ref.current && isTitleEditable) {
            ref.current.focus();
            dispatch(actions.setFocusedStatus(true))
        }
    }, [isTitleEditable]);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.textContent = listTitle
        }
    }, [listTitle]);

    const [title, setTitle] = useState<string>(listTitle);
    const onChangeHandler = (e: React.FormEvent<HTMLDivElement>) => {
        setTitle(e.currentTarget.textContent || '')
    };

    const onKeyPressHandler = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" ) {
            e.preventDefault();
            ref.current!.blur()
        }
    };
    const onBlurHandler = () => {
        dispatch(actions.changeTodoListTitle(id, title));
        switchTitleMode();
        dispatch(actions.setFocusedStatus(false))
    };

    const editModeAnimation = useSpring({
        scale: isTitleEditable ? 1.3 : 1.0,
        /*backgroundColor: isTitleEditable ? 'rgba(202, 106, 154, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        color : isTitleEditable ? '#ffffff' : '#ca6a9a'*/
    });

    return (
        <ListTitle contentEditable={isTitleEditable} ref={ref} style={editModeAnimation}
                   onInput={e => onChangeHandler(e)} onKeyPress={e => onKeyPressHandler(e)}
                   onBlur={onBlurHandler}
                   $palette={palette}/>
    );
}

export default React.memo(TodoListTitle);

