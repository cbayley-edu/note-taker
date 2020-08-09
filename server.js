// Require...
const express = require("express");
const path = require("path");
const fs = require("fs");

// Express app
const app = express();
const PORT = process.env.PORT || 3060;

// Needed for express app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Paths db.JSON
const OUTPUT_DIR = path.resolve(__dirname, "db");
const outputPath = path.join(OUTPUT_DIR, "db.json");

// declare array that will store the notes object (between db.json and interface)
let notes = [];

// ROUTES
// send user to notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// send user to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// get notes from db.json
app.get("/api/notes", (req, res) => {

    notes = fs.readFileSync(outputPath, "utf8");
    notes = JSON.parse(notes);

    res.json(notes)
});

// post saved note to db.json 
app.post("/api/notes", (req, res) => {

    notes = fs.readFileSync(outputPath, "utf8");
    notes = JSON.parse(notes);
    // if no notes exist, set the id to 1 otherwise, set the id to 1 plus the last json object's id
    if (notes.length === 0) {
        req.body.id = 1;
    } else {
        req.body.id = notes[notes.length-1].id + 1;
    }
    // use for troubleshooting
    console.log(req.body.id)
    
    notes.push(req.body);
    notes = JSON.stringify(notes);
    // use for troubleshooting
    console.log(notes)
    
    fs.writeFile(outputPath, notes, "utf8", err => {
        if(err) throw err;
    });

    res.json(JSON.parse(notes));
});

// Delete the note by the id
app.delete("/api/notes/:id",(req, res) => {

    notes = fs.readFileSync(outputPath, "utf8");
    notes = JSON.parse(notes);
    notes = notes.filter(note => {
      return note.id != req.params.id;
    }); 
    
    notes = JSON.stringify(notes);
    // use for troubleshooting
    console.log(notes)
    
    fs.writeFile(outputPath, notes, "utf8", err => {
        if(err) throw err;
    });

    res.json(JSON.parse(notes));

});

// Wildcard to capture any other paths and sends user to index.html
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Starts the server to listen on PORT
app.listen(PORT, function() {
  console.log(`App listening on PORT ${PORT}`);
});

