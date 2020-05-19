import React from "react";
import '../App.css';
import TodoListFooterButton from "./TodoListFooterButton";
import {useState} from "react";

type OwnPropsType = {
    filterValue: string;
    changeFilter: (filter: string) => void;
}

const TodoListFooter: React.FC<OwnPropsType>  = (props) => {

    const [isHidden, setHidden] = useState<boolean>(false)

    const onAllFilterClick = () => {props.changeFilter('All')};
    const onCompletedFilterClick = () => {props.changeFilter('Completed')};
    const onActiveFilterClick = () => {props.changeFilter('Active')};
    const onShowFiltersClick = () => {setHidden(false)};
    const onHideFiltersClick = () => {setHidden(true)};

    const classForAll = props.filterValue === 'All' ? 'filter-active' : '',
        classForCompleted = props.filterValue === 'Completed' ? 'filter-active' : '',
        classForActive = props.filterValue === 'Active' ? 'filter-active' : '';

    return (
        <div className="todoList-footer">
            {!isHidden && <div>
                <TodoListFooterButton className={classForAll} value={'All'}
                                      changeFilter={onAllFilterClick}/>
                <TodoListFooterButton className={classForCompleted} value={'Completed'}
                                      changeFilter={onCompletedFilterClick}/>
                <TodoListFooterButton className={classForActive} value={'Active'}
                                      changeFilter={onActiveFilterClick}/>
            </div>}
            {!isHidden && <span onClick={onHideFiltersClick}>hide</span>}
            {isHidden && <span onClick={onShowFiltersClick}>show</span>}
        </div>
    );
}

export default TodoListFooter;

