import React, { PureComponent } from 'react';
import Recipes from './recipes';
import Ingredients from './ingredients';
import { Spring } from 'react-spring';
import './css/cookbook.css';


const FlipSwitch = ({ a, b, flipped }) => {
    let x = flipped ? '0%' : '50%';
    let opacity = flipped ? 1 : 0;
    let opacity_inv = 1 - opacity;

    return (
        <div className={'flip-switch-container'}>
            <Spring
                from={{right: '0%', opacity: 1, opacity_inv: 0}}
                to={{right: x, opacity: opacity, opacity_inv: opacity_inv}}
                config={{tension: 170, friction: 20}}
            >
                {props =>  (
                    <div className={'flip-switch'} style={{right: props.right}}>
                        <span
                            className={'flip-switch-segment has-text-grey is-size-4'}
                            style={{opacity: props.opacity}}
                        >
                            {a}
                        </span>
                        <span
                            className={'flip-switch-segment has-text-grey is-size-4'}
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
                <div onClick={this.flip} style={{maxWidth: '95%', cursor: 'pointer'}}>
                    <FlipSwitch a={'Ingredients'} b={'Recipes'} flipped={this.state.active}/>
                </div>
                {this.state.flipped
                    ? <Recipes />
                    : <Ingredients />
                }
            </div>
        )
    }
}

export default Cookbook;
