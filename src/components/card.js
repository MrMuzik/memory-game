import React from "react";

class Card extends React.Component {
  constructor() {
    super();
    this.cardValue = this.cardValue.bind(this);
    this.cardClick = this.cardClick.bind(this);

    // Card State
    this.state = {
      clicked: false,
      matched: false,
      debuging: false
    };
  }

  cardClick(e) {
    // Pass card back to parent
    if (!this.state.clicked) {
      this.props.chooseCard(e, this.cardValue(), this);
    }
  }

  cardValue() {
    return this.props.cardValue;
  }

  render() {
    const self = this;
    return (
      <div
        className="card"
        onClick={function(e) {
          self.cardClick(e);
        }}
      >
        <p className={!self.state.debuging ? "display-none" : ""}>
          value: {this.props.cardValue}
          <br />
          clicked: {self.state.clicked ? "true" : "false"}
          <br />matched: {self.state.matched ? "true" : "false"}
        </p>
        <div
          className={
            !self.state.clicked && !self.state.matched
              ? "card-image"
              : "card-image display-none"
          }
        >
          <figure className="image is-4by5">
            <img src="images/card-back.jpg" alt="Placeholder" />
          </figure>
        </div>
        <div
          className={
            self.state.clicked || self.state.matched
              ? "card-image"
              : "card-image display-none"
          }
        >
          <img
            src={"images/card-" + this.props.cardValue + ".png"}
            alt={this.props.cardValue}
          />
        </div>
      </div>
    );
  }
}

export default Card;
