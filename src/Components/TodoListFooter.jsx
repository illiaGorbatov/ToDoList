import React from 'react';
import '../App.css';
import TodoListFooterButton from "./TodoListFooterButton";

class TodoListFooter extends React.Component {

    state = {
        isHidden: false
    };

    onAllFilterClick = () => {this.props.changeFilter('All')};
    onCompletedFilterClick = () => {this.props.changeFilter('Completed')};
    onActiveFilterClick = () => {this.props.changeFilter('Active')};
    onShowFiltersClick = () => {this.setState({isHidden: false})};
    onHideFiltersClick = () => {this.setState({isHidden: true})};

    render() {
        let classForAll = this.props.filterValue === 'All' ? 'filter-active' : '',
            classForCompleted = this.props.filterValue === 'Completed' ? 'filter-active' : '',
            classForActive = this.props.filterValue === 'Active' ? 'filter-active' : '';

        return (
            <div className="todoList-footer">
                {!this.state.isHidden && <div>
                    <TodoListFooterButton className={classForAll} value={'All'}
                                          changeFilter={this.onAllFilterClick}/>
                    <TodoListFooterButton className={classForCompleted} value={'Completed'}
                                          changeFilter={this.onCompletedFilterClick}/>
                    <TodoListFooterButton className={classForActive} value={'Active'}
                                          changeFilter={this.onActiveFilterClick}/>
                </div>}
                {!this.state.isHidden && <span onClick={this.onHideFiltersClick}>hide</span>}
                {this.state.isHidden && <span onClick={this.onShowFiltersClick}>show</span>}
            </div>
        );
    }
}

export default TodoListFooter;

