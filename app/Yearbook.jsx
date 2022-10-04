const React = require("react");
const ReactDOM = require("react-dom");
const Search = require("./Search");
const AdvanceSearchShow = require("./AdvanceSearchShow");

class Yearbook extends React.Component {
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
    //show advance search
    let s = document.getElementById("advanceSearch");
    let content = document.getElementById("searchContent").className;
    console.log(content);
    s.addEventListener("click", () => {
      if (document.getElementById("searchContent").className == "hidden") {
        console.log(content);
        document.getElementById("searchContent").className = "shown";
      } else if (
        document.getElementById("searchContent").className == "shown"
      ) {
        document.getElementById("searchContent").className = "hidden";
        console.log(content);
      }
    });

    // Get data from server
    let url = "/yearbook" + window.location.search;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    // Next, add an event listener for when the HTTP response is loaded
    xhr.addEventListener("load", function() {
      if (xhr.status == 200) {
        let responseStr = xhr.responseText; // get the JSON string
        let data = JSON.parse(responseStr); // turn it into an object

        console.log("Successfully received student json data");
        console.log(data);
        createCards(data);
      } else {
        console.log("Error fetching data");
        console.log(xhr.responseText);
      }
    });
    // Actually send request to server
    xhr.send();

    // Create cards based returned list of students
    function createCards(info) {
      let gallery = document.getElementById("gallery");
      for (var i = 0; i < info["length"]; i++) {
        let card = document.createElement("a");
        card.classList.add("card");
        card.href =
          "https://bee-ear-book.glitch.me/view.html?id=" + info[i]["id"];
        gallery.appendChild(card);
        
        let img = document.createElement("img");
        img.src = info[i]["image"];
        card.appendChild(img);

        let name = document.createElement("div");
        name.textContent = info[i]["first"] + " " + info[i]["last"];
        card.appendChild(name);
      }
      // If no search results were found, display a message
      console.log(info["length"]);
      if (info["length"] === 0) {
        console.log("NOTHIN");
        let noSrchMsg = document.createElement("p");
        noSrchMsg.textContent = "No search results found.";
        gallery.appendChild(noSrchMsg);
      }
    }
  }

  render() {
    return (
      <div id="yearbook">
        <div id="center">
          <a href="index.html" id="home">
            Home
          </a>
          <Search></Search>
        </div>
        <div id="searchArea">
          <div id="advanceSearch">Advanced Search</div>
          <div id="searchContent" className="hidden">
            <AdvanceSearchShow></AdvanceSearchShow>
          </div>
        </div>
        
        <h2>University of California, Davis</h2>
        <h1>Class of 2020</h1>

        <div id="gallery"></div>
      </div>
    );
  }
}

module.exports = Yearbook;
