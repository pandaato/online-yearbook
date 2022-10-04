const React = require("react");
const ReactDOM = require("react-dom");
const MajorSearch = require("./MajorSearch");
const AdvanceSearchShow = require("./AdvanceSearchShow");
const Search = require("./Search");

// Functions
// function to check the query string for email query; returns false if email is not UCD email
function checkQueryEmail() {
  let params = new URLSearchParams(location.search);
  // Get the email parameter; should be 'notUCD' if the user tried to login without UCD email
  let email = params.get("email");

  // If the user tried to login without UCD email, warn them by changing login text to red
  if (email == "notUCD") {
    return false;
  } else {
    return true;
  }
}

/* the main page for the index route of this app */
class Splash extends React.Component {
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
  }

  render() {
    return (
      <div className="body">
        <div className="text">
          <h1>CLASS OF 2020 YEARBOOK</h1>

          <div id="down">
            <div id="login">
              <h2>LOGIN</h2>
              <p id="s" className={checkQueryEmail() ? "blacktext" : "redtext"}>
                login with UC Davis email
              </p>
              <a href="/auth/google">
                <img
                  src="https://cdn.glitch.com/a6799230-208a-430d-82bc-06eacb9351f8%2FgoogleButtom.png?v=1590559055582"
                  alt="new"
                  id="button"
                />
              </a>
            </div>

            <div id="right">
              <a href="https://bee-ear-book.glitch.me/yearbook.html?query=" id="yearbookButton">
                Yearbook
              </a>

              <Search></Search>
              
              <div id="searchArea">
                <div id="advanceSearch">Advanced Search</div>
                <div id="searchContent" className="hidden">
                  <AdvanceSearchShow></AdvanceSearchShow>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Splash;
