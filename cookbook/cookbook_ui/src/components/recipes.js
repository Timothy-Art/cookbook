import React from  'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from './environment';
import { Ingredient } from "./ingredients";

const recipesQuery = graphql`
    query recipesQuery {
        recipes {
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

const Recipes = () => (
    <QueryRenderer
        environment={environment}
        query={recipesQuery}
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
);

const Recipe = ({ node }) => (
    <div>
        <hr/>
        <h3 className={'subtitle'}>{node.name}</h3>
        <div>
            <p>{node.instructions}</p>
        </div>
        <div>
            {node.ingredients.edges.map(({ node }) => <Ingredient node={node} key={node.id} />)}
        </div>
        <hr/>
    </div>
);

export default Recipes;
