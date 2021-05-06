import React, {Fragment} from 'react'
import './App.css'
import {Table} from "./components/table/Table";
import {Card} from "./components/card/Card";
import {Timer} from "./components/timer/Timer";
import {Result} from "./components/result/Result";
import {Level} from "./components/level/Level";
import {Container} from "./components/container/Container";

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
                let src = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
                let countOfAnswers = random(4, 7);
                let answer = src[random(0, level)];
                console.log(answer);
                console.log(countOfAnswers);
                let used = new Set([answer]);
                let cards = [];
                this.setState(this.state = {status: "current", flag: level - countOfAnswers, level: level, changeFlag: changeFlag});
                for (let i = 0; i < level; i++) {
                    let isRight = 0;
                    let isAnswer = 'wrong';
                    let value = 0;
                    if (countOfAnswers !== 0) {
                        isRight = random(0,2);
                        if (isRight === 1) {
                            countOfAnswers--;
                            isAnswer = 'truth';
                            value = answer;
                        }
                    }
                    if (isRight === 0) {
                        while (true) {
                            value = src[random(0, level)];
                            if (!used.has(value)) {
                                used.add(value);
                                break;
                            }
                        }
                    }
                    cards.push(<Card src={value + ".jpg"} index={i + 1} status={"open"} answer={isAnswer} level={'level_' + level} changeParentFlag={changeFlag.bind(this)} key={i}/>)
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
                <input type="button" value="return" onClick={this.state.restartGame.bind(this)}/>
            </Fragment>
        }
    }
}

export default App
