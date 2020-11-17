
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
let notesDB = require("./db/db.json");
const app = express();
const writeFileAsync = util.promisify(fs.writeFile);

const PORT = process.env.PORT || 8080;

// middleware to parse incoming body
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// view routes
app.get("/notes", (req,res) => {
    res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// routes that enable the server to access the .js and .css files
app.get("/assets/js/index.js", (req,res) => {
    res.sendFile(path.join(__dirname, "/assets/js/index.js"));
});

app.get("/assets/css/styles.css", (req,res) => {
    res.sendFile(path.join(__dirname, "/assets/css/styles.css"));
});

// api routes
app.get("/api/notes", (req,res) => {
     res.json(notesDB);
});

// this takes in the users note, gives it an id, and then pushes the object into the notesDB array
app.post("/api/notes", (req,res) => {
    console.log('this posted');
let note = req.body;
let id = notesDB[notesDB.length-1].id+1;
note.id = id;
notesDB.push(note);
writeFileAsync("./db/db.json", JSON.stringify(notesDB))
            .then(() => {
                res.json(note);
            })
            .catch((err) => console.log(err));
});

// this creates a new array called 'notes2' after filtering through notesDB and only taking those that don't match the chosen id. Thus deleting the chosen id from the array
app.delete("/api/notes/:id", (req,res) => {
    let notes2 = notesDB.filter(note => note.id != req.params.id);
notesDB=notes2;
writeFileAsync("./db/db.json", JSON.stringify(notesDB)).then(() => {
    res.json(notesDB);
}).catch((error) => {
    console.log(error);
});
});

app.listen(PORT, () => {
    console.log(`App listening on server http://localhost:${PORT}`);
  });

