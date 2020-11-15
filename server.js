
const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8080;

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

// api routes
app.get("/api/config", (req,res) => {
    res.json({
        success: true,
    });
});

app.listen(PORT, function() {
    console.log(`App listening on server http://localhost:${PORT}`);
  });

