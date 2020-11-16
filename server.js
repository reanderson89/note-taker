
const express = require("express");
const path = require("path");
const fs = require("fs");
// const notesDB = require("./db/db.json");
// const index = require("./assets/js/index");
const app = express();

const PORT = process.env.PORT || 8080;

let rawNotes = fs.readFileSync("./db/db.json");
let notes = JSON.parse(rawNotes);

// middleware to parse incoming body
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// view routes
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req,res) => {
    res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/assets/js/index.js", (req,res) => {
    res.sendFile(path.join(__dirname, "assets/js/index.js"));
});

app.get("/assets/css/styles.css", (req,res) => {
    res.sendFile(path.join(__dirname, "/assets/css/styles.css"));
});

// api routes
app.get("/api/notes", (req,res) => {
    return res.json(notes);
});

app.post("/api/notes", (req,res) => {
let newNote = req.body;
newId = notes[notes.length-1].id+1;
newNote["id"] = newId;
notes.push(newNote);
fs.writeFileSync("./db/db.json", JSON.stringify(notes));
console.log(notes);
return res.json(notes);
});

app.delete("/api/notes/:id", (req,res) => {
let notes2 = notes.filter(function(obj) {
    console.log(req.params.id);
    return obj.id != req.params.id;
});
fs.writeFileSync("./db/db.json", JSON.stringify(notes2));
return res.json(notes2);
});

app.listen(PORT, function() {
    console.log(`App listening on server http://localhost:${PORT}`);
  });

