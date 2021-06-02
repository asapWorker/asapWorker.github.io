import React from 'react'
import './Timer.css'

export class Timer extends React.Component {
    state;
    constructor(props) {
        super(props);
        this.state = {
            time: 6,
            status: 'invisible'
        };
    }
    render() {
        return <div className={'wrap' + " " + this.state.status}>
            <div className={'timer' + " " + this.state.status}>{this.state.time}</div>
        </div>
    }
    componentDidMount() {
        let ind = 6;
        let flag = setInterval(() => {
            this.setState(this.state = {time: ind});
            --ind;
            if (ind === 2) {
                this.setState(this.state = {status: "visible"});
            }
            else if (ind === -1) {
                this.setState(this.state = {status: "invisible"});
                clearInterval(flag);
            }
        }, 1000)
    }
}