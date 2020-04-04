import React from "react";
import '../App.css';
import {useState} from "react";
import styled from "styled-components/macro";



type PropsType = {
    onAddItemClick: (title: string) => void;
    todoListName?: string;
};

const AddNewItemForm: React.FC<PropsType> = (props) => {

    const [error, setError] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');

    const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.currentTarget.value;
        setTitle(newValue);
        if (title !== '') setError(false)
    };

    const onAddItemClickHandler = () => {
        if (title === '') {
            setError(true)
        } else {
            props.onAddItemClick(title);
            setError(false);
            setTitle('')
        }
    };

    const onKeyPressHandler = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") onAddItemClickHandler()
    };

    return (
        <div className="todoList-newTaskForm">
            <input type="text" className={error ? 'error' : ''}
                   placeholder="New item name" value={title}
                   onChange={onTitleChanged} onKeyPress={onKeyPressHandler}
            />
            <button onClick={onAddItemClickHandler}>Add</button>
        </div>
    );
}

export default AddNewItemForm;

