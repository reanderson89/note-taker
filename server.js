
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const { v4: uuidv4 } = require('uuid');
let notesDB = require("./db/db.json");
const app = express();
const writeFileAsync = util.promisify(fs.writeFile);

let id;

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
    // function that checks to see if the id already exists
    let hasId = (data, id) => {
        return data.some((el) =>{
            return el.id === id;
        })
    }
    let note = req.body;
    id = uuidv4();
    // checks to see if the id being made matches any other id, if it does then this will create a different id. This is not perfect since there is a chance that it could create yet another id that matches, but with the id's being like this "0accba13-a003-4b81-8ef4-341e8dbd0a41" the chances are very slim, but still present.
    if (hasId(notesDB, id)){
        id = uuidv4();
    } 
    console.log(hasId(notesDB, id));
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

