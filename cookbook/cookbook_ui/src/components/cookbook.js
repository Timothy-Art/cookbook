import React, { PureComponent } from 'react';
import { graphql, fetchQuery } from 'react-relay';
import Recipes from './recipes';
import Ingredients from './ingredients';
import { Spring } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
import './css/cookbook.css';
import environment from "./environment";

const ingredientsQuery = graphql`
    query cookbookIngredientsQuery {
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

export const Flipper = ({ a, b, flipped, config={} }) => {
    let x = flipped ? '0%' : '100%';
    let opacity = flipped ? 1 : 0;
    let opacity_inv = 1 - opacity;

    return (
        <div className={'flip-container'}>
            <Spring
                from={{right: '0%', opacity: 1, opacity_inv: 0}}
                to={{right: x, opacity: opacity, opacity_inv: opacity_inv}}
                config={Object.assign({tension: 170, friction: 20}, config)}
            >
                {props =>  (
                    <div className={'flip'} style={{right: props.right}}>
                        <span
                            className={'flip-segment'}
                            style={{opacity: props.opacity}}
                        >
                            {a}
                        </span>
                        <span
                            className={'flip-segment'}
                            style={{opacity: props.opacity_inv}}
                        >
                            {b}
                        </span>
                    </div>
                )}
            </Spring>
        </div>
    )
};

export const AddonButton = (props) => (
    <span {...props} className={'buttons has-addons'} style={{width: 'fit-content'}}/>
);

class Cookbook extends PureComponent {
    constructor(props){
        super(props);

        this.state = {
            active: true,
            tags: [],
            filters: []
        };

        this.get_tags();

        this.flip = this.flip.bind(this);
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

    flip(){
        this.setState({active: !this.state.active});
    }

    add_filter(id){
        let new_tag = this.state.tags.filter(({ node }) => node.id === id)[0];
        console.log(new_tag);
        if (new_tag.node.id !== ""){
            if (this.state.filters.find(({ node }) => node.id === id) === undefined){
                this.setState({value: 0, filters: [...this.state.filters, new_tag]});
            }
        }
    }

    sub_filter(id){
        let tags = this.state.filters.filter(({ node }) => node.id !== id);

        this.setState({filters: tags});
    }

    render(){
        return(
            <div>
                <div style={{maxWidth: '95%'}}>
                    <Flipper
                        a={
                            <AddonButton  onClick={this.flip}>
                                <span className={'button is-white has-text-grey is-size-4'}>Ingredients</span>
                                <span className={'button is-white has-text-grey is-size-5'}>
                                    <FontAwesomeIcon icon={fas.faArrowRight}/>
                                </span>
                            </AddonButton>
                        }
                        b={
                            <AddonButton onClick={this.flip} >
                                <span className={'button is-white has-text-grey is-size-5'}>
                                    <FontAwesomeIcon icon={fas.faArrowLeft}/>
                                </span>
                                <span className={'button is-white has-text-grey is-size-4'}>Recipes</span>
                            </AddonButton>
                        }
                        flipped={this.state.active}
                    />
                </div>
                <div>
                    <Flipper
                        a={<Ingredients
                            add_filter={this.add_filter}
                        />}
                        b={<Recipes
                            filters={this.state.filters}
                            tags={this.state.tags}
                            add_filter={this.add_filter}
                            sub_filter={this.sub_filter}
                        />}
                        flipped={this.state.active}
                        config={{delay: 100}}
                    />
                </div>
            </div>
        )
    }
}

export default Cookbook;
