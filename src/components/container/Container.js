import React from "react";
import "./Container.css"

export class Container extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className={"container"}>
            {this.props.children}
        </div>
    }
}