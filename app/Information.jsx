const React = require("react");
const ReactDOM = require("react-dom");
const AdvanceSearchShow = require("./AdvanceSearchShow");
const MajorSearch = require("./MajorSearch");
const Content = require("./Content");
const ImgUpload = require("./ImgUpload");
const UploadToServer = require("./UploadToServer");

const Information = function() {
  return (
    <div>
      <h1>Information Page</h1>
      <div id="information">
        <ImgUpload></ImgUpload>
        

        <div id="fillIn">
          <div id="name">
            <div>
              <h3>First Name:</h3>
              <input id="firstName" type="text" placeholder="First"></input>
            </div>
            <div>
              <h3>Last Name:</h3>
              <input id="lastName" type="text" placeholder="Last"></input>
            </div>
          </div>
          <AdvanceSearchShow></AdvanceSearchShow>
          <Content></Content>
        </div>
        

      </div>

      <div id="footer">
        <a href="https://bee-ear-book.glitch.me/index.html" id="home">
          Home
        </a>
        <a href="https://bee-ear-book.glitch.me/yearbook.html?query=" id="yearbook">
          Yearbook
        </a>
        <div id="View">
          <UploadToServer></UploadToServer>
        </div>
      </div>
    </div>
  );
};

module.exports = Information;
