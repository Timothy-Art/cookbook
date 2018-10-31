import React, { PureComponent } from 'react';
import { Spring } from 'react-spring';
import './css/cookbook.css';


const FlipSwitch = ({ a, b, flipped }) => {
    let x = flipped ? '0%' : '100%';
    console.log(x);

    return (
        <Spring from={{right: '0%'}} to={{right: x}}>
            {props =>  (
                <div className={'flip-switch-container'}>
                    <div className={'flip-switch'} style={props}>
                        <span className={'flip-switch-segment has-background-primary has-text-light is-size-5'}>{a}</span>
                        <span className={'flip-switch-segment has-background-danger has-text-light is-size-5'}>{b}</span>
                    </div>
                </div>
            )}
        </Spring>
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
                <a onClick={this.flip}>
                    <FlipSwitch a={'Ingredients'} b={'Recipes'} flipped={this.state.active}/>
                </a>
                <div>Ingredients</div>
                <div className={'' + this.state.active}>Recipes</div>
            </div>
        )
    }
}

export default Cookbook;
