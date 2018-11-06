import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
import environment from './environment';
import './css/ingredients.css'

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

const Ingredients = ({ add_filter }) => (
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
                        {props.categories.edges.map(({ node }) =>
                            <Category node={node} key={node.id} onClick={add_filter}/>
                        )}
                    </div>
                );
            }
            return <div>Loading</div>;
        }}
    />
);

export const Category = ({ node, onClick }) => (
    <div>
        <hr/>
        <h3 className={'subtitle'}>{node.name}</h3>
        <IngredientFlex edges={node.ingredients.edges} onClick={onClick} />
        <hr/>
    </div>
);

export const IngredientFlex = ({ edges, onClick=()=>{}, icon=fas.faPlus }) => (
    <div className={'ingredient-flex'}>
        {edges.map(({ node }) => <Ingredient node={node} icon={icon} key={node.id} onClick={onClick} />)}
    </div>
);

export const Ingredient = ({ node, icon, onClick }) => (
    <span className={'ingredient button'} onClick={() => onClick(node.id)}>
        <span className={"icon"} style={{fontSize: '0.5rem'}}>
            <FontAwesomeIcon icon={icon} style={{height: '0.6rem'}}/>
        </span>
        <span>
            {node.name}
        </span>
    </span>
);

export default Ingredients;
