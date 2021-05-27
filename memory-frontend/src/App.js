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

let countOfPictures = 25;

const initializeAssistant = (getState/*: any*/) => {
    if (process.env.NODE_ENV === "development") {
        return createSmartappDebugger({
            token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZTFmNTQxODM0NzEwNjkyNzAzM2QwYTQ0ODFmMTNkNTJiMTA1N2NhMWNkY2I0OTg0ZGNiMWQxZjQzMzdhMzYyNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyMjIwNTU4MiwiaWF0IjoxNjIyMTE5MTcyLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiYWEwM2UxNzQtNTc4YS00MWM5LWJiN2ItN2FkMDhlMTVkMzQwIiwic2lkIjoiZDRmMTliMzItY2FhNS00ZWY3LTllNWYtM2NkOWNjNWM3ZDNlIn0.EUsLL2WWjcckFrq4fuii-ZiUt1gaPXszLaPngO-QjGZI0AOPuURM3ZlrH-W8LCn7p200QI7Z67PEbGkrVqdHXErYs1LTT8T-uu9LktqAh8ibE2gv8r5fGVqaK5Il4WZQ_MKkG38ruioS9sAGz3qf5iLppxWrNVE2CxNLeShNK3o2Dcaq_EOiDo22vczUwuCttuTMqwGq-TsbO2NP_NU47Cq-RoivIZCOYG1yredb7IBrBM1sT2MXrkFZ2xmxYveRpkAh64AX5JWehO6BhbELsgUyYlMO135gM6GOVoxY3d_7P1x3FfztNlN1SVrVOXS-8x810uw7mNme2fb6ayd9-yPi1zvcfLcm6OR_TyOI8AZOun6UXxIJxosIFOnaYq6nb0KFRKSUPWYP2gAFgDIexgPE8-4mAI1ZIMcmF5V1C87Pf9eEdWruYWQaT5-JF17XRSJmiQ-cXqLZxzFAhE_KUnLmGdZ0BK8P_HVjgO9GuGokHXqPdRXyl2C0tpJhP0InNhUTwTHt-TriTn52iVLPpfLLwR2c6MQ1lyM5lFenZuZvs1kqLSnVgcPiDvG1AMopL-vOWT5LVebSzcZSsf5O8FK5Cl-Jt5S7VmR8BHjs0M6Y86iPU2t5DAwZDwYhVs1GU14HE_rN0XUS5APyw0bVh1BHastV6VHTdW_AjG0k94A" ?? "",
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
                    cards.push(<Card src={"https://pictures-for-memory-game.s3.eu-north-1.amazonaws.com/" + (value + 1) + ".jpg"} index={i + 1} status={"open"} answer={isAnswer} level={'level_' + level} changeParentFlag={changeFlag.bind(this)} key={i} ref={this['c' + i]} />)

                }
                this.setState(this.state = {cards: cards});
            },
            finishGame() {
                this.setState(this.state = {status: "finish"})
            },
            restartGame() {
                this.setState(this.state = {status: "start"})
            }
        }
    }
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
            return <Container>
                <Level num={1} name={"легкий уровень"}/>
                <Level num={2} name={"средний уровень"}/>
                <Level num={3} name={"сложный уровень"}/>
            </Container>
        } else if (this.state.status === "current") {
            return <Fragment>
                <Timer/>
                <Table>
                    {this.state.cards}
                </Table>
            </Fragment>
        } else {
            return <Fragment>
                <Result flag={this.state.flag} num={this.state.level}/>
            </Fragment>
        }
    }
}

export default App

