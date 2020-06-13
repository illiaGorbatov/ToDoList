import React, {useEffect, useRef, useState} from "react";
import '../../App.css';
import styled from "styled-components/macro";
import {useDispatch} from "react-redux";
import {actions} from "../../redux/reducer";
import {animated, useSpring} from "react-spring";

const ListTitle = styled(animated.div)`
  font-family: 'DINNextLTPro-Bold';
  font-size: 25px;
  text-align: center;
  padding: 10px;
  margin: 0 auto;
  width: 100%;
  border-radius: 4px;
  outline: none;
  display: inline-block;
  overflow-wrap: break-word;
  -webkit-line-break: after-white-space;
`;

type PropsType = {
    listTitle: string,
    id: string,
    switchTitleMode: () => void,
    isTitleEditable: boolean
};

const TodoListTitle: React.FC<PropsType> = ({listTitle, id, isTitleEditable, switchTitleMode}) => {

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
        if (e.key === ("Enter" || "Esc")) {
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
        backgroundColor: isTitleEditable ? 'rgba(202, 106, 154, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        color : isTitleEditable ? '#ffffff' : '#ca6a9a'
    });

    return (
        <ListTitle contentEditable={isTitleEditable} ref={ref} style={editModeAnimation}
                   onInput={e => onChangeHandler(e)} onKeyPress={e => onKeyPressHandler(e)}
                   onBlur={onBlurHandler}/>
    );
}

export default React.memo(TodoListTitle);

