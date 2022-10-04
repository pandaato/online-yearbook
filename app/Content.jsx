const React = require("react");
const ReactDOM = require("react-dom");

class Content extends React.Component {
  constructor() {
    super();
    this.state = {
      textAreaValue: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ textAreaValue: event.target.value });
  }

  render() {
    return (
      <div>
        <h3>Talk about yourself (Optional):</h3>
        <textarea
          id="freeTyping"
          value={this.state.textAreaValue}
          onChange={this.handleChange}
          maxLength="300"
        />
      </div>
    );
  }
}

module.exports = Content;
