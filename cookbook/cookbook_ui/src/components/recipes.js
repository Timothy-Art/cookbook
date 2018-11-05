import React, { PureComponent } from  'react';
import { QueryRenderer, graphql, fetchQuery } from 'react-relay';
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

const ingredientsQuery = graphql`
    query recipesIngredientQuery {
        ingredients {
            edges {
                node {
                    name
                    id
                }
            }
        }
    }
`;

class Recipes extends PureComponent {
    constructor(props){
        super(props);

        this.state = {
            value: 0,
            filters: [],
            tags: []
        };
        this.get_tags();
        this.add_filter = this.add_filter.bind(this);
        this.sub_filter = this.sub_filter.bind(this);
    }

    get_tags(){
        fetchQuery(environment, ingredientsQuery)
            .then(data => {
                return data.ingredients.edges;
            })
            .then(tags => {
                this.setState({tags: [{node: {name: 'Filter Ingredients', id: ''}}, ...tags]});
            });
    }

    add_filter(e){
        let new_tag = this.state.tags.filter(({ node }) => node.id === e.currentTarget.value)[0];
        console.log(new_tag);
        if (new_tag.node.id !== ""){
            this.setState({value: 0, filters: [...this.state.filters, new_tag]})
        }
    }

    sub_filter(id){
        let tags = this.state.filters.filter(({ node }) => node.id !== id);

        this.setState({filters: tags});
    }

    render(){
        console.log(this.state);
        let vars = {ingredients: this.state.filters.map(({ node }) => node.id)};
        console.log(vars);

        return (
            <div>
                <RecipeFilter {...this.state} onChange={this.add_filter} onClick={this.sub_filter} />
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
                                    {props.recipes.edges.map(({ node }) => <Recipe node={node} key={node.id}/>)}
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
        <div className={'box no-padding'}>
            {filters.length === 0
                ? <span className={'tag is-medium is-white has-text-grey-light'} >Tags</span>
                : <IngredientFlex edges={filters} icon={fas.faTimes} onClick={onClick}/>
            }
        </div>
        <div className={'select'}>
            <select onChange={onChange} value={value}>
                {tags.map(({ node }) => <option key={node.id} value={node.id}>{node.name}</option>)}
            </select>
        </div>
    </div>
);

const Recipe = ({ node }) => (
    <div>
        <hr/>
        <h3 className={'subtitle'}>{node.name}</h3>
        <div className={'content'}>
            <p>{node.instructions}</p>
        </div>
        <IngredientFlex edges={node.ingredients.edges} />
        <hr/>
    </div>
);

export default Recipes;
