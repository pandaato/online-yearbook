const React = require("react");

class Search extends React.Component {
  constructor() {
    super();
    this.handleLoad = this.handleLoad.bind(this);
  }

  // Provides callback for after component loads
  componentDidMount() {
    window.addEventListener("load", this.handleLoad);
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.handleLoad);
  }

  handleLoad() {
    let bar = document.getElementById("bar");

    bar.addEventListener("click", function(e) {
      // Split name from search into first and last
      let name = document.getElementById("search").value;
      let nameSplit = name.split(" ");

      if (!nameSplit[0]) {
        nameSplit[0] = "";
      }

      if (!nameSplit[1]) {
        nameSplit[1] = "";
      }

      let data = {
        first: nameSplit[0],
        last: nameSplit[1],
        major: document.getElementById("myMajor").value,
        minor: document.getElementById("myMinor").value,
        college: document.getElementById("college").value,
        gender: document.getElementById("gender").value
      };

      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/searchQuery");
      xhr.setRequestHeader("Content-Type", "application/json");
      console.log("Sending query to server:", data);

      xhr.onload = function() {
        let newUrl =
          "https://bee-ear-book.glitch.me/yearbook.html?query=" +
          xhr.responseText;
        window.location.href = newUrl;
      };

      xhr.send(JSON.stringify(data));
    });
  }

  render() {
    return (
      <div id="searchButton" className="button">
        <input id="search" type="text" placeholder="Search Name"></input>
        <div id="bar">
          <i className="fa fa-search"></i>
        </div>
      </div>
    );
  }
}

module.exports = Search;
