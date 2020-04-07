import * as React from 'react';
import '../App.css';

type StateType ={
    error: boolean;
    title: string;
};
type OwnPropsType = {
    onAddItemClick: (title: string) => void;
    todoListName?: string;
};

class AddNewItemForm extends React.Component<OwnPropsType> {

    state: StateType = {
        error: false,
        title: ''
    };

    onTitleChanged = (e: any) => {
        let newValue = e.currentTarget.value;
        this.setState({title: newValue});
        if (this.state.title !== '')
            this.setState({error: false})
    };

    onAddItemClickHandler = () => {
        if (this.state.title === '') {
            this.setState({error: true})
        } else {
            this.props.onAddItemClick(this.state.title);
            this.setState({error: false, title: ''})
        }
    };

    onKeyPressHandler = (e: any) => {
        if (e.key === "Enter") this.onAddItemClickHandler()
    };

    render() {
        return (
            <div className="todoList-newTaskForm">
                <input type="text" className={this.state.error ? 'error' : ''}
                       placeholder="New item name" value={this.state.title}
                       onChange={this.onTitleChanged} onKeyPress={this.onKeyPressHandler}
                />
                <button onClick={this.onAddItemClickHandler}>Add</button>
            </div>
        );
    }
}

export default AddNewItemForm;

