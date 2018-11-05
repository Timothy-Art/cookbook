import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from './environment';

const ingredientsQuery = graphql`
    query ingredientsQuery {
      categories {
        edges {
          node {
            id
            name
            ingredients {
              edges {
                node {
                  name
                  id
                }
              }
            }
          }
        }
      }
    }
`;

const Ingredients = () => (
    <QueryRenderer
        environment={environment}
        query={ingredientsQuery}
        render={({ error, props }) => {
            if (error){
                console.log(error);
                return <div>{error.message}</div>;
            } else if (props){
                return (
                    <div>
                        {props.categories.edges.map(({ node }) => <Category node={node} key={node.id}/>)}
                        </div>
                );
            }
            return <div>Loading</div>;
        }}
    />
);

const Category = ({ node }) => (
    <div>
        <hr/>
        <h3 className={'subtitle'}>{node.name}</h3>
        <div>
            {node.ingredients.edges.map(({ node }) => <Ingredient node={node} key={node.id} />)}
        </div>
        <hr/>
    </div>
);

export const Ingredient = ({ node }) => (
    <div>
        {node.name}
    </div>
);

export default Ingredients;
