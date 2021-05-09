import React, {Fragment} from 'react'
import './App.css'
import {Table} from "./components/table/Table";
import {Card} from "./components/card/Card";
import {Timer} from "./components/timer/Timer";
import {Result} from "./components/result/Result";
import {Level} from "./components/level/Level";
import {Container} from "./components/container/Container";

let countOfPictures = 25;

class App extends React.Component {
    constructor(props) {
        super(props);
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
                    cards.push(<Card src={"https://pictures-for-memory-game.s3.eu-north-1.amazonaws.com/" + (value + 1) + ".jpg"} index={i + 1} status={"open"} answer={isAnswer} level={'level_' + level} changeParentFlag={changeFlag.bind(this)} key={i}/>)

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
    render() {
        if (this.state.status === "start") {
            return <Container>
                <Level name={"легко"} action={this.state.startGame.bind(this, 9)}/>
                <Level name={"средне"} action={this.state.startGame.bind(this, 16)}/>
                <Level name={"сложно"} action={this.state.startGame.bind(this, 25)}/>
            </Container>
        } else if (this.state.status === "current") {
            return <Fragment>
                <input type="button" style={{position: "absolute"}} value="check"
                       onClick={this.state.finishGame.bind(this)}/>
                <Timer/>
                <Table>
                    {this.state.cards}
                </Table>
            </Fragment>
        } else {
            return <Fragment>
                <Result flag={this.state.flag} num={this.state.level}/>
                <input type="button" value="return" onClick={this.state.restartGame.bind(this)} style={{position: 'absolute', top: 0, zIndex: 1001}}/>
            </Fragment>
        }
    }
}

export default App

