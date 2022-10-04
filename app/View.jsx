const React = require("react");
const ReactDOM = require("react-dom");

class View extends React.Component {
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
    // Get data from server
    let url = "/display" + window.location.search;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    // Next, add an event listener for when the HTTP response is loaded
    xhr.addEventListener("load", function() {
      if (xhr.status == 200) {
        let responseStr = xhr.responseText; // get the JSON string
        let data = JSON.parse(responseStr); // turn it into an object

        console.log("Successfully received student json data");
        console.log(data);

        document.getElementById("cardImg").src = data["image"];
        document.getElementById("name").textContent =
          data["first"] + " " + data["last"];
        document.getElementById("myMajor").textContent =
          "Major: " + data["major"];
        if (data["minor"] == "") {
          document.getElementById("myMinor").textContent =
            data["minor"];
        } else if (data["minor"] != "") {
          document.getElementById("myMinor").textContent = "Minor: " + data["minor"];
        }
        document.getElementById("college").textContent =
          "College: " + data["college"];
        document.getElementById("gender").textContent =
          "Gender: " + data["gender"];
        if(data["content"]==""){
           document.getElementById("freeTyping").textContent = data["content"];
        }else if(data["content"]!=""){
          document.getElementById("freeTyping").textContent = "Quote:" + "\ " + data["content"];
        }
       
      } else {
        console.log("Error fetching data");
        console.log(xhr.responseText);
      }
    });
    // Actually send request to server
    xhr.send();
  }

  render() {
    return (
      <div id="body">
        <div id="information">
          <div id="portraitBox">
            <img id="cardImg" alt="user uploaded img" />
          </div>
          <div id="fillIn">
            <div id="name"></div>
            <div id="myMajor"></div>
            <div id="myMinor"></div>
            <div id="college"></div>
            <div id="gender"></div>
            <div id="freeTyping"></div>
          </div>
        </div>

        <div id="footer">
          <a href="index.html" id="home">
            Home
          </a>
          <a href="yearbook.html?query=" id="yearbook">
            Yearbook
          </a>
        </div>
      </div>
    );
  }
}

module.exports = View;
