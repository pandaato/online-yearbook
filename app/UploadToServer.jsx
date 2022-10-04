const React = require("react");

class UploadToServer extends React.Component {
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
    // Creates unique id for student
    let id = Math.random().toString(36).substring(7);
    console.log("generated id:", id);
    document.getElementById("stuId").textContent = id;

    
    let uploadButton = document.getElementById("uploadButton");
    
    uploadButton.addEventListener("click", function(e) {
      // Get the input values and build JSON object
      let data = {
        "id": document.getElementById("stuId").textContent,
        "image": document.getElementById("studentImg").src,
        "first": document.getElementById("firstName").value,
        "last": document.getElementById("lastName").value,
        "major": document.getElementById("myMajor").value,
        "minor": document.getElementById("myMinor").value,
        "college": document.getElementById("college").value,
        "gender": document.getElementById("gender").value,
        "content": document.getElementById("freeTyping").value
      };
      
      // Check to see if all required forms are filled out before uploading
      let complete = true;
      
      function isFilledOut(content, id) {
        if (content == "") {
          document.getElementById(id).classList.add("required");
          complete = false;
        } else {
          document.getElementById(id).classList.remove("required");
        }
      }
      
      isFilledOut(data.first, "firstName");
      isFilledOut(data.last, "lastName");
      isFilledOut(data.major, "myMajor");
      isFilledOut(data.college, "college");
      isFilledOut(data.gender, "gender");
      
      if (!complete) {
        alert("Please fill out all required fields");
        return false;
      }

      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/newItem");
      xhr.setRequestHeader("Content-Type", "application/json");
      console.log("Sending data to server:", data);

      xhr.onload = function() {
        let newUrl = "https://bee-ear-book.glitch.me/view.html?id=" + xhr.responseText;
        window.location.href = newUrl;
      };

      xhr.send(JSON.stringify(data));
    });
  }
  
  render() {
    return (
      <div>
        <div id="uploadButton" className="button">Display</div>
        <div id="stuId" className="hidden"></div>
      </div>
    );
  };
};

module.exports = UploadToServer;
