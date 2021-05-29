import React, {Fragment, useRef} from 'react'

import {
    createSmartappDebugger,
    createAssistant,
} from "@sberdevices/assistant-client";

import './App.css'
import {Table} from "./components/table/Table";
import {Card} from "./components/card/Card";
import {Timer} from "./components/timer/Timer";
import {Result} from "./components/result/Result";
import {Level} from "./components/level/Level";
import {Container} from "./components/container/Container";

const countOfPictures = 25;

const initializeAssistant = (getState/*: any*/) => {
    if (process.env.NODE_ENV === "development") {
        return createSmartappDebugger({
            token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZTFmNTQxODM0NzEwNjkyNzAzM2QwYTQ0ODFmMTNkNTJiMTA1N2NhMWNkY2I0OTg0ZGNiMWQxZjQzMzdhMzYyNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyMjM1NDgyNiwiaWF0IjoxNjIyMjY4NDE2LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiNGYzMDE1YmYtMDY0My00ZjM5LTkzZGMtZjBjMjNhYWY4MWY4Iiwic2lkIjoiNjU3NmJiNTktNDAxOC00ODc3LWFhNDEtMWZmOGNiMzFiZmY2In0.G4YrZ17I1wvxVDi9t4_Htwd4P_GAnlwJ5TSmhfJXP5jYfBioP_DdgDfO3w0pi1qRiFj7mFXN_a4i-I07ntr14ZE0itN2jNUu_IyGDVWR1u-MO0sfuWsE5QUvgepPdT4CztXI02oAx0jFH68_DWck2SFyN1gzb4EDi5K3Kvfcu5qXcJ6I-xFwu7vhisT491PjrC9jOhP-fTdMcy2LZrkD1INsDz9hp8Z4oNfNuQMVQZm8y6QscrwTDKAdsKWHTtq_gJ3XxZ9vGV2wqGUAs0gDMCMPNqOeAeH7CyWCH5K8f2oYcDH-UIFOHmhdpo9zzl72xznNBO_kgh99tD9gyQgwVa4UGBUlsMYl716GVer7FLHh9fpiMiN0msI_x_dRgsImM4kMRbwrQMkuN_e2YSNtZcjYV2Rbi_x2J-eBSIEUrOTL8adUU-NWzK59-0iFofpGm0YxcstAHYfxhkresSqQ_NYtuf7xF8kWiIYFjvNW9MH7Y1SPlzm0IwyJ2WwjrQ_bmLAGjIQsCStHJUliJ7MZ8wDOpxADGNlqc0the9irOcy5t7xZ2zHIhjoacHdyoujJW9F8UH8h-oyaa1FAEx2ROZxrHS1lcLuDOGh13D8TWEQVDEk4hIkjSMXMB7c23_11c8A4fWQR_zolhrHFImfndwCByq767dv4vMbA1rcoPrI" ?? "",
            initPhrase: 'Запусти память',
            getState,
        });
    }
    return createAssistant({ getState });
};

export {initializeAssistant};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.assistant = initializeAssistant(() => this.getStateForAssistant() );
        this.assistant.on("data", (event/*: any*/) => {
            console.log(`assistant.on(data)`, event);
            const { action } = event
            this.dispatchAssistantAction(action);
        });
        this.assistant.on("start", (event) => {
            console.log(`assistant.on(start)`, event);
        });
        this.state = {
            cards: [],
            flag: 0,
            status: 'start',
            level: 0,
            changeFlag(value) {
                this.setState(this.state = {flag: this.state.flag + value})
            },
            startGame(level) {
                function random(from, till) {
                    return (Math.floor(Math.random() * (till - from)) + from);
                }
                function changeFlag(value) {
                    this.setState(this.state = {flag: this.state.flag + value})
                }
                let countOfAnswers = random(4, 7);
                let answer = random(0, countOfPictures);
                console.log(answer);
                console.log(countOfAnswers);
                let answersIndexes = new Set();
                let used = new Set([answer]);
                let cards = [];

                for (let i = 0; i < countOfAnswers; i++) {
                    while(true) {
                        let ind = random(0, level);
                        if (!answersIndexes.has(ind)) {
                            answersIndexes.add(ind);
                            break;
                        }
                    }
                }
                this.setState(this.state = {status: "current", flag: level - countOfAnswers, level: level, changeFlag: changeFlag});
                for (let i = 0; i < level; i++) {
                    let isAnswer = 'wrong';
                    let value = 0;
                    if (countOfAnswers !== 0 && answersIndexes.has(i)) {
                        {
                            countOfAnswers--;
                            isAnswer = 'truth';
                            value = answer;
                        }
                    }
                    else {
                        while (true) {
                            value = random(0, countOfPictures);
                            if (!used.has(value)) {
                                used.add(value);
                                break;
                            }
                        }
                    }
                    this["c" + i] = React.createRef();
                    cards.push(<Card src={"https://pictures-for-memory-game.s3.eu-north-1.amazonaws.com/" + (value + 1) + ".jpg"} index={i + 1} status={"open"} answer={isAnswer} level={'level_' + level} changeParentFlag={changeFlag.bind(this)} key={i} time={true} ref={this['c' + i]} />)

                }
                this.setState(this.state = {cards: cards});
            },
            finishGame() {
                for (let i = 0; i < this.state.level; i++) {
                    this['c' + i].current.makeResult();
                }
                this.resultRef.current.makeResult(this.state.flag, this.state.level);
                this.setState(this.state = {status: "finish"});
            },
            restartGame() {
                this.setState(this.state = {status: "start"})
            }
        }
    }
    resultRef = React.createRef();
    getStateForAssistant () {
        console.log('getStateForAssistant: this.state:', this.state)
        const state = {};
        return state;
    }
    dispatchAssistantAction (action) {
        console.log('dispatchAssistantAction', action);
        if (action) {
            switch (action.type) {
                case "easy_level":
                    if (this.state.status === "start") {
                        this.state.startGame.call(this, 9);
                    }
                    return;
                case "middle_level":
                    if (this.state.status === "start") {
                        this.state.startGame.call(this, 16);
                    }
                    return;
                case "hard_level":
                    if (this.state.status === "start") {
                        this.state.startGame.call(this, 25);
                    }
                    return;
                case "return_back":
                    if (this.state.status === "finish") {
                        this.state.restartGame.call(this);
                    }
                    return;
                case "check_answers":
                    if (this.state.status === "current") {
                        this.state.finishGame.call(this);
                    }
                case "choose_num":
                    if(this.state.status === "current")
                    this['c' + (action.num - 1)].current.check();
                    return;
            }
        }
    }
    render() {
        if (this.state.status === "start") {
            return <div className={"start_page"}>
                <Container>
                    <Level num={1} name={"легкий уровень"}/>
                    <Level num={2} name={"средний уровень"}/>
                    <Level num={3} name={"сложный уровень"}/>
                </Container>
            </div>
        } else if (this.state.status === "current" || this.state.status === "finish") {
            return <Fragment>
                <Timer/>
                <Table>{this.state.cards}</Table>
                <Result ref={this.resultRef}></Result>
            </Fragment>
        }
    }
}

export default App

