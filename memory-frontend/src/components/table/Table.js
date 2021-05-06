import React from 'react'
import './Table.css'

export class Table extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className={'table'}>
            {this.props.children}
        </div>
    }
}