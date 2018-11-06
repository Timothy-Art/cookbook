import React, { PureComponent } from 'react';
import { commitMutation, graphql } from 'react-relay';
import './css/add-context.css';
import {RecipeFilter} from "./recipes";

export class RecipeForm extends PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            instructions: '',
            ingredients: [],
            error: ''
        };

        this.set_name = this.set_name.bind(this);
        this.set_instructions = this.set_instructions.bind(this);
        this.add_ingredient = this.add_ingredient.bind(this);
        this.sub_ingredient = this.sub_ingredient.bind(this);
        this.submit = this.submit.bind(this);
        this.reset = this.reset.bind(this);
    }

    set_name(e){
        this.setState({name: e.currentTarget.value});
    }

    set_instructions(e){
        this.setState({instructions: e.currentTarget.value});
    }

    add_ingredient(e){
        console.log(e);
        let new_tag = this.props.tags.filter(({ node }) => node.id === e.currentTarget.value)[0];
        console.log(new_tag);
        if (new_tag.node.id !== ""){
            if (this.state.ingredients.find(({ node }) => node.id === e.currentTarget.value) === undefined){
                this.setState({ingredients: [...this.state.ingredients, new_tag]});
            }
        }
    }

    sub_ingredient(id){
        let tags = this.state.ingredients.filter(({ node }) => node.id !== id);

        this.setState({ingredients: tags});
    }

    submit(){

    }

    reset(){
        this.setState({
            name: '',
            instructions: '',
            ingredients: []
        });
        this.props.deactivate()
    }

    render(){
        return <div className={'dialog'}>
            <div className={'dialog-grid'}>
                <div className={'control is-expanded span-full'}>
                    <input
                        type={'text'}
                        className={'input'}
                        value={this.state.name}
                        onChange={this.set_name}
                        placeholder={'Name'}
                    />
                </div>
                <div className={'control is-expanded span-full'}>
                    <textarea
                        className={'textarea'}
                        value={this.state.instructions}
                        onChange={this.set_instructions}
                        placeholder={'Instructions...'}
                    />
                </div>
                <div className={'control span-full'}>
                    <RecipeFilter
                        filters={this.state.ingredients}
                        tags={[{node: {name: 'Add Ingredient', id: ''}}, ...this.props.tags]}
                        value={0}
                        onChange={this.add_ingredient}
                        onClick={this.sub_ingredient}
                    />
                </div>

                <a className={'button is-fullwidth is-primary'} onClick={this.submit}>Add</a>
                <a className={'button is-fullwidth is-danger'} onClick={this.reset}>Cancel</a>
                {this.state.error !== ''
                    ? <div style={{color: "hsl(348, 100%, 61%)"}}>{this.state.error}</div>
                    : null
                }
            </div>
        </div>
    }
}

class AddContext extends PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            active: false
        };

        this.activate = this.activate.bind(this);
        this.deactivate = this.deactivate.bind(this);
    }

    activate(){
        this.setState({active: true});
    }

    deactivate(){
        this.setState({active: false});
    }

    render(){
        let children = React.Children.map(
            this.props.children,
            (child) => React.cloneElement(child, {deactivate: this.deactivate})
        );

        return <div>
            <a className={'button is-primary'} onClick={this.activate}>Add Recipe</a>
            <div className={this.state.active ? 'add-context-container active' : 'add-context-container'}>
                {children}
            </div>
        </div>
    }
}

export default AddContext;
