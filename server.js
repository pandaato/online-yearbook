// server.js, the server's javascript file

// init project
const express = require("express");
// Import modules for login
const bodyParser = require("body-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const request = require("request");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
// Importing modules for database stuff
var sql = require("sqlite3");
var FormData = require("form-data");
var fs = require("fs");

////////////////////////
// Image Upload stuff //
////////////////////////
var app = express();
const multer = require("multer");

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/images");
  },
  // keep the file's original name
  // the default behavior is to make up a random string
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

let uploadMulter = multer({ storage: storage });

// Serves files out of /public
app.use(express.static("public"));

// Next, serve images out of the /images directory
app.use("/images", express.static("images"));

// No route specified, server index.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

// Upload to local
app.post("/upload", uploadMulter.single("newImage"), function(
  request,
  response
) {
  // file is automatically stored in /images
  // WARNING!  Even though Glitch is storing the file, it won't show up
  // when you look at the /images directory when browsing your project
  // until later (or unless you open the console (Tools->Terminal) and type "refresh").
  // So sorry.
  console.log(
    "Recieved",
    request.file.originalname,
    request.file.size,
    "bytes"
  );
  // the file object "request.file" is truthy if the file exists
  if (request.file) {
    // Always send HTTP response back to the browser.  In this case it's just a quick note.
    sendMediaStore("/images/" + request.file.originalname, request, response);
  } else throw "error";
});

// Function to upload image to server via API
function sendMediaStore(image, request, response) {
  let apiKey = process.env.ECS162KEY;
  if (apiKey === undefined) {
    response.status(400);
    response.send("No API key provided");
  } else {
    // we'll send the image from the server in a FormData object
    let form = new FormData();

    // we can stick other stuff in there too, like the apiKey
    form.append("apiKey", apiKey);
    // stick the image into the formdata object
    form.append("storeImage", fs.createReadStream(__dirname + image));
    // and send it off to this URL
    form.submit("http://ecs162.org:3000/fileUploadToAPI", function(
      err,
      APIres
    ) {
      // did we get a response from the API server at all?
      if (APIres) {
        // OK we did
        console.log("API response status", APIres.statusCode);
        // the body arrives in chunks - how gruesome!
        // this is the kind of stream handling that the body-parser
        // module handles for us in Express.
        let body = "";
        APIres.on("data", chunk => {
          body += chunk;
        });
        APIres.on("end", () => {
          // now we have the whole body
          if (APIres.statusCode != 200) {
            response.status(400); // bad request
            response.send(" Media server says: " + body);
          } else {
            response.status(200);
            response.send(body);
            console.log("yeet yaw", image);
            let thing = "." + image;
            console.log(thing);
            // Delete the image from glitch's /images/
             fs.unlink(thing, function (err) {
              if (err) {
                throw err;
              }
              else {
                console.log("File deleted!");
              }
            }); 
          }
        });
      } else {
        // didn't get APIres at all
        response.status(500); // internal server error
        response.send("Media server seems to be down.");
      }
    });
  }
}

///////////////////////
// BUILDING DATABASE //
///////////////////////
// Create interface to file if it exists; else create a new file
const stuDB = new sql.Database("students.db");

// Gets "students.db"
// If it's empty/doesn't existm creates new database
let cmd =
  " SELECT name FROM sqlite_master WHERE type='table' AND name='StudentTable' ";
stuDB.get(cmd, function(err, val) {
  console.log(err, val);
  if (val == undefined) {
    console.log("Creating new database");
    createStudentDB();
  } else {
    console.log("Database file found");
  }
});
function createStudentDB() {
  const cmd =
    "CREATE TABLE StudentTable ( id TEXT PRIMARY KEY UNIQUE, image TEXT, first TEXT, last TEXT, major TEXT, minor TEXT, college TEXT, gender TEXT, content TEXT)";
  stuDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure", err.message);
    } else {
      console.log("Created database");
    }
  });
}

/////////////////
// LOGIN SETUP //
/////////////////
// Setup passport, giving it info about what we want to do
passport.use(
  new GoogleStrategy(
    // object containing data to be sent to Google to kick off the login process
    // the process.env values come from the key.env file of your app
    // They won't be found unless you have put in a client ID and secret for
    // the project you set up at Google
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://bee-ear-book.glitch.me/auth/accepted",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      scope: ["profile", "email"]
    },
    // function to call to once login is accomplished, to get info about user from Google;
    // it is defined at the bottom of this file
    gotProfile
  )
);

// Part of Server's session set-up
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie.
// For instance, if there was some specific profile information, or
// some user history with this Website we pull out of the user table
// using dbRowID.  But for now we'll just pass out the dbRowID itself.
passport.serializeUser((dbRowID, done) => {
  console.log("SerializeUser. Input is", dbRowID);
  done(null, dbRowID);
});

// Called by passport.session pipeline stage on every HTTP request while user is logged in;
// Whatever we pass in the "done" callback goes into the req.user property
// and can be grabbed from there by other middleware functions
passport.deserializeUser((dbRowID, done) => {
  console.log("deserializeUser. Input is:", dbRowID);
  // here is a good place to look up user data in database using
  // dbRowID. Put whatever you want into an object. It ends up
  // as the property "user" of the "req" object.
  let userData = { userData: dbRowID };
  done(null, userData);
});

//////////////////////////////////////////////////////////////////////////////////
//////////////////////// STARTING THE SERVER PIPELINE ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
console.log("Settin up the pipeline B) eat my ass, Mario");

// Take the HTTP message body and put it as a string into request.body
app.use(bodyParser.urlencoded({ extended: true }));

// Puts cookies into request.cookies
app.use(cookieParser());

// Echoes the URL and shows the cookies (this is for debugging);
// the function printIncomingRequest is defined at the bottom of the file
app.use("/", printIncomingRequest);

// Express handles decryption of cookies, storage of session data,
// and deleting expired cookies
app.use(
  expressSession({
    secret: "deezNutzGotteem", // a random string used for encryption of cookies
    maxAge: 6 * 60 * 60 * 1000, // Cookie time out - six hours in milliseconds
    // setting these to default values to prevent warning messages
    resave: true,
    saveUninitialized: false,
    // make a named session cookie; makes one called "connect.sid" as well
    name: "yearbook-session-cookie"
  })
);

// Initializes request object so passport can work with it more
app.use(passport.initialize());

// If there is a valid cookie, will call passport.deserializeUser()
// which is at the bottom of the file; can use this to get user data
// out of a user database table; does nothing if there is no cookie
app.use(passport.session());

// Serving public files out of /public like usual
app.use(express.static("public"));
app.use(bodyParser.json());

// Special case for base URL
// If someone goes to "bee-ear-book.glitch.me/" they end up at the index.html file
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

// If there's a query string attached to the end of index.html
// Currently there's only a query string if the user logged in with non UCD email -Aaron, Friday 5-29
app.get("/index.html/query*", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

// PIPELINE STAGE TO SERVE FILES FROM /user; ONLY WORKS IF USER IS LOGGED IN
// If user is logged in with UCD email (checked by requireUser, defined at bottom)
// and session cookie is present, get giles out of /user using a static server
// Otherwise, user is redirected to public splash page by requireLogin (defined at bottom)
app.get("/user/*", requireLogin, express.static(".")); //originally requireUser was included before requireLogin, but that caused a userData undefined error for some reason

// PIPELINE STAGES THAT HANDLE THE LOGIN PROCESS

// Starts login process by telling browser to redirect to Google
app.get("/auth/google", passport.authenticate("google"));

// After the user interacts with Google, Google redirects them back here
// and we get their Google account info; also checks if they logged in correctly
app.get(
  "/auth/accepted",
  passport.authenticate("google", {
    successRedirect: "/setcookie",
    failureRedirect: "/?email=notUCD"
  })
);

// Before redirecting to the protected page, a cookie is set
app.get("/setcookie", requireUser, function(req, res) {
  // if(req.get('Referrer') && req.get('Referrer').indexOf("google.com")!=-1){
  // mark the birth of this cookie

  // set a public cookie; the session cookie was already set by Passport
  res.cookie("yearbook-session-cookie", new Date());
  res.redirect("https://bee-ear-book.glitch.me/user/creator.html");
});

// PIPELINE STAGES THAT HANDLE D A T A B A S E S

// Puts new item into database
app.post("/newItem", function(request, response) {
  console.log("Server recieved", request.body);
  let id = request.body.id;
  let image = request.body.image;
  let first = request.body.first;
  let last = request.body.last;
  let major = request.body.major;
  let minor = request.body.minor;
  let college = request.body.college;
  let gender = request.body.gender;
  let content = request.body.content;

  // Put new item into database
  cmd =
    "INSERT INTO StudentTable( id, image, first, last, major, minor, college, gender, content) VALUES (?,?,?,?,?,?,?,?,?)";
  stuDB.run(
    cmd,
    id,
    image,
    first,
    last,
    major,
    minor,
    college,
    gender,
    content,
    function(err) {
      if (err) {
        console.log("DB insert error", err.message);
        //next();
      } else {
        response.send(id);
      }
    }
  ); // Callback, shopDB.run
}); // Callback, app.post

// Sends user to filtered yearbook based on search query
app.post("/searchQuery", function(request, response) {
  let url = request.originalUrl;
  console.log("Query received:", request.body);
  
  let first = request.body.first;
  let last = request.body.last;
  let major = request.body.major;
  let minor = request.body.minor;
  let college = request.body.college;
  let gender = request.body.gender;
  
  // Change all spaces into "+"
  let infoList = [first, last, major, minor, college, gender];
  
  for (var i = 0; i < infoList.length - 1; i++) {
    if (infoList[i].includes(" ")) {
      let change = infoList[i].split(" ");
      infoList[i] = "";
      for (var j = 0; j < change.length - 1; j++) {
        infoList[i] = infoList[i].concat(change[j], "+"); 
      }
      infoList[i] = infoList[i].concat(change[change.length - 1]);
    }
  }

  first = infoList[0];
  last = infoList[1];
  major = infoList[2];
  minor = infoList[3];
  college = infoList[4];
  gender = infoList[5];
  
  // Concat all query options into one string
  let query = "";
  if (first)
    query = query.concat("first=", first, "zrgsaru");
  if (last)
    query = query.concat("last=", last, "zrgsaru");
  if (major)
    query = query.concat("major=", major, "zrgsaru")
  if(minor)
    query = query.concat("minor=", minor, "zrgsaru")
  if(college)
    query = query.concat("college=", college, "zrgsaru")
  if(gender)
    query = query.concat("gender=", gender, "zrgsaru")
  
  response.send(query)
}); 

// Retrieves student data based on url id
app.get("/display?*", function(request, response) {
  // Url processing
  let url = request.originalUrl;
  console.log(url);
  if (url.charAt(url.length - 1) == "=") url = url.substring(0, url.length - 1);
  // Initial url is display?id=*, get the substring starting from the character after '?'
  let infoList = url.substring(url.indexOf("=") + 1);
  cmd = "SELECT * FROM StudentTable WHERE id=?";
  stuDB.get(cmd, infoList, function(err, val) {
    if (err) {
      console.log("DB search error", err.message);
    } else {
      response.json(val);
      console.log("Sending:", val);
    }
  });
});


app.get("/yearbook?*", function(request, response) {
  // Url processing
  let url = request.originalUrl;
  if(url.charAt(url.length-1) == '=') url = url.substring(0, url.length-1);
  // Initial url is display?query=*, get the substring starting from the character after '?'
  let infoList = url.substring(url.indexOf("=")+1); 
  
  // Empty search = full yearbook
  if (infoList == "/yearbook?query") {
    stuDB.all("SELECT id, first, last, image FROM StudentTable ORDER BY first, last", function (err, rows) {
      if (err) {
        console.log("DB search error", err.message);
      } else {
        response.json(rows);
        console.log("sending everything");
      }
    })
  } else {
    // Split infoList into individual filters
    infoList = infoList.split("zrgsaru");

    // Split infoList into id's and values
    let infoParts = [];
    for (var i = 0; i < infoList.length - 1; i++) {
      infoParts[i] = infoList[i].split("=");
    }

    // Change all "+" back into spaces
    for (var i = 0; i < infoParts.length; i++) {
      if (infoParts[i][1].includes("+")) {
        let value = infoParts[i][1].split("+");
        infoParts[i][1] = "";
        for (var j = 0; j < value.length - 1; j++) {
          infoParts[i][1] = infoParts[i][1].concat(value[j], " ");
        }
        infoParts[i][1] = infoParts[i][1].concat(value[value.length - 1]);
      }
    }

    cmd = "SELECT id, first, last, image FROM StudentTable WHERE ";

    var notFirst = false;
    for (var i = 0; i < infoList.length - 1; i++) {
      if (notFirst) {
        cmd = cmd.concat("AND ");
      }
      
      if (infoParts[i][0] == "first" || infoParts[i][0] == "last") {
        cmd = cmd.concat(infoParts[i][0], " LIKE '", infoParts[i][1], "%' ")
        notFirst = true;
      } else {
        cmd = cmd.concat(infoParts[i][0], "=? ");
      }
    }
    cmd = cmd.concat("ORDER BY first, last");

    let valueList = [];
    for (var i = 0; i < infoParts.length; i++) {
      if (infoParts[i][0] != "first" && infoParts[i][0] != "last") {
        valueList = valueList.concat(infoParts[i][1]);
      }
    }
    
    console.log(cmd);
    console.log(valueList);

    stuDB.all(cmd, valueList, function(err, rows) {
      if (err) {
        console.log("DB search error", err.message);
      } else {
        response.json(rows);
        console.log("Sending:", rows);
      }
    }) 
  }
}); 

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////// F U N C T I O N S ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Function for debugging. Just prints the incoming URL, and calls next
// Never sends response back  (from Google Login example; thanks professor!)
function printIncomingRequest(req, res, next) {
  console.log("Serving", req.url);
  if (req.cookies) {
    console.log("cookies", req.cookies);
  }
  next();
}

// function that handles response from Google containint the profiles information.
// It is called by Passport after the second time passport.authenticate
// is called (in /auth/accepted/)
function gotProfile(accessToken, refreshToken, profile, done) {
  console.log("Google profile", profile);
  // here is a good place to check if user is in a DB,
  // and to store him in DB if not already there.
  // Second arg to "done" will be passed into serializeUser,
  // should be key to get user out of database.

  // We gon check the if the user's email is from UCD
  console.log("---------------------------");
  console.log("USER EMAIL:", profile._json.email);
  console.log("---------------------------");

  // If the user's email is a UCD email, set dbRowID to 1, which is accept; else 2 - reject
  let userEmail = profile._json.email;
  let isUCDEmail = userEmail.substring(userEmail.length - 11, userEmail.length);
  if (isUCDEmail == "ucdavis.edu") {
    var dbRowID = 1;
  } else {
    var dbRowID = 2;
    request.get(
      "https://accounts.google.com/o/oauth2/revoke",
      {
        qs: { token: accessToken }
      },
      function(err, res, body) {
        console.log("revoked token");
      }
    );
  }

  console.log("---------------------------");
  console.log("DB ROW ID:", dbRowID);
  console.log("---------------------------");

  //let dbRowID = 1;  // temporary! Should be the real unique
  // key for db Row for this user in DB table.
  // Note: cannot be zero, has to be something that evaluates to
  // True.

  done(null, dbRowID);
}

// Function that checks if the user logged in WITH A UCD EMAIL (currently represented by dbRowID -Aaron, Friday 5-29)
function requireUser(req, res, next) {
  console.log("require user", req.user);
  if (req.user.userData != 1) {
    console.log("A NON UCD PERSON TRIED TO LOGIN!!!");
    res.redirect(
      "https://bee-ear-book.glitch.me/index.html/query?email=notUCD"
    );
  } else {
    console.log("User is UCD affiliated!", req.user);
    next();
  }
}

// Function that checks if the user LOGGED IN with a UCD email (represented by cookies)
function requireLogin(req, res, next) {
  console.log("checking:", req.cookies);
  if (!req.cookies["yearbook-session-cookie"]) {
    res.redirect("/");
  } else {
    next();
  }
}
