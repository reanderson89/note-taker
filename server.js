
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
let notesDB = require("./db/db.json");
// const index = require("./assets/js/index");
const app = express();
const writeFileAsync = util.promisify(fs.writeFile);

const PORT = process.env.PORT || 8080;

// let rawNotes = fs.readFileSync("./db/db.json");
// let notes = JSON.parse(rawNotes);

// middleware to parse incoming body
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// view routes
// app.get("*", (req,res) => {
//     res.sendFile(path.join(__dirname, "public/index.html"));
// });

app.get("/notes", (req,res) => {
    res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


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

app.post("/api/notes", (req,res) => {
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

