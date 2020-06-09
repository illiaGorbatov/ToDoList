import React, {useEffect, useRef, useState} from "react";
import '../../App.css';
import styled from "styled-components/macro";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {actions} from "../../redux/reducer";

const ListTitle = styled.div`
  font-family: 'DINNextLTPro-Bold';
  font-size: 25px;
  text-align: center;
  padding: 10px;
`;

type PropsType = {
    listTitle: string;
    id: string;
};

const TodoListTitle: React.FC<PropsType> = ({listTitle, id}) => {

    const dispatch = useDispatch();
    const editable = useSelector((state: AppStateType) => state.todoList.editable);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        ref.current!.textContent = listTitle
    }, [listTitle]);

    const [title, setTitle] = useState<string>(listTitle);
    const onChangeHandler = (e: React.FormEvent<HTMLDivElement>) => {
        setTitle(e.currentTarget.textContent || '')
    };

    const onKeyPressHandler = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            ref.current!.blur();
            dispatch(actions.changeTodoListTitle(id, title))
        }
    };
    const onBlurHandler = () => {

        dispatch(actions.changeTodoListTitle(id, title))
    }

    return (
        <ListTitle className="todoList-header__title" contentEditable={editable} ref={ref}
                   onInput={e => onChangeHandler(e)} onKeyPress={onKeyPressHandler} onBlur={onBlurHandler}/>
    );
}

export default React.memo(TodoListTitle);

