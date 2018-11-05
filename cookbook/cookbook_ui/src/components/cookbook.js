import React, { PureComponent } from 'react';
import Recipes from './recipes';
import Ingredients from './ingredients';
import { Spring } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
import './css/cookbook.css';

export const Flipper = ({ a, b, flipped, config={} }) => {
    let x = flipped ? '0%' : '50%';
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
            active: true
        };

        this.flip = this.flip.bind(this);
    }

    flip(){
        this.setState({active: !this.state.active});
    }

    render(){
        console.log(this.state);
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
                        a={<Ingredients />}
                        b={<Recipes />}
                        flipped={this.state.active}
                        config={{delay: 100}}
                    />
                </div>
            </div>
        )
    }
}

export default Cookbook;
