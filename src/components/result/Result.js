import React from "react";
import "./Result.css";

export class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: 0,
            num: 0,
            visibility: "invisible",
        }
    }
    makeResult(flag, num) {
        this.setState(this.state = {flag: flag, num: num, visibility: "visible"})
    }
    render() {
        return <div className={"result " + this.state.visibility}>
            <div className={"result_container"}>
                <div className={"text"}>Ваш результат:</div>
                <div className={"data"}>{this.state.flag + " из " + this.state.num}</div>
                <button onClick={this.props.restart} className={'btn'}>главная</button>
            </div>
        </div>
    }
}