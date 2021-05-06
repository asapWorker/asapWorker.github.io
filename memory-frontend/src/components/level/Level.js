import React from "react";
import "./Level.css"

export class Level extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <input type="button" value={this.props.name} className={"level"} onClick={this.props.action}/>
    }
}