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
            token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZTFmNTQxODM0NzEwNjkyNzAzM2QwYTQ0ODFmMTNkNTJiMTA1N2NhMWNkY2I0OTg0ZGNiMWQxZjQzMzdhMzYyNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyMzAxMDc1MSwiaWF0IjoxNjIyOTI0MzQxLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiYjM4ZjEyM2YtY2QwNi00YzZmLWFjM2EtNDMxODcyNjlhOTdkIiwic2lkIjoiZjk5YzlkMTMtNjNhZi00ZTBhLWEyNjYtMTg2YTQ3NGQwYTRkIn0.oJrloeI49IiijcWNHycouraesKXfZ3nUqZEnSmvyFz4dJ-RzEb8oTbPDJbNcaxQRlK85--0h56SkmggSpceGGP3X5uWL-zmdNmoXkaVP50SI58YhfM07Ma1cU4-qV0SATwdVemtwrvX8yDH0inqlGXOoI49EissB3Ma2Q4gK65nDiStAspF2bZTk0705M_skE_OYs2ZZ2HwsPW4I7jHzDr1WQGai5eBgvrsade73zMJrWPhpxZY1rRXWQYxLM2v0fG3YmGdW4ONElN71iMlXothH8rBSWvbW3OTlE7zjcxr6OqhGobGfNdVS_23RTIhp0CRMje3L-9I0KisUjL7uNlX7-IImhvR0gaPamInKQVRzzlvd2A7LDnyVZ6zqpHsCZ7dJrzX-kLElAKAjrkCadFeNhyL5NdYTub3SvDSrMA_5BvP9mlfqkfc0K1XBrA5Y4AjW_2JKT0LSaPu5L00VEK_qdZ98LE8x__Kzy1n19LyZ-ThhkpZJ8nJu80_Q60yHzwWfzXQ_YX-zGRuCW5ow668m8wPi2nb1GI70BXiUVTSjXfbMH2BMWzKYUnHJU0INF-KOc4o6u-Ib5YLKaERl9WClIkclINGSOoVtvgc3vi3Q0jtPr0Ko0YtrZpUY-w9cQigA-hSQ83b4q4RTzxtetoTUWNQ_4EiOTph-6SfDwpE" ?? "",
            initPhrase: 'Запусти тренажер памяти',
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

