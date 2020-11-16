
const express = require("express");
const path = require("path");
const fs = require("fs");
const notesDB = require("./db/db.json");
const app = express();

const PORT = process.env.PORT || 8080;

let rawNotes = fs.readFileSync("db/db.json");
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
notesDB.push(req.body);
return res.json(notesDB);
})

app.listen(PORT, function() {
    console.log(`App listening on server http://localhost:${PORT}`);
  });

