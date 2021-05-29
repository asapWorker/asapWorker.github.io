import React, {useContext} from 'react'
import './Card.css'

import {initializeAssistant} from "../../App";

export class Card extends React.Component {
    img;
    constructor(props) {
        super(props);
        this.state = {
            status: "open",
            checked: "",
            time: true,
        };
    }
    check() {
        if (this.state.checked !== "checked") {
            this.setState(this.state = {checked: "checked"})
            if (this.props.answer === "truth") {
                this.props.changeParentFlag(1);
            } else if (this.props.answer === "wrong") {
                this.props.changeParentFlag(-1);
            }
        }
    }
    makeResult() {
        this.setState(this.state = {status: "open", time: false, checked: "checked"});
    }
    render() {
        console.log(this.state.time);
        return <div className={'card ' + this.props.level}>
            <div className={'item ' + this.props.answer + ' ' + this.state.checked}>
                <div className={"index " + this.state.status}>{this.props.index}</div>
                <img className={"picture " + this.state.status} src={this.props.src} alt=""/>
            </div>
        </div>
    }
    componentDidMount() {
        if (this.state.time === true) {
            setTimeout(() => {this.setState(this.state = {status: "close"})}, 7000)
        }
    }
}