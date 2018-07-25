import React, { Component } from "react";
import Card from "./components/card";

class App extends Component {
  constructor() {
    super();
    this.windowSizing = this.windowSizing.bind(this);
    this.chooseCard = this.chooseCard.bind(this);
    this.compareCard = this.compareCard.bind(this);
    this.resetCards = this.resetCards.bind(this);
    this.winGame = this.winGame.bind(this);
    this.cardValues = this.cardValues.bind(this);
    this.loadCardValues = this.loadCardValues.bind(this);
    this.switchUser = this.switchUser.bind(this);
    this.newGame = this.newGame.bind(this);

    // Initial State
    this.state = {
      sizing: "is-desktop",
      modalActive: false,
      alert:'',
      active: 0,
      clicked: 0,
      activeCard: null,
      sets: 3,
      matches: 0,
      tries: 0,
      cardArray: [],
      matchArray: [],
      user: "Red",
      redScore: 0,
      blueScore: 0
    };
  }

  newGame() {
    // iterate cards to reset state
    const cards = this.refs;
    for (var card in cards) {
      if (cards.hasOwnProperty(card)) {
        cards[card].setState({
          clicked: false,
          matched: false
        });
      }
    }
    this.setState({
      active: 0,
      clicked: 0,
      activeCard: null,
      matches: 0,
      tries: 0,
      user: "Red",
      redScore: 0,
      blueScore: 0
    });
    this.loadCardValues();
  }

  cardValues() {
    let initial = 1;
    let arr = [];
    let i = 0;

    while (i < this.state.sets) {
      arr.push(initial);
      initial++;
      i++;
    }

    function shuffle(array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
    return shuffle(arr);
  }

  loadCardValues() {
    // Load card values
    if (this.state.sets > 0) {
      this.setState({
        cardArray: this.cardValues(),
        matchArray: this.cardValues()
      });
    }
  }

  windowSizing() {
    let sizing = window.innerWidth < 769 ? "is-mobile" : "is-desktop";
    if (sizing !== this.state.sizing) {
      this.setState({
        sizing: sizing
      });
    }
  }

  chooseCard(e, value, component) {
    // If the card hasn't already been matched
    if (!component.state.matched) {
      // If no cards have been clicked
      // Set card as clicked
      // Set active to the card's value
      // And the activeCard to the clicked card
      if (this.state.active === 0) {
        this.setState({
          clicked: value,
          active: value,
          activeCard: component
        });
        component.setState({
          clicked: true
        });
      } else {
        // If card is already active
        // Compare cards
        this.compareCard(e, value, component);
      }
    }
  }

  compareCard(e, value, component) {
    // Show the card
    component.setState({
      clicked: true
    });
    // if the clicked card value matches the active card value
    if (component.props.cardValue === this.state.active) {
      // Notify user of a match
      this.setState({
        matches: this.state.matches + 1
      });
      // Give user a point
      if (this.state.user === 'Red') {
        this.setState({
          redScore: this.state.redScore + 1
        });
      } else {
        this.setState({
          blueScore: this.state.blueScore + 1
        });
      }
      // Check if game has been won
      this.winGame();
      // Set the component to matched
      component.setState({
        matched: true
      });
      // Set the active card to matched
      this.state.activeCard.setState({
        matched: true
      });
    }
    // Match or not -- reset the cards
    const self = this;
    setTimeout(() => {
      self.resetCards(component);
    }, 1500);
  }

  resetCards(component) {
    // reset card
    component.setState({
      clicked: false
    });
    // reset state
    this.setState({
      active: 0,
      clicked: 0,
      activeCard: null,
      modalActive: false,
      tries: this.state.tries + 1
    });

    // Switch User
    this.switchUser();

    // iterate cards to reset state
    const cards = this.refs;
    for (var card in cards) {
      if (cards.hasOwnProperty(card)) {
        if (cards[card].state.clicked) {
          cards[card].setState({
            clicked: false
          });
        }
      }
    }
  }

  switchUser() {
    this.setState({
      user: this.state.user === "Red" ? "Blue" : "Red"
    });
  }

  winGame() {
    // Adding +1 to matches to account for delay
    if (this.state.matches + 1 === this.state.sets) {
      // Set winning state
      if (this.state.redScore > this.state.blueScore) {
        this.setState({
          alert: "Red wins!"
        });
      } else {
        this.setState({
          alert: "Blue wins!"
        });
      }
    } else {
      this.setState({
        alert: "Got A Match!"
      });
    }
    this.setState({
      modalActive: true
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this.windowSizing);
    this.loadCardValues();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.windowSizing);
  }

  render() {
    return (
      <div className={"App " + this.state.sizing}>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Memory Game</h1>
              <h2 className="subtitle">Choose A Card</h2>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <article
              className={
                this.state.user === "Red"
                  ? "message is-danger"
                  : "message is-info"
              }
            >
              <div className="message-header">
                <p>User</p>
              </div>
              <div className="message-body">{this.state.user}</div>
            </article>
            <div className="columns game-wrapper">
              <div className="column is-two-thirds game-board">
                <div className="columns">
                  <div className="column">
                    <Card
                      cardValue={this.state.cardArray[0]}
                      ref={"card" + 1}
                      chooseCard={this.chooseCard}
                    />
                  </div>
                  <div className="column">
                    <Card
                      cardValue={this.state.cardArray[1]}
                      ref={"card" + 2}
                      chooseCard={this.chooseCard}
                    />
                  </div>
                  <div className="column">
                    <Card
                      cardValue={this.state.cardArray[2]}
                      ref={"card" + 3}
                      chooseCard={this.chooseCard}
                    />
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <Card
                      cardValue={this.state.matchArray[0]}
                      ref={"card" + 4}
                      chooseCard={this.chooseCard}
                    />
                  </div>
                  <div className="column">
                    <Card
                      cardValue={this.state.matchArray[1]}
                      ref={"card" + 5}
                      chooseCard={this.chooseCard}
                    />
                  </div>
                  <div className="column">
                    <Card
                      cardValue={this.state.matchArray[2]}
                      ref={"card" + 6}
                      chooseCard={this.chooseCard}
                    />
                  </div>
                </div>
              </div>
              <div className="column is-one-thirds game-rules tile is-parent">
                <article className="tile is-child notification is-success">
                  <div className="content">
                    <h3 className="subtitle">Game Rules</h3>
                    <p>User Red goes first.</p>
                    <p>Turn over any two cards. If the two cards match, keep them.</p>
                    <p>The game is over when all the cards have been matched. The player with the most matches wins.</p>
                    <div className="columns">
                      <div className="column">
                        <p className="subtitle">Score</p>
                        <div className="columns">
                          <div className="column">
                            <p>Red<br />{this.state.redScore}</p>
                          </div>
                          <div className="column">
                            <p>Blue<br />{this.state.blueScore}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a className="button is-link" onClick={() => this.newGame()}>Start A New Game</a>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
        <div className={this.state.modalActive ? "modal is-active" : "modal"}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box">
              <article className="media">
                <div className="media-content">
                  <div className="content">
                    <p className="title">{ this.state.alert }</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close"></button>
        </div>
      </div>
    );
  }
}

export default App;
