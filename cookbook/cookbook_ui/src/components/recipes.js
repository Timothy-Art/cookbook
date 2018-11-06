import React, { PureComponent } from  'react';
import { QueryRenderer, graphql } from 'react-relay';
import * as fas from '@fortawesome/free-solid-svg-icons';
import environment from './environment';
import { IngredientFlex } from "./ingredients";

const recipesQuery = graphql`
    query recipesQuery ($ingredients: [ID], $cursor: String) {
        recipes (ingredients: $ingredients, first: 5, after: $cursor) {
            pageInfo {
                hasNextPage
                endCursor
            }
            edges {
                node {
                    id
                    name
                    instructions
                    ingredients {
                        edges {
                            node {
                                id
                                name 
                            }
                        }
                    }
                }
            }
        }
    }
`;

class Recipes extends PureComponent {
    constructor(props){
        super(props);

        this.state = {
            value: 0
        };
        this.on_change = this.on_change.bind(this);
    }


    on_change(e){
        this.props.add_filter(e.currentTarget.value);
        this.setState({value: 0});
    }

    render(){
        let vars = {ingredients: this.props.filters.map(({ node }) => node.id)};

        return (
            <div>
                <RecipeFilter
                    filters={this.props.filters}
                    tags={this.props.tags}
                    value={this.state.value}
                    onChange={this.on_change}
                    onClick={this.props.sub_filter}
                />
                <QueryRenderer
                    environment={environment}
                    query={recipesQuery}
                    variables={vars}
                    render={({ error, props }) => {
                        if (error){
                            console.log(error);
                            return <div>{error.message}</div>;
                        } else if (props){
                            return (
                                <div>
                                    {props.recipes.edges.map(({ node }) =>
                                        <Recipe node={node} key={node.id} onClick={this.props.add_filter}/>
                                    )}
                                </div>
                            );
                        }
                        return <div>Loading</div>;
                    }}
                />
            </div>
        );
    }
}

const RecipeFilter = ({ filters, tags, value, onChange, onClick }) => (
    <div>
        <div className={'control select'} style={{marginBottom: '5px'}}>
            <select onChange={onChange} value={value}>
                {tags.map(({ node }) => <option key={node.id} value={node.id}>{node.name}</option>)}
            </select>
        </div>
        <div className={'box'}>
            {filters.length === 0
                ? <span className={'tag is-medium is-white has-text-grey-light'} >Tags</span>
                : <IngredientFlex edges={filters} icon={fas.faTimes} onClick={onClick}/>
            }
        </div>
    </div>
);

const Recipe = ({ node, onClick }) => (
    <div>
        <hr/>
        <h3 className={'subtitle'}>{node.name}</h3>
        <div className={'content'}>
            <p>{node.instructions}</p>
        </div>
        <IngredientFlex edges={node.ingredients.edges} onClick={onClick} />
        <hr/>
    </div>
);

export default Recipes;
