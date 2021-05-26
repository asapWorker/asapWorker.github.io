import React from "react";
import "./Result.css";

export class Result extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className={"result"}>
            <div className={"text"}>Ваш результат:</div>
            <div className={"data"}>{this.props.flag + " из " +this.props.num}</div>
        </div>
    }
}