const React = require("react");

class ImgUpload extends React.Component {
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
    // Upload image to flikr storage
    let imgUpload = document.getElementById("imgUpload");

    imgUpload.addEventListener("change", function(e) {
      if (!imgUpload.files[0]) {
        return false;
      }
      
      const selectedFile = imgUpload.files[0];
      const formData = new FormData();
      formData.append("newImage", selectedFile, selectedFile.name);

      let imgUploadLabel = document.getElementById("imgUploadLabel");
      imgUploadLabel.textContent = "Uploading...";

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/upload", true);

      xhr.onloadend = function(e) {
        console.log("http://ecs162.org:3000/images/" + xhr.responseText);

        let image = document.getElementById("studentImg");
        image.src = "http://ecs162.org:3000/images/" + xhr.responseText;

        let imgUploadLabel = document.getElementById("imgUploadLabel");
        imgUploadLabel.textContent = "Replace Image";
      };
      
      xhr.send(formData);
    });
  }
  
  render() {
    return (
      <div id="imgContainer">
        <img id="studentImg" src="../images/profilePic.png"></img>
        <label id="imgUploadLabel" htmlFor="imgUpload">Upload your portrait</label>
        <input type="file" id="imgUpload" className="hidden" accept="image/png, .jpeg, .jpg, image/gif"
        ></input>
      </div>
    );
  };
};

module.exports = ImgUpload;
