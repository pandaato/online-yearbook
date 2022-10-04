const React = require("react");

const majors = [
  "Aerospace Science and Engineering",
  "African American and African Studies",
  "Agricultural and Environmental Education",
  "Animal Biology",
  "Animal Science",
  "Animal Science and Management",
  "Anthropology",
  "Applied Chemistry",
  "Applied Mathematics",
  "Applied Physics",
  "Art History",
  "Art Studio",
  "Asian American Studies",
  "Atmospheric Science",
  "Biochemical Engineering",
  "Biochemistry and Molecular Biology",
  "Biological Sciences",
  "Biological Systems Engineering",
  "Biomedical Engineering",
  "Biotechnology",
  "Cell Biology",
  "Chemical Engineering",
  "Chemical Physics",
  "Chemistry",
  "Chicana/Chicano Studies",
  "Chinese",
  "Cinema and Digital Media",
  "Civil Engineering",
  "Classical Civilization",
  "Clinical Nutrition",
  "Cognitive Science",
  "Communication",
  "Community and Regional Development",
  "Comparative Literature",
  "Computer Engineering",
  "Computer Science",
  "Computer Science and Engineering",
  "Design",
  "East Asian Studies",
  "Ecological Management and Restoration",
  "Economics",
  "Electrical Engineering",
  "English",
  "Entomology",
  "Environmental Engineering",
  "Environmental Horticulture and Urban Forestry",
  "Environmental Policy Analysis and Planning",
  "Environmental Science and Management",
  "Environmental Toxicology",
  "Evolution, Ecology and Biodiversity",
  "Food Science",
  "French",
  "Gender, Sexuality and Women Studies",
  "Genetics and Genomics",
  "Geology",
  "German",
  "Global Disease Biology",
  "History",
  "Human Development",
  "Hydrology",
  "International Agricultural Development",
  "International Relations",
  "Italian",
  "Japanese",
  "Landscape Architecture",
  "Linguistics",
  "Managerial Economics",
  "Marine and Coastal Science—Coastal Environmental Processes or Marine Environmental Chemistry",
  "Marine and Coastal Science—Marine Ecology and Organismal Biology",
  "Marine and Coastal Science—Oceans and the Earth System",
  "Materials Science and Engineering",
  "Mathematical Analytics and Operations Research",
  "Mathematical and Scientific Computation",
  "Mathematics",
  "Mechanical Engineering",
  "Medieval and Early Modern Studies",
  "Middle East/South Asia Studies",
  "Molecular and Medical Microbiology (Formerly Microbiology)",
  "Music",
  "Native American Studies",
  "Neurobiology, Physiology and Behavior",
  "Nutrition Science",
  "Pharmaceutical Chemistry",
  "Philosophy",
  "Physics",
  "Plant Biology",
  "Plant Sciences",
  "Political Science",
  "Political Science – Public Service",
  "Psychology",
  "Religious Studies",
  "Russian",
  "Science and Technology Studies",
  "Sociology",
  "Sociology—Organizational Studies",
  "Spanish",
  "Statistics",
  "Sustainable Agriculture and Food Systems",
  "Sustainable Environmental Design",
  "Theatre and Dance",
  "Undeclared/Exploratory Program",
  "Undeclared—Fine Arts",
  "Undeclared—Humanities",
  "Undeclared—Life Sciences",
  "Undeclared—Physical Sciences",
  "Undeclared—Social Sciences",
  "Viticulture and Enology",
  "Wildlife, Fish and Conservation Biology"
];

class MajorSearch extends React.Component {
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
    function autocomplete(inp, arr) {
      var currentFocus;

      // Execute / update when user writes in text field
      inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;

        closeAllLists();
        console.log("Input received");

        if (!val) {
          return false;
        }

        // Create container for matching items
        currentFocus = -1;
        a = document.createElement("DIV");
        a.id = this.id + "autocomplete-list";
        a.classList.add("autocomplete-items");
        this.parentNode.appendChild(a);

        // For each 'match', add new item to list
        for (i = 0; i < arr.length; i++) {
          // Match if stubstring of item name == input
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.textContent = arr[i];

            // Select this item
            b.addEventListener("click", function(e) {
              this.id = "chosen";
              console.log("Selected", this.textContent, "for", a.id.substring(2, 7));
              inp.value = document.getElementById("chosen").textContent;
              closeAllLists();
            });

            a.appendChild(b);
          }
        }
      });

      // Move currentFocus up or down list
      inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");

        if (x) {
          x = x.getElementsByTagName("div");
        }

        if (e.keyCode == 40) {
          // DOWN - move down
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) {
          // UP - move up
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          // ENTER - select current item
          // Prevents submitting form on ENTER
          e.preventDefault();
          let active = document.getElementsByClassName("autocomplete-active")[0];
          active.id = "chosen";
          console.log("Selected", active.textContent, "for", active.parentNode.id.substring(2, 7));
          inp.value = document.getElementById("chosen").textContent;
          closeAllLists();
        }
      });

      // Makes current item more visible
      function addActive(x) {
        if (!x) {
          return false;
        }

        removeActive(x);

        // Wrap around list go top
        if (currentFocus >= x.length) {
          currentFocus = 0;
        }

        // Wrap around list to bottom
        if (currentFocus < 0) {
          currentFocus = x.length - 1;
        }

        x[currentFocus].classList.add("autocomplete-active");
      }

      // Removes "active" class from all items
      function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }

      // Close all items in list
      function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }

      // Closes list when user clicks outside list
      document.addEventListener("click", function(e) {
        closeAllLists(e.target);
      });
    }

    autocomplete(document.getElementById("myMajor"), majors);
    autocomplete(document.getElementById("myMinor"), majors);
  }

  render() {
    return (
      <div className="centered">
        <form autoComplete="off" action="">
          <h3>Major</h3>
          <div className="autocomplete">
            <input id="myMajor" type="text" name="major" placeholder="Choose major"></input>
          </div>
        </form>

        <form autoComplete="off" action="">
          <h3>Minor</h3>
          <div className="autocomplete">
            <input id="myMinor" type="text" name="minor" placeholder="Choose minor"></input>
          </div>
        </form>
      </div>
    );
  };
};

module.exports = MajorSearch;

// Code adapted and edited from https://www.w3schools.com/howto/howto_js_autocomplete.asp
