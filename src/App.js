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
            token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZTFmNTQxODM0NzEwNjkyNzAzM2QwYTQ0ODFmMTNkNTJiMTA1N2NhMWNkY2I0OTg0ZGNiMWQxZjQzMzdhMzYyNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyMjgzNDM2OSwiaWF0IjoxNjIyNzQ3OTU5LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiNTU0ZGQ5MDQtNGNmYi00NWMxLTkzYjAtNTgwM2Y3ZDc1ZjRhIiwic2lkIjoiNzlmZGFjZDgtMzA0MS00MTBhLTk5ODYtMTg3YWVmZDQyY2Y2In0.uXUlM0KNcgWTRnsdKZ4M5JMVsxtcZCIai0Nlvuo7GFG1qpL_cLsAC2i8hpupDbSNZWJLn9NTDGKzGYIDs8ra9oyzBOmvu2v-Ak5ysDLkQEmHC1ZxCUP0mQ3KhwLlHJ6KeemSlr7_9XGz_T6MkVhK2A0BT5Exg1XwlPM6ltlhsPDP5-8vGyIt0M_eEcJy1ApNWajXDkDj4YvOiRkOWkyRP00-fC2upLfCdy-zA9GuvANtkpcBLNn1nwlB73c3iAob6OVoRccnilMolUe7iOp6PPikZjNe3AUa-Ti9pCyxzhKii9fAirjSE52vyz9oAP1_SZrDgxpdQMIEFObaO3aK-Ty-4fSGmbfAZ_il36pJfmuuYqcLNCTKhWtEELey46KPk34b2dgKkpAz7abpu8P00_s-z_uva7OPO-_6JEm-kwqL5v_BXOHjVerqL2REHx77xW87NHZlKwmXBS9Oo0XzrKHvLCgoWQePZTM3ecPVrh7YTBr_n5Do62p5wzR7_9ulPQotxg9kbeXXxUlYhch32_fzQU4Qm1lTXeU5lGia9y6uplDUNXJYsE3c4sUUZX9TboFk5sXcTmlEwbKG6hsV22_WFOEUpNz6gXh0liWkGy9UTk5DM3mYegECe0NUy1TpMYWHtexUNsSCeACea0XkCmr2K7P8EM_tsY7lr73t5Jo" ?? "",
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

