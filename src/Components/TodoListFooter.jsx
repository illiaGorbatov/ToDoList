import React from 'react';
import '../App.css';
import TodoListFooterButton from "./TodoListFooterButton";

class TodoListFooter extends React.Component {
    render() {
        let classForAll = this.props.filterValue === 'All' ? 'filter-active' : '',
            classForCompleted = this.props.filterValue === 'Completed' ? 'filter-active' : '',
            classForActive = this.props.filterValue === 'Active' ? 'filter-active' : '';

        return (
            <div className="todoList-footer">
                <TodoListFooterButton className={classForAll} value={'All'}
                                      changeFilter={this.props.changeFilter}/>
                <TodoListFooterButton className={classForCompleted} value={'Completed'}
                                      changeFilter={this.props.changeFilter}/>
                <TodoListFooterButton className={classForActive} value={'Active'}
                                      changeFilter={this.props.changeFilter}/>
            </div>
        );
    }
}

export default TodoListFooter;

