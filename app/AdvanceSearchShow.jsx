const React = require("react");
const ReactDOM = require("react-dom");
const { useState } = require("react");
const MajorSearch = require("./MajorSearch");

class AdvanceSearchShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value1: "Gender", value2: "College" };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value1: event.target.value1, value2: event.target.value2 });
  }
  //setState not working here

  render() {
    return (
      <div id="results">
        <MajorSearch></MajorSearch>

        <div className="centered">
          <form onSubmit={this.handleSubmit}>
            <h3>Gender: </h3>
            <select
              id="gender"
              className="dropDown"
              onChange={this.handleChange}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </form>

          <form onSubmit={this.handleSubmit}>
            <h3>College: </h3>
            <select
              id="college"
              className="dropDown"
              onChange={this.handleChange}
            >
              <option value="">College</option>
              <option value="Agricultural and Environmental Sciences">
                Agricultural and Environmental Sciences
              </option>
              <option value="Biological Sciences">Biological Sciences</option>
              <option value="Engineering">Engineering</option>
              <option value="Letters and Science">Letters and Science</option>
            </select>
          </form>
        </div>
      </div>
    );
  }
}

module.exports = AdvanceSearchShow;
