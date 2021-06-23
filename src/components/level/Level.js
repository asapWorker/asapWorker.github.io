import React from "react";
import "./Level.css"

export class Level extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <button className={"level"} onClick={this.props.startGame}>
            <div>{this.props.name}</div>
        </button>
    }
}