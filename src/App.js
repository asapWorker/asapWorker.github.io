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
            token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZTFmNTQxODM0NzEwNjkyNzAzM2QwYTQ0ODFmMTNkNTJiMTA1N2NhMWNkY2I0OTg0ZGNiMWQxZjQzMzdhMzYyNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyNDUxMTk2MSwiaWF0IjoxNjI0NDI1NTUxLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiY2I1YmZiMjYtNDhmMi00MmRiLTkwZjItOTUwMjlmYzljMGI1Iiwic2lkIjoiZDlkNDJmNDgtMTAyNy00YzI3LTk1NWQtZGFhYmU1YWNiYjBiIn0.InSgyngGJw66oPsFhej-jHEI5VG4zr51gr06yIQHGjC97y4-AMsMtLMdFRxzWPsmSIVGRiqnpWl7uLzueBCaTdvOLwU_ei5bvhZ1Q62jzVGakNefUEPpLmD2KXkyWJIK5e30D7WPJd3HPzmon1xBwKZu3bDAJepjlSaFwt6HT09U4zjejH6DkzoZ6kVySAejongchOddrMnU0-XNyL6JsgwJAuKn-sgTSOYwWhgjdSF2k5hhv7uc_UasXC8kyi2XAOhJ_eXTKDfe_Mkv4lUxfB8ToAG1crLtGuekhbRh5woUgOlQctV1o2jte39eev2EafLjwrLYM845j3LVrlO7qR7z60nvEh4Y9JTbvvy25wEuWM6ffuEDAC0Vk5iDQvOnsJP8X8P3Eaw6vNIUGSKzLfIB8MqU1xyYdchb4JC4aV5_rSKuggvRWgBxdmznABnITRKXhSV_0vpgjijXusZEtclUG9AE3CNJjDWUcD_ESlJZSoUnonvqwVLvcvpU2uAaaaKz6VAPjOS3L-7nT1Japdvp0JS9C4pvrJsLJ_EzFAKCUdj5BqW-f6UQMW5ZQZlKPN7au7MY5GMrMDUHDWnqsCkceIFwQ4fM4az94_o5T15-tJOEz-iIFIvnytGUgABmn7DfgmJa6oeYNwtabQKMchTo1yiu-3YJydJcOzVH0Ts" ?? "",
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
                this.next.current.style.display = 'none';
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
    next = React.createRef();
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
                        this.state.startGame.call(this, 16);
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
                    <Level num={1} name={"легкий уровень"} startGame={this.state.startGame.bind(this, 9)}/>
                    <Level num={2} name={"средний уровень"} startGame={this.state.startGame.bind(this, 16)}/>
                    <Level num={3} name={"сложный уровень"} startGame={this.state.startGame.bind(this, 25)}/>
                </Container>
            </div>
        } else if (this.state.status === "current" || this.state.status === "finish") {
            return <Fragment>
                <Timer/>
                <Table>{this.state.cards}</Table>
                <Result restart={this.state.restartGame.bind(this)} ref={this.resultRef}></Result>
                <button className={'next'} ref={this.next} onClick={this.state.finishGame.bind(this)}>готово</button>
            </Fragment>
        }
    }
}

export default App

