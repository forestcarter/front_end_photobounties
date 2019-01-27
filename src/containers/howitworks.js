import React, { Component } from "react";

export default class HowItWorks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  renderpp() {
    return (
      <p>This is how it works.</p>
    );
  }

  render() {
    return (
      <div className="Signup">
        {
           this.renderpp()
          }
      </div>
    );
  }
}
